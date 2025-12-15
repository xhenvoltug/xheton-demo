# XHETON Opening Stock - Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        XHETON Frontend                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GRN Page (/purchases/grn)                                     │
│  ├─ Button: "Opening Stock"                                    │
│  │  └─ Link to: /inventory/opening-stock                       │
│  │                                                             │
│  └─ Shows GRNs with type='opening_stock'                      │
│     ├─ Status: draft, approved, deleted                       │
│     └─ Actions: View, Approve (draft), Delete (draft)         │
│                                                                 │
│  Opening Stock Page (/inventory/opening-stock)                │
│  ├─ Manual Entry Mode                                          │
│  │  ├─ Warehouse selector                                     │
│  │  ├─ Product selector                                       │
│  │  ├─ Quantity input                                         │
│  │  ├─ Batch/Cost/Expiry (optional)                           │
│  │  └─ Button: "Create Opening Stock" → POST /api/...        │
│  │                                                             │
│  └─ Bulk Import Mode                                          │
│     ├─ File upload (CSV)                                      │
│     ├─ Preview parser                                         │
│     └─ Button: "Import All Items" → PUT /api/...             │
│                                                                 │
│  Stock Movements Page (/inventory/movements)                  │
│  └─ Shows movements with reference_type='opening_stock'       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Requests
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      XHETON Backend APIs                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST /api/inventory/opening-stock                            │
│  ├─ Validate inputs                                           │
│  ├─ Check duplicate opening stock (approved only)             │
│  ├─ Get/Create "Opening Stock" supplier                      │
│  ├─ Generate GRN: OPEN-{time}-{count}                        │
│  ├─ Create goods_received_notes (type='opening_stock')       │
│  ├─ Create goods_received_note_items (x N)                   │
│  └─ Return: { id, grn_number, status='draft' }              │
│                                                                 │
│  PUT /api/inventory/opening-stock                             │
│  ├─ Parse CSV file rows                                       │
│  ├─ For each row:                                             │
│  │  ├─ Validate all fields                                    │
│  │  ├─ Check duplicate opening stock                          │
│  │  ├─ Create supplier if needed                              │
│  │  ├─ Create GRN                                             │
│  │  ├─ Create GRN item                                        │
│  │  └─ Track result (success/fail)                            │
│  └─ Return: { total, successful, failed, results }           │
│                                                                 │
│  POST /api/inventory/opening-stock-approve                    │
│  ├─ Validate GRN exists                                       │
│  ├─ Check type='opening_stock'                                │
│  ├─ Check status='draft'                                      │
│  ├─ For each GRN item:                                        │
│  │  ├─ Create stock_movement                                  │
│  │  │  ├─ movement_type='receipt'                             │
│  │  │  ├─ from_warehouse_id=NULL                              │
│  │  │  ├─ to_warehouse_id={grn.warehouse}                     │
│  │  │  ├─ reference_type='opening_stock'                      │
│  │  │  ├─ reference_id={grn_id}                               │
│  │  │  └─ created_by={approved_by}                            │
│  │  └─ Track movement created                                 │
│  ├─ Update GRN status='approved'                              │
│  ├─ Set approved_at=NOW()                                     │
│  ├─ Set approved_by={user_id}                                 │
│  └─ Return: { grn_number, status, movements_created }        │
│                                                                 │
│  GET /api/inventory/stock-balance                             │
│  ├─ Calculate: SUM(movements IN) - SUM(movements OUT)        │
│  ├─ Include movements with reference='opening_stock'          │
│  └─ Return real-time stock per product/warehouse              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Queries
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  goods_received_notes                                          │
│  ├─ id: UUID (primary key)                                    │
│  ├─ grn_number: VARCHAR(50) [OPEN-{time}-{count}]             │
│  ├─ supplier_id: UUID → suppliers                             │
│  ├─ warehouse_id: UUID → warehouses                           │
│  ├─ status: VARCHAR(50) [draft, approved, ...]                │
│  ├─ type: VARCHAR(50) [opening_stock, regular] ←NEW           │
│  ├─ approved_at: TIMESTAMPTZ ←NEW                             │
│  ├─ approved_by: UUID ←NEW                                    │
│  ├─ deleted_at: TIMESTAMPTZ ←NEW (soft delete)               │
│  ├─ created_at: TIMESTAMPTZ                                   │
│  ├─ created_by: UUID                                          │
│  └─ [... other fields ...]                                    │
│                                                                 │
│  goods_received_note_items                                     │
│  ├─ id: UUID                                                  │
│  ├─ grn_id: UUID → goods_received_notes                       │
│  ├─ product_id: UUID → products                               │
│  ├─ quantity_received: DECIMAL                                │
│  ├─ batch_number: VARCHAR(100)                                │
│  ├─ unit_cost: DECIMAL (UGX)                                  │
│  ├─ expiry_date: DATE                                         │
│  └─ [... other fields ...]                                    │
│                                                                 │
│  stock_movements (append-only audit trail)                    │
│  ├─ id: UUID                                                  │
│  ├─ movement_number: VARCHAR(50) [MOVE-OPEN-...]             │
│  ├─ movement_type: VARCHAR(50) [receipt, issue, ...]         │
│  ├─ product_id: UUID → products                               │
│  ├─ from_warehouse_id: UUID (NULL for opening)                │
│  ├─ to_warehouse_id: UUID → warehouses                        │
│  ├─ quantity: DECIMAL                                         │
│  ├─ reference_type: VARCHAR(50) [opening_stock, grn, ...]    │
│  ├─ reference_id: UUID [grn_id]                               │
│  ├─ created_by: UUID → users                                  │
│  ├─ created_at: TIMESTAMPTZ                                   │
│  └─ [... other fields ...]                                    │
│                                                                 │
│  suppliers                                                     │
│  ├─ id: UUID                                                  │
│  └─ name: VARCHAR(255) ["Opening Stock" auto-created]        │
│                                                                 │
│  warehouses                                                    │
│  ├─ id: UUID                                                  │
│  └─ name: VARCHAR(255) [destination for opening stock]       │
│                                                                 │
│  products                                                      │
│  ├─ id: UUID                                                  │
│  ├─ code: VARCHAR(50) [SKU]                                   │
│  └─ name: VARCHAR(255)                                        │
│  (Note: NO quantity field - calculated from movements)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Sequence

