# XHETON Real Inventory Flow Logic - Implementation Guide

## Overview

XHETON now implements a real-world inventory system where **stock quantities are NEVER manually edited**. All stock changes are derived exclusively from documented inventory movements.

## Core Principles (Mandatory)

✅ **Stock quantities are read-only**
✅ **GRN is the ONLY entry point for creating stock**
✅ **All stock changes create movements** (IN, OUT, TRANSFER)
✅ **Movements are permanent audit trail** (cannot edit/delete)
✅ **Sales only from can_sell=true locations**
✅ **POS must validate stock before sale**

---

## MODULE 1: Warehouses & Locations

### Current Status
- Warehouses are locations **without selling capability** by default
- Each warehouse can be flagged as a receiving point or sales location

### Database Schema
```sql
-- Add to warehouses table (if not exists):
ALTER TABLE warehouses ADD COLUMN can_sell BOOLEAN DEFAULT false;
```

### Implementation
- Warehouses = **Receiving/Storage only** (can_sell = false)
- Shops/Branches = **Sales locations** (can_sell = true)
- POS must validate `can_sell=true` before processing sales

### API
```
GET  /api/inventory/warehouses           - List all warehouses
POST /api/inventory/warehouses           - Create warehouse
```

---

## MODULE 2: Goods Received Notes (GRN)

### Route
`/purchases/grn` - Full CRUD implementation

### Features

#### Create GRN (Draft)
**Endpoint:** `POST /api/purchases/grn-list`

```javascript
{
  supplier_id: "uuid",
  warehouse_id: "uuid",           // Destination warehouse
  po_reference: "PO-2025-001",   // Optional
  grn_date: "2025-12-14",
  notes: "Received in good condition",
  items: [
    {
      product_id: "uuid",
      quantity: 100,
      batch_number: "BATCH-2025-001",
      unit_cost: 5000  // UGX
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "grn-uuid",
    "grn_number": "GRN-1734222000000-1",
    "status": "draft",
    "item_count": 1
  }
}
```

#### Approve GRN → Creates Stock
**Endpoint:** `POST /api/purchases/grn-approve`

```javascript
{
  grn_id: "uuid",
  approved_by_id: "user-uuid"
}
```

**On Approval:**
1. Creates `stock_movement` entries with type='receipt'
2. Updates GRN status to 'approved'
3. Stock **becomes available immediately**
4. No manual stock update needed

**Movement Created:**
```json
{
  "movement_number": "MOVE-1734222000000-abc123",
  "movement_type": "receipt",
  "product_id": "uuid",
  "to_warehouse_id": "uuid",
  "quantity": 100,
  "reference_type": "grn",
  "reference_id": "grn-uuid"
}
```

### List GRNs
**Endpoint:** `GET /api/purchases/grn-list?status=draft&page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "grn_number": "GRN-...",
      "supplier_name": "Supplier A",
      "warehouse_name": "Main Warehouse",
      "status": "draft|approved",
      "item_count": 5,
      "total_items": 150,
      "created_at": "2025-12-14T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
}
```

---

## MODULE 3: Stock Movements (Audit Trail)

### Route
`/inventory/movements` - Read-only ledger

### Features
- **Immutable audit trail** of all inventory changes
- Shows IN, OUT, TRANSFER movements
- Includes source location, destination, timestamp
- **Cannot be edited or deleted**

### API

#### Get Stock Movements
**Endpoint:** `GET /api/inventory/stock-movements/list`

**Query Params:**
```
?page=1
&limit=50
&product_id=uuid
&warehouse_id=uuid
&movement_type=receipt|issue|transfer_in|transfer_out
&from_date=2025-12-01
&to_date=2025-12-31
&search=MOVE-
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "movement_number": "MOVE-1734222000000-abc123",
      "movement_type": "receipt",
      "product_code": "PROD-001",
      "product_name": "Product A",
      "from_warehouse_name": null,
      "to_warehouse_name": "Main Warehouse",
      "quantity": 100,
      "movement_date": "2025-12-14T10:00:00Z",
      "reference_type": "grn",
      "created_by": "user-uuid"
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 1250, "pages": 25 }
}
```

### Preventing Manual Edits
```javascript
// These endpoints return 403 Forbidden:
POST   /api/inventory/stock-movements/list
       → "Manual movement creation not allowed"

PUT    /api/inventory/stock-movements/[id]
       → "Movements cannot be edited. This is an audit trail."

DELETE /api/inventory/stock-movements/[id]
       → "Movements cannot be deleted. This is an audit trail."
```

---

## MODULE 4: Stock Transfers

### Route
`/inventory/transfers` - Internal warehouse transfers

### Transfer Stock Between Warehouses
**Endpoint:** `POST /api/inventory/transfers`

