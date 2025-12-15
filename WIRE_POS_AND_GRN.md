# Wire Purchase Orders & GRN (Next Steps)

## Current Status
✅ Suppliers page - DONE (fetches real data)  
✅ Customers page - DONE (fetches real data)  
✅ POS checkout page - DONE (validates stock, calls API)  
⏳ **Purchase Orders page - NEEDS WIRING**  
⏳ **GRN page - NEEDS WIRING**  

---

## STEP 1: Wire Purchase Orders Page

**File**: `/src/app/purchases/orders/new/page.jsx` (or similar)

### Find & Replace this mockData:
```javascript
const mockSuppliers = [
  { id: 'S001', name: 'ABC Suppliers Ltd', ... },
  ...
];
```

### With this fetch code:
```javascript
'use client';
import { useState, useEffect } from 'react';

export default function NewPurchaseOrderPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppRes, prodRes] = await Promise.all([
          fetch('/api/purchases/suppliers/list'),
          fetch('/api/inventory/products/list')
        ]);
        
        const suppData = await suppRes.json();
        const prodData = await prodRes.json();
        
        if (suppData.success) setSuppliers(suppData.suppliers);
        if (prodData.success) setProducts(prodData.products);
      } catch (err) {
        console.error('Failed to load:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading suppliers and products...</div>;

  // Rest of your component using `suppliers` instead of `mockSuppliers`
}
```

### Form Submission:
```javascript
const handleCreatePO = async (formData) => {
  const response = await fetch('/api/purchases/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      supplier_id: formData.supplier_id,
      po_date: new Date().toISOString().split('T')[0],
      warehouse_id: 'default-warehouse', // Set this appropriately
      items: [
        { product_id: '...', quantity: 100, unit_price: 25000 },
        { product_id: '...', quantity: 50, unit_price: 15000 }
      ]
    })
  });

  const data = await response.json();
  if (data.success) {
    alert(`PO created: ${data.po_number}`);
    router.push('/purchases/orders');
  }
};
```

### Update Dropdown:
```jsx
// Old:
{mockSuppliers.map(s => <option>{s.name}</option>)}

// New:
{suppliers.map(s => (
  <option key={s.id} value={s.id}>
    {s.supplier_name} ({s.supplier_code})
  </option>
))}
```

---

## STEP 2: Wire GRN Page (Goods Received Notes)

**File**: `/src/app/procurement/grn/page.jsx` (or similar)

### This is CRITICAL - GRN is where stock increases! ⭐

### Add this fetch code:
```javascript
'use client';
import { useState, useEffect } from 'react';

export default function GRNPage() {
  const [grns, setGRNs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [grnRes, suppRes, prodRes, whRes] = await Promise.all([
          fetch('/api/purchases/grn-new'),
          fetch('/api/purchases/suppliers/list'),
          fetch('/api/inventory/products/list'),
          fetch('/api/inventory/warehouses')
        ]);
        
        const grnData = await grnRes.json();
        const suppData = await suppRes.json();
        const prodData = await prodRes.json();
        const whData = await whRes.json();
        
        if (grnData.success) setGRNs(grnData.grns || grnData.data || []);
        if (suppData.success) setSuppliers(suppData.suppliers);
        if (prodData.success) setProducts(prodData.products);
        if (whData.success) setWarehouses(whData.warehouses);
      } catch (err) {
        console.error('Failed to load:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading GRN data...</div>;

  // Rest of component
}
```

### Create GRN (ATOMIC TRANSACTION):
```javascript
const handleCreateGRN = async (formData) => {
  // IMPORTANT: GRN automatically:
  // 1. Increases product.current_stock
  // 2. Creates product_batches
  // 3. Creates stock_movements records
  // All in atomic transaction!

  const response = await fetch('/api/purchases/grn-new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      supplier_id: formData.supplier_id,
      warehouse_id: formData.warehouse_id,
      items: [
        {
          product_id: '...',
          quantity_received: 100,
          unit_cost: 25000,
          batch_number: 'BATCH-2025-001',
          manufacture_date: '2025-11-01',
          expiry_date: '2026-11-01'
        }
      ]
    })
  });

  const data = await response.json();
  if (data.success) {
    alert(`GRN created: ${data.grn_number}`);
    // Stock has increased! Verify in inventory/products
    router.push('/procurement/grn');
  } else {
    alert(`Error: ${data.error}`);
  }
};
```