### Manual Entry Flow

```
Admin User
    │
    ├─ Navigate to /purchases/grn
    │  └─ Click "Opening Stock" button
    │
    ├─ UI loads /inventory/opening-stock
    │  └─ Fetch /api/inventory/warehouses
    │  └─ Fetch /api/inventory/products
    │
    ├─ Select warehouse + add items
    │  ├─ Product dropdown → product_id
    │  ├─ Quantity input → quantity
    │  ├─ Optional: batch, cost, expiry
    │  └─ Click "Add Item" → append to table
    │
    ├─ Click "Create Opening Stock"
    │  │
    │  └─ POST /api/inventory/opening-stock
    │     │
    │     ├─ Validate warehouse_id required ✓
    │     ├─ Validate items.length > 0 ✓
    │     ├─ For each item:
    │     │  ├─ Validate quantity > 0 ✓
    │     │  ├─ Validate no duplicate approved ✓
    │     │  └─ Validate product exists ✓
    │     │
    │     ├─ SELECT supplier WHERE name='Opening Stock'
    │     │  └─ IF NOT EXISTS: INSERT supplier
    │     │
    │     ├─ Generate GRN: OPEN-{time}-{count}
    │     │
    │     ├─ INSERT goods_received_notes
    │     │  ├─ grn_number='OPEN-...'
    │     │  ├─ supplier_id={opening_stock_supplier}
    │     │  ├─ warehouse_id={selected}
    │     │  ├─ type='opening_stock'
    │     │  ├─ status='draft'
    │     │  └─ created_by={admin_id}
    │     │
    │     └─ FOR EACH ITEM:
    │        └─ INSERT goods_received_note_items
    │           ├─ grn_id={newly_created_id}
    │           ├─ product_id={item.product_id}
    │           ├─ quantity_received={item.quantity}
    │           ├─ batch_number={item.batch}
    │           ├─ unit_cost={item.cost}
    │           └─ expiry_date={item.expiry}
    │
    ├─ Response: { grn_number: 'OPEN-...', status: 'draft' }
    │
    ├─ UI Toast: "Opening stock created! GRN: OPEN-..."
    │
    ├─ Navigate back to /purchases/grn
    │  └─ Fetch /api/purchases/grn-list
    │     └─ Display GRN with status='draft'
    │
    ├─ Click "Approve" on draft GRN
    │  │
    │  └─ POST /api/inventory/opening-stock-approve
    │     │
    │     ├─ Validate GRN exists ✓
    │     ├─ Validate type='opening_stock' ✓
    │     ├─ Validate status='draft' ✓
    │     │
    │     ├─ SELECT goods_received_note_items WHERE grn_id=?
    │     │
    │     └─ FOR EACH ITEM:
    │        │
    │        ├─ Generate movement_number: MOVE-OPEN-{time}-{idx}
    │        │
    │        └─ INSERT stock_movements
    │           ├─ movement_number='MOVE-OPEN-...'
    │           ├─ movement_type='receipt'
    │           ├─ product_id={item.product_id}
    │           ├─ from_warehouse_id=NULL (external)
    │           ├─ to_warehouse_id={grn.warehouse_id}
    │           ├─ quantity={item.quantity_received}
    │           ├─ reference_type='opening_stock'
    │           ├─ reference_id={grn_id}
    │           └─ created_by={admin_id}
    │
    ├─ UPDATE goods_received_notes
    │  ├─ status='approved'
    │  ├─ approved_at=NOW()
    │  └─ approved_by={admin_id}
    │
    ├─ Response: { status: 'approved', movements_created: N }
    │
    ├─ UI Toast: "GRN approved! N stock movements created."
    │
    ├─ GRN Page refreshes
    │  └─ Status changes from 'draft' to 'approved'
    │
    └─ Stock now available in:
       ├─ /api/inventory/stock-balance
       ├─ /inventory/movements (as receipt type)
       ├─ POS available stock
       └─ Transfer source validation
```