```javascript
{
  product_id: "uuid",
  quantity: 50,
  from_warehouse_id: "uuid",      // Source warehouse
  to_warehouse_id: "uuid",        // Destination warehouse
  from_bin_id: "uuid",            // Optional: specific bin
  to_bin_id: "uuid",              // Optional: specific bin
  created_by_id: "user-uuid",
  notes: "Restocking branch location"
}
```

**Validation:**
- Checks source warehouse has sufficient stock
- Prevents transfers of more than available
- Returns error if insufficient: `"Insufficient stock. Available: 30, Requested: 50"`

**Response:**
```json
{
  "success": true,
  "data": {
    "transfer_id": "uuid",
    "from_movement": "MOVE-OUT-1734222000000-xyz",
    "to_movement": "MOVE-IN-1734222000000-abc",
    "product_id": "uuid",
    "quantity": 50,
    "from_warehouse": "Main Warehouse",
    "to_warehouse": "Branch A",
    "message": "Stock transferred successfully. Available immediately."
  }
}
```

**What Happens Internally:**
1. Creates `stock_movement` with type='transfer_out' from source
2. Creates `stock_movement` with type='transfer_in' to destination
3. Both movements reference_type='transfer'
4. Stock **instantly available** at destination

---

## MODULE 5: Product Stock by Location

### Get Current Stock
**Endpoint:** `GET /api/inventory/stock-balance`

**Query Params:**
```
?product_id=uuid
&warehouse_id=uuid
&location_id=uuid
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product_id": "uuid",
      "product_code": "PROD-001",
      "product_name": "Product A",
      "warehouse_id": "uuid",
      "warehouse_name": "Main Warehouse",
      "current_stock": 250  // Calculated from movements
    }
  ]
}
```

### How Stock is Calculated
```sql
SELECT 
  SUM(CASE 
    WHEN movement_type IN ('receipt', 'in', 'transfer_in') 
      THEN quantity
    WHEN movement_type IN ('issue', 'out', 'transfer_out') 
      THEN -quantity
    ELSE 0
  END) as current_stock
FROM stock_movements
WHERE product_id = ? AND to_warehouse_id = ?
```

---

## MODULE 6: Sales Enforcement (POS)

### Validation Before Sale

```javascript
// Check 1: Location must have can_sell=true
if (!location.can_sell) {
  return error("Cannot sell from this location");
}

// Check 2: Sufficient stock at location
const stock = getProductStockAtLocation(product_id, location_id);
if (stock < quantity) {
  return error(`Insufficient stock. Available: ${stock}`);
}

// Check 3: Create sale
createSaleOrder(product_id, quantity, location_id);

// Check 4: Create movement (auto-created by sales API)
createStockMovement({
  movement_type: 'issue',
  from_warehouse_id: location_id,
  product_id: product_id,
  quantity: quantity,
  reference_type: 'sales',
  reference_id: order_id
});
```

---

## API Summary Table

| Operation | Method | Endpoint | Status |
|-----------|--------|----------|--------|
| **Create GRN (Draft)** | POST | `/api/purchases/grn-list` | ✅ |
| **List GRNs** | GET | `/api/purchases/grn-list` | ✅ |
| **Approve GRN** | POST | `/api/purchases/grn-approve` | ✅ |
| **Get Stock Movements** | GET | `/api/inventory/stock-movements/list` | ✅ |
| **Prevent Manual Edit** | PUT/POST/DELETE | `/api/inventory/stock-movements/list` | ✅ 403 |
| **Transfer Stock** | POST | `/api/inventory/transfers` | ✅ |
| **Get Stock Balance** | GET | `/api/inventory/stock-balance` | ✅ |
| **List Warehouses** | GET | `/api/inventory/warehouses` | ✅ |

---

## UI Pages Implemented

### 1. GRN Management
**`/purchases/grn`**
- List all GRNs with status (Draft, Approved)
- Filter by supplier, warehouse, status
- Inline approve button (creates movements)
- Delete draft GRNs

**`/purchases/grn/new`**
- Create new GRN
- Add multiple line items
- Select supplier and destination warehouse
- Auto-numbered GRN reference
- Saves as "Draft" awaiting approval