### Display GRN List:
```jsx
<table>
  <tbody>
    {grns.map(grn => (
      <tr key={grn.id}>
        <td>{grn.grn_number}</td>
        <td>{suppliers.find(s => s.id === grn.supplier_id)?.supplier_name}</td>
        <td>{grn.status}</td>
        <td>{new Date(grn.grn_date).toLocaleDateString()}</td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## STEP 3: Verify Complete Flow

### Test Sequence:
1. **Create Supplier** (Suppliers page) ✅
2. **Create Purchase Order** (POs page) - Add items, set quantities, submit
3. **Receive GRN** (GRN page) - Create GRN for the PO (stock increases!)
4. **Check Stock** (Products page) - Verify product.current_stock increased
5. **Create Customers** (Customers page) ✅
6. **Sell via POS** (POS page) - Try oversell (409), then valid sale ✅
7. **Check Movements** (Inventory Movements) - See IN and OUT records

### Expected Results:
```
Initial stock: 0

After GRN (100 units):
  stock = 100
  stock_movements: 1 IN record

After POS sale (50 units):
  stock = 50
  stock_movements: 2 records (1 IN, 1 OUT)

Attempt POS sale (60 units):
  Returns: 409 Conflict "Insufficient stock"
```

---

## API Endpoints Reference

### List GRNs
```
GET /api/purchases/grn-new
Response: { success: true, data: [...], total, page, limit }
```

### Create GRN (CRITICAL)
```
POST /api/purchases/grn-new
Body: {
  supplier_id: "uuid",
  warehouse_id: "uuid",
  items: [
    {
      product_id: "uuid",
      quantity_received: 100,
      unit_cost: 25000,
      batch_number: "BATCH-2025-001",
      manufacture_date: "2025-11-01",
      expiry_date: "2026-11-01"
    }
  ]
}
Response: { success: true, grn_id, grn_number, message }
```

### Create Purchase Order
```
POST /api/purchases/orders
Body: {
  supplier_id: "uuid",
  po_date: "2025-12-14",
  warehouse_id: "uuid",
  items: [
    { product_id: "uuid", quantity: 100, unit_price: 25000 }
  ]
}
Response: { success: true, po_id, po_number, total_amount }
```

### List Purchase Orders
```
GET /api/purchases/orders
Response: { success: true, orders: [...] }
```

---

## Copy-Paste Ready Examples

### Example: PO Creation Form Submission
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const poItems = []; // Collect from form
  for (let i = 0; i < lineItems.length; i++) {
    poItems.push({
      product_id: lineItems[i].product_id,
      quantity: lineItems[i].quantity,
      unit_price: lineItems[i].unit_price
    });
  }

  const res = await fetch('/api/purchases/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      supplier_id: selectedSupplier,
      po_date: new Date().toISOString().split('T')[0],
      warehouse_id: 'default-warehouse',
      items: poItems
    })
  });

  if (res.ok) {
    const data = await res.json();
    alert(`✅ PO Created: ${data.po_number}`);
  } else {
    alert(`❌ Error: ${(await res.json()).error}`);
  }
};
```

### Example: GRN Creation Form Submission
```javascript
const handleCreateGRN = async (e) => {
  e.preventDefault();
  
  const grnItems = [];
  for (let i = 0; i < receivedItems.length; i++) {
    grnItems.push({
      product_id: receivedItems[i].product_id,
      quantity_received: receivedItems[i].quantity,
      unit_cost: receivedItems[i].unit_cost,
      batch_number: receivedItems[i].batch_number,
      manufacture_date: receivedItems[i].mfg_date,
      expiry_date: receivedItems[i].exp_date
    });
  }

  const res = await fetch('/api/purchases/grn-new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      supplier_id: selectedSupplier,
      warehouse_id: selectedWarehouse,
      items: grnItems
    })
  });

  if (res.ok) {
    const data = await res.json();
    alert(`✅ GRN Created: ${data.grn_number}`);
    // Stock has been increased!
  } else {
    alert(`❌ Error: ${(await res.json()).error}`);
  }
};
```

---

## Quick Checklist

- [ ] Find Purchase Orders page file
- [ ] Replace mockSuppliers with API fetch
- [ ] Update form submission to POST /api/purchases/orders
- [ ] Update dropdown to show real suppliers
- [ ] Find GRN page file
- [ ] Replace mockData with API fetches
- [ ] Update form submission to POST /api/purchases/grn-new
- [ ] Test complete flow: Supplier → PO → GRN → Stock increases
- [ ] Test POS: Try oversell (409), then valid sale
- [ ] Check inventory movements audit trail

---

## Still Using Mock Data?

If you see these errors:
```
Error: mockSuppliers is not defined
Error: mockProducts is not defined
```

It means you're still using the old mock data references. Find and replace them with the real data variables from the API fetches.

**Search for**:
```
mockSuppliers
mockProducts
mockCustomers
mockOrders
```

**Replace with**:
```
suppliers
products
customers
orders
```

---

**Status**: 2 down, 2 to go!  
**Next Focus**: Wire POs and GRN for full supply chain visibility