### Bulk Import Flow

```
Admin User
    │
    ├─ Prepare CSV file
    │  └─ Format: product_id, warehouse_id, quantity, ...
    │
    ├─ Navigate to /inventory/opening-stock
    │  └─ Select "Bulk Import" tab
    │
    ├─ Upload CSV file
    │  │
    │  └─ Client-side parsing
    │     ├─ Read file as text
    │     ├─ Split by newlines
    │     ├─ Parse first row as headers
    │     ├─ Parse remaining rows as data
    │     └─ Display preview table
    │
    ├─ Review preview (N rows)
    │
    ├─ Click "Import All Items"
    │  │
    │  └─ PUT /api/inventory/opening-stock
    │     │
    │     ├─ FOR EACH ROW in items:
    │     │  │
    │     │  ├─ Validate product_id required ✓
    │     │  ├─ Validate warehouse_id required ✓
    │     │  ├─ Validate quantity > 0 ✓
    │     │  ├─ Validate no duplicate approved ✓
    │     │  │
    │     │  ├─ IF validation fails:
    │     │  │  └─ record result: { row, success:false, message:error }
    │     │  │
    │     │  └─ IF validation passes:
    │     │     │
    │     │     ├─ Get/Create "Opening Stock" supplier
    │     │     │
    │     │     ├─ Generate GRN: OPEN-{time}-{row}
    │     │     │
    │     │     ├─ INSERT goods_received_notes
    │     │     │  ├─ type='opening_stock'
    │     │     │  ├─ status='draft'
    │     │     │  └─ warehouse_id from row
    │     │     │
    │     │     ├─ INSERT goods_received_note_items
    │     │     │  └─ All fields from row
    │     │     │
    │     │     └─ record result: { row, success:true, grn_id, message }
    │     │
    │     └─ Count successes and failures
    │
    ├─ Response: 
    │  ├─ { total: 100, successful: 98, failed: 2 }
    │  └─ results: [ {row, success, message}, ... ]
    │
    ├─ UI Toast: "98 items imported successfully"
    ├─ UI Error: "2 items failed" (if any failed)
    │
    ├─ Display results dashboard
    │  ├─ Green card: 98 successful
    │  ├─ Red card: 2 failed
    │  └─ Table: Failed row details with errors
    │
    ├─ Approve successful GRNs from /purchases/grn
    │  └─ Each successful row now has draft GRN
    │
    └─ Stock available after approval
```