### 2. Stock Movements Ledger
**`/inventory/movements`**
- Read-only audit trail
- Filter by type, product, warehouse, date range
- Shows: Movement #, Type, Product, From/To locations, Qty, Timestamp
- Information banner explaining immutability
- No edit/delete buttons

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ SUPPLIER SENDS GOODS                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  GRN Created (Draft)   │
        │  - Select supplier     │
        │  - Choose destination  │
        │  - Add items           │
        └────────────┬───────────┘
                     │
                     ▼
     ┌───────────────────────────────┐
     │  GRN Approval Button Clicked   │
     │  Approval triggers:            │
     └────────────┬──────────────────┘
                  │
      ┌───────────┴─────────────────┐
      │                             │
      ▼                             ▼
   For each item:            Update GRN Status
   Create stock_movement        'approved'
   movement_type='receipt'
   from=NULL
   to=destination_warehouse
   quantity=received_qty
      │                             │
      └───────────────┬─────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │ Stock Now Available!     │
        │ At destination warehouse │
        │ Visible in ledger        │
        └──────────────────────────┘
```

---

## Key Implementation Details

### 1. GRN Status Flow
```
DRAFT → APPROVED → (END)
  ↑         ↓
  └─ Delete only from draft
```

### 2. Stock Movement Reference Types
```javascript
reference_type values:
- 'grn'      → Created from GRN approval
- 'sales'    → Created from sales order
- 'transfer' → Created from warehouse transfer
- 'adjustment' → Created from inventory adjustment (future)
```

### 3. Movement Type Classification
```javascript
// Stock IN
'receipt', 'in', 'transfer_in'

// Stock OUT
'issue', 'out', 'transfer_out'
```

### 4. Derived Stock Calculation
Stock is **never stored in products table**. Always calculated:
```javascript
// Client-side pseudo-code
const getStock = async (productId, warehouseId) => {
  const res = await fetch(
    `/api/inventory/stock-balance?product_id=${productId}&warehouse_id=${warehouseId}`
  );
  return res.data[0].current_stock;
};
```

---

## Database Relationships

```
GRN
├── goods_received_note_items
│   └── product_id (FK to products)
│
└── warehouse_id (FK to warehouses)

stock_movements (immutable)
├── product_id
├── from_warehouse_id
├── to_warehouse_id
├── batch_id (optional)
├── reference_type (grn, sales, transfer)
└── reference_id (grn_id, order_id, etc.)
```

---

## Error Handling

### GRN Approval Errors
```json
{
  "success": false,
  "error": "GRN not found"  // 404
}

{
  "success": false,
  "error": "Cannot approve GRN with status: approved"  // 400
}

{
  "success": false,
  "error": "GRN has no items to approve"  // 400
}
```

### Transfer Errors
```json
{
  "success": false,
  "error": "Insufficient stock. Available: 30, Requested: 50"  // 400
}
```

### Movement API Errors
```json
{
  "success": false,
  "error": "Manual stock movement creation not allowed. Use GRN, Sales, or Transfer APIs."  // 403
}
```

---

## Testing the Flow

### End-to-End Test
1. ✅ Create GRN with supplier and items
2. ✅ Verify GRN appears in list with "Draft" status
3. ✅ Click Approve button
4. ✅ Verify stock movements created in `/inventory/movements`
5. ✅ Check stock available in `/api/inventory/stock-balance`
6. ✅ Transfer stock between warehouses
7. ✅ Verify transfer movements appear in ledger
8. ✅ Try to manually edit stock movement (should get 403)
9. ✅ Try to delete stock movement (should get 403)

---

## Next Steps (Not Yet Implemented)

- [ ] Sales orders → auto-create 'issue' movements
- [ ] POS integration → validate can_sell and stock
- [ ] Inventory adjustments → create adjustment movements
- [ ] Stock return notes → create return movements
- [ ] Batch expiry tracking
- [ ] Low stock alerts
- [ ] Stock count audit workflows

---

## Files Modified/Created

### API Routes
- ✅ `/api/inventory/stock-balance/route.js` - NEW
- ✅ `/api/purchases/grn-list/route.js` - NEW
- ✅ `/api/purchases/grn-approve/route.js` - NEW
- ✅ `/api/inventory/transfers/route.js` - UPDATED
- ✅ `/api/inventory/stock-movements/list/route.js` - UPDATED (now read-only)

### UI Pages
- ✅ `/purchases/grn/page.jsx` - UPDATED
- ✅ `/purchases/grn/new/page.jsx` - UPDATED
- ✅ `/inventory/movements/page.jsx` - UPDATED (read-only ledger)

---

## Important Notes

⚠️ **NO MOCK DATA**: All stock shown is derived from real `stock_movements` table
⚠️ **IMMUTABLE AUDIT TRAIL**: Movements cannot be edited or deleted
⚠️ **GRN APPROVAL REQUIRED**: Stock only created when GRN is approved
⚠️ **SALES VALIDATION**: POS must check `can_sell` and stock before sale
⚠️ **NO MANUAL STOCK EDIT**: Users cannot manually change product quantities

---

This implementation ensures a **real, auditable inventory system** where every unit of stock is accounted for through documented movements.
