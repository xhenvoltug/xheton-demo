# Frontend Integration TODO

## Problem
UI pages are displaying hardcoded `mockData` instead of calling the real APIs you built.

## Solution
Replace `mockData` with actual API calls in each page component.

---

## CRITICAL PAGES (Wire up first - core business flow)

### 1. ✅ SUPPLIERS LIST
**File**: `/src/app/suppliers/page.jsx`

**Current**: Uses `mockSuppliers` array (lines 15-19)

**Required Changes**:
```javascript
'use client';
import { useState, useEffect } from 'react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/purchases/suppliers/list')
      .then(r => r.json())
      .then(data => {
        setSuppliers(data.suppliers);
        setLoading(false);
      });
  }, []);

  // Replace mockSuppliers with suppliers throughout the page
  // Line 110: mockSuppliers.filter → suppliers.filter
  // Line 124: {mockSuppliers.length} → {suppliers.length}
  // Line 149-152: All calculations use mockSuppliers → use suppliers
}
```

**Key Changes**:
- Line 110: `mockSuppliers.filter()` → `suppliers.filter()`
- Line 124: `mockSuppliers.length` → `suppliers.length`
- Lines 149-152: All mockSuppliers references → suppliers
- Add loading state while fetching

---

### 2. ✅ CUSTOMERS LIST
**File**: `/src/app/customers/page.jsx`

**Current**: Uses mock customers

**Required API**:
```
GET /api/sales/customers
```

**Changes**:
- Fetch from `/api/sales/customers` in useEffect
- Replace mockCustomers with fetched data
- Call `POST /api/sales/customers` on form submit

---

### 3. ✅ PURCHASE ORDERS
**File**: `/src/app/purchases/orders/new/page.jsx`

**Current**: Uses `mockSuppliers` dropdown (line 142)

**Required API**:
```
GET /api/purchases/suppliers/list → populate dropdown
POST /api/purchases/orders → create new PO with items
GET /api/purchases/orders → list existing POs
```

**Changes**:
- Fetch suppliers on mount for dropdown
- Replace mockSuppliers with real suppliers
- Submit form data to `/api/purchases/orders` with structure:
```javascript
{
  supplier_id: "uuid",
  po_date: "2025-12-14",
  warehouse_id: "uuid",
  items: [
    { product_id: "uuid", quantity: 100, unit_price: 25000 },
    { product_id: "uuid", quantity: 50, unit_price: 15000 }
  ]
}
```

---

### 4. ✅ GRN (GOODS RECEIVED NOTES)
**File**: `/src/app/procurement/grn/page.jsx`

**Current**: Uses mock data

**Required API**:
```
POST /api/purchases/grn-new → Create GRN (stock increases!)
GET /api/purchases/grn-new → List GRNs
```

**This is CRITICAL**: GRN is where stock increases in your system!

**Changes**:
- Fetch from `/api/purchases/grn-new` on mount
- Submit GRN form data:
```javascript
{
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
```

---

### 5. ✅ POS SALE (CHECKOUT)
**File**: `/src/app/pos/sale/page.jsx`

**Current**: Uses `mockProducts` hardcoded (lines 26-31)

**Required APIs**:
```
GET /api/inventory/products/list → product selection
POST /api/sales/checkout → process sale (stock validation + decrease)
```

**This is CRITICAL**: POS checkout validates stock and prevents overselling!

**Changes**:
- Replace mockProducts with real products from DB
- On checkout, submit to `/api/sales/checkout`:
```javascript
{
  customer_id: "uuid",
  warehouse_id: "uuid",
  items: [
    { product_id: "uuid", quantity: 5 },
    { product_id: "uuid", quantity: 2 }
  ]
}
```

**Key**: Expect 409 Conflict if insufficient stock:
```javascript
.catch(err => {
  if (err.status === 409) {
    alert("Insufficient stock!"); // Show this to user
  }
});
```

---

## SECONDARY PAGES (Can wire up after core flow works)

### Inventory
- `/src/app/inventory/batches/list/page.jsx` → GET `/api/inventory/batches`
- `/src/app/inventory/movements/page.jsx` → GET `/api/inventory/movements`

### Invoices
- `/src/app/billing/invoices/page.jsx` → GET `/api/sales/invoices`
- `/src/app/procurement/invoices/page.jsx` → GET `/api/purchases/invoices`

### Warehouses
- `/src/app/warehouses/page.jsx` → GET `/api/inventory/warehouses`

### Categories
- `/src/app/inventory/categories/list/page.jsx` → GET `/api/inventory/categories`

---

## TOTAL IMPACT

**Pages with mockData**: 91 files

**Critical to update NOW** (for core flow): 5 files
- Suppliers list
- Customers list
- Purchase Orders
- GRN
- POS Sale

**Suggested Order**:
1. Suppliers (foundation - everything depends on this)
2. Customers (independent, but needed for POS)
3. Purchase Orders (depends on suppliers)
4. GRN (depends on POs - stock increases here!)
5. POS (depends on customers & products)

---

## TEMPLATE: How to Replace mockData

### Before (using mock):
```jsx
const mockSuppliers = [
  { id: '1', name: 'Supplier A' },
  { id: '2', name: 'Supplier B' }
];

export default function Page() {
  // Uses mockSuppliers directly
  return <div>{mockSuppliers.map(s => ...)}</div>;
}
```

### After (using API):
```jsx
'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch('/api/purchases/suppliers/list');
        const data = await res.json();
        if (data.success) {
          setSuppliers(data.suppliers);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Now use suppliers instead of mockSuppliers
  return <div>{suppliers.map(s => ...)}</div>;
}
```

---

## Testing Checklist

After updating each page:

- [ ] Data loads from API (check Network tab in DevTools)
- [ ] Loading state shows while fetching
- [ ] Error state displays if API fails
- [ ] Real data displays (not mock)
- [ ] Search/filter works with real data
- [ ] Create/Edit/Delete calls correct API endpoints
- [ ] Form validation matches API requirements

---

## Need Help?

Check these files for API response formats:
- `QUICK_API_REFERENCE.md` - Example requests/responses
- `IMPLEMENTATION_COMPLETE.md` - Full API documentation
- Individual route.js files in `/src/app/api/` - See the actual code