## 🔄 Stock Availability Timeline

```
Timeline:
│
├─ T0: Admin creates opening stock entry
│  └─ GRN created in 'draft' status
│  └─ No stock available yet
│
├─ T1: Admin approves GRN
│  └─ Stock movements created
│  └─ GRN status changes to 'approved'
│
├─ T2: Stock immediately available
│  └─ /api/inventory/stock-balance returns stock
│  └─ POS can sell stock
│  └─ Transfers can use stock
│  └─ /inventory/movements shows receipt movements
│
└─ T3: Stock usage
   ├─ Sales create 'issue' movements
   ├─ Transfers create 'transfer_out' + 'transfer_in'
   └─ Stock balance continuously updated

Key Point: Stock is NOT retroactive
- Only approved GRNs add stock
- Draft GRNs are invisible to stock calculations
- Movements are immutable (audit trail)
```

## 💾 Database Transaction Flow

```
POST /api/inventory/opening-stock Request:
│
├─ BEGIN TRANSACTION
│  │
│  ├─ INSERT goods_received_notes
│  │  ├─ id={uuid}
│  │  ├─ grn_number={OPEN-xxx}
│  │  ├─ type='opening_stock'
│  │  └─ status='draft'
│  │
│  ├─ FOR EACH item:
│  │  └─ INSERT goods_received_note_items
│  │     ├─ grn_id={above_id}
│  │     ├─ product_id={item.product_id}
│  │     └─ quantity_received={item.quantity}
│  │
│  └─ COMMIT
│
└─ Response: { id, grn_number, status }

POST /api/inventory/opening-stock-approve Request:
│
├─ BEGIN TRANSACTION
│  │
│  ├─ SELECT goods_received_notes WHERE id=?
│  │  └─ Validate type, status
│  │
│  ├─ SELECT goods_received_note_items WHERE grn_id=?
│  │
│  ├─ FOR EACH item:
│  │  └─ INSERT stock_movements
│  │     ├─ movement_type='receipt'
│  │     ├─ from_warehouse_id=NULL
│  │     ├─ to_warehouse_id={grn.warehouse_id}
│  │     └─ quantity={item.quantity_received}
│  │
│  ├─ UPDATE goods_received_notes
│  │  ├─ status='approved'
│  │  ├─ approved_at=NOW()
│  │  └─ approved_by={user_id}
│  │
│  └─ COMMIT
│
└─ Response: { status, movements_created }
```

## 🎯 Key Design Decisions

### 1. GRN as Storage
**Decision**: Store opening stock as GRNs (not separate table)  
**Reason**: Reuse existing GRN infrastructure, maintain audit trail  
**Impact**: Consistent with rest of system

### 2. Type Differentiation
**Decision**: Use `type` column to mark opening_stock vs regular GRNs  
**Reason**: Allows filtering and reporting on opening stock specifically  
**Impact**: Backward compatible (default='regular')

### 3. Immediate Approval Not Forced
**Decision**: Create GRNs in 'draft', require explicit approval  
**Reason**: Allows verification before stock becomes available  
**Impact**: Admin controls when stock appears

### 4. Bulk Creates Multiple GRNs
**Decision**: Each CSV row creates separate GRN  
**Reason**: Better traceability, easier error handling per row  
**Impact**: 1000-row import = 1000 GRNs (not 1 big GRN)

### 5. Movements Append-Only
**Decision**: Stock movements never edited/deleted  
**Reason**: Maintain immutable audit trail  
**Impact**: Cannot "undo" opening stock (must create reversal)

### 6. Cost Tracking
**Decision**: Capture unit_cost in GRN items  
**Reason**: Enable accounting integration (COGS calculation)  
**Impact**: Historical cost of opening inventory preserved

---

This architecture ensures opening stock is:
- ✅ Traceable (full audit trail)
- ✅ Reversible (via reversal movements, not edits)
- ✅ Integrated (uses existing GRN/movement system)
- ✅ Scalable (handles 1000+ items)
- ✅ Reliable (transactional consistency)
- ✅ Auditable (timestamps, user attribution)

**System**: XHETON ERP | **Author**: Xhenvolt
