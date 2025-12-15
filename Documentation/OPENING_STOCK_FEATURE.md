# XHETON Opening Stock Feature - Implementation Guide

## Overview

The Opening Stock feature allows administrators to initialize inventory when first setting up XHETON. This is essential for migrating from legacy systems or starting operations with existing stock.

**Key Principle**: Opening stock is created as GRNs internally and automatically converted to stock movements, maintaining the audit trail and ensuring consistency with the rest of the system.

## Access Points

### 1. From GRN Page
- Navigate to `/purchases/grn`
- Click the **"Opening Stock"** button (orange gradient) at the top
- Leads to `/inventory/opening-stock`

### 2. Direct URL
- Visit `/inventory/opening-stock` directly

## Two Entry Methods

### A. Manual Entry
Perfect for smaller inventories or verification against records.

**Process:**
1. Select **"Manual Entry"** tab
2. Choose destination warehouse
3. Add items one by one:
   - Product (from dropdown)
   - Quantity
   - Batch number (optional)
   - Unit cost in UGX (optional)
   - Expiry date (optional)
4. Review items in table
5. Add notes about the opening stock batch
6. Click **"Create Opening Stock"**

**Result:**
- Creates a GRN with type='opening_stock'
- GRN number format: `OPEN-{timestamp}-{count}`
- Status: 'draft' (waiting for approval)
- Redirects to GRN page

### B. Bulk Import (CSV/Excel)
Ideal for large inventories or spreadsheet-based migrations.

**Process:**
1. Select **"Bulk Import (CSV/Excel)"** tab
2. Upload CSV or Excel file
3. System parses file and shows preview
4. Review item table
5. Click **"Import All Items"**

**CSV Format:**
```
product_id, warehouse_id, quantity, batch_number, unit_cost, expiry_date
UUID, UUID, 100.50, BATCH-001, 5000, 2026-12-31
```

**Result:**
- Each row creates separate draft GRN
- Import report shows success/failure per row
- Failed rows show error message
- Successful GRNs visible on GRN page

## Opening Stock Workflow

```
┌─────────────────────────┐
│  Manual/Bulk Entry      │
│  (Admin fills data)     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Create Draft GRN       │
│  type='opening_stock'   │
│  status='draft'         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  GRN Visible in List    │
│  Shows "Draft" badge    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Admin Clicks "Approve"  │
│  button on GRN          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ For each item:          │
│ Create stock_movement   │
│ type='receipt'          │
│ reference='opening_...' │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Update GRN status       │
│ status='approved'       │
│ approved_at = NOW()     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Stock NOW AVAILABLE     │
│ In inventory movements  │
│ In stock balance        │
│ In POS for selling      │
└─────────────────────────┘
```

## Database Changes

### New Fields on goods_received_notes Table
- `type` (VARCHAR 50) - Values: 'regular' or 'opening_stock'
- `approved_at` (TIMESTAMPTZ) - When GRN was approved
- `approved_by` (UUID FK) - User who approved
- `deleted_at` (TIMESTAMPTZ) - Soft delete timestamp

### Migration
File: `/database/migrations/001_add_opening_stock_fields.sql`

Applies automatically on next database migration run.

## API Endpoints

### 1. List Opening Stock GRNs
**Endpoint:** `GET /api/inventory/opening-stock`

**Query Params:**
- `page` (default 1)
- `limit` (default 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "grn_number": "OPEN-1734222000000-1",
      "supplier_name": "Opening Stock",
      "warehouse_name": "Main Warehouse",
      "status": "draft",
      "item_count": 5,
      "total_items": 250,
      "created_at": "2025-12-14T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 1, "pages": 1 }
}
```

### 2. Create Opening Stock GRN
**Endpoint:** `POST /api/inventory/opening-stock`

**Request Body:**
```json
{
  "warehouse_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 100,
      "batch_number": "BATCH-2025-001",
      "unit_cost": 5000,
      "expiry_date": "2026-12-31"
    }
  ],
  "notes": "Initial stock setup",
  "created_by_id": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "grn_number": "OPEN-1734222000000-1",
    "status": "draft",
    "item_count": 1,
    "message": "Opening stock GRN created. Click Approve to finalize."
  }
}
```

**Validation:**
- Warehouse required
- At least 1 item required
- Quantity > 0
- No duplicate opening stock per product/warehouse (when approved)

### 3. Bulk Import Opening Stock
**Endpoint:** `PUT /api/inventory/opening-stock`

**Request Body:**
```json
{
  "items": [
    {
      "product_id": "uuid1",
      "warehouse_id": "uuid",
      "quantity": 100,
      "batch_number": "BATCH-001",
      "unit_cost": 5000
    },
    {
      "product_id": "uuid2",
      "warehouse_id": "uuid",
      "quantity": 50,
      "batch_number": "BATCH-002",
      "unit_cost": 3000
    }
  ],
  "created_by_id": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 2,
    "successful": 2,
    "failed": 0,
    "results": [
      {
        "row": 1,
        "success": true,
        "message": "GRN OPEN-1734222000000-1 created (draft)",
        "grn_id": "uuid"
      },
      {
        "row": 2,
        "success": true,
        "message": "GRN OPEN-1734222000000-2 created (draft)",
        "grn_id": "uuid"
      }
    ]
  }
}
```

### 4. Approve Opening Stock
**Endpoint:** `POST /api/inventory/opening-stock-approve`

**Request Body:**
```json
{
  "grn_id": "uuid",
  "approved_by_id": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "grn_number": "OPEN-1734222000000-1",
    "status": "approved",
    "movements_created": 5,
    "message": "Opening stock approved! 5 stock movements created."
  }
}
```

**Process:**
1. Validates GRN exists and is opening_stock type
2. Checks status is 'draft'
3. For each GRN item:
   - Creates stock_movement with type='receipt'
   - Sets from_warehouse_id = NULL (external source)
   - Sets to_warehouse_id = warehouse from GRN
   - Links via reference_type='opening_stock'
4. Updates GRN status='approved'
5. Returns count of movements created

## UI Page: /inventory/opening-stock

### Features
- ✅ Responsive grid layout (1 col mobile, responsive desktop)
- ✅ Mode toggle between Manual and Bulk
- ✅ Real-time validation messages
- ✅ Loading states on buttons
- ✅ Toast notifications for success/error
- ✅ File upload with drag-and-drop support
- ✅ CSV parsing and preview
- ✅ Branding footer (XHETON | Author: Xhenvolt)
- ✅ Back button to navigate safely

### Manual Entry Flow
1. Warehouse selection (required)
2. Item entry grid with product, qty, batch, cost, expiry
3. "Add Item" button appends to table
4. Remove button deletes row
5. Notes field for batch metadata
6. "Create Opening Stock" button triggers API

### Bulk Import Flow
1. CSV format instructions banner
2. File upload with drop zone
3. Parse preview of items
4. "Import All Items" button
5. Results dashboard showing success/failure
6. Detailed error table for failures

## Integration with Existing Features

### Stock Movements Ledger
Opening stock movements appear in `/inventory/movements` with:
- Movement type: **receipt** (IN)
- Reference type: **opening_stock**
- From location: **External** (NULL warehouse)
- To location: Destination warehouse

### GRN Page
Opening stock GRNs appear in `/purchases/grn` with:
- GRN number format: `OPEN-{timestamp}-{count}`
- Supplier: "Opening Stock" (auto-created)
- Status badge: "draft" or "approved"
- Approve button visible (if draft)
- Delete button visible (if draft)

### Stock Balance Calculation
After approval, opening stock is reflected in:
- `/api/inventory/stock-balance` endpoint
- Real-time stock queries
- POS available quantities
- Transfer source validation

## Validation Rules

### Manual Entry
- ❌ Warehouse not selected → Error toast
- ❌ Product not selected → Error toast
- ❌ Quantity ≤ 0 → Error toast
- ❌ Duplicate opening stock (approved) → API returns 409
- ✅ Batch optional
- ✅ Cost optional
- ✅ Expiry optional

### Bulk Import
- ❌ product_id missing → Row fails with message
- ❌ warehouse_id missing → Row fails with message
- ❌ quantity missing → Row fails with message
- ❌ quantity ≤ 0 → Row fails with message
- ❌ Duplicate (approved) → Row fails with message
- ✅ Each row creates separate GRN
- ✅ Failed rows don't block successful rows
- ✅ Detailed error report shown

## Important Notes

### Preventing Duplicates
Once opening stock is **approved** for a product-warehouse combination, you cannot create another opening stock for that combination. This prevents:
- Double-counting inventory
- Inconsistent stock levels
- Audit trail confusion

### Manual Stock Editing Prevention
- No manual stock quantity edits allowed on products table
- All stock changes MUST come via GRN→Movements
- Maintains audit trail integrity
- Enforced via API (403 Forbidden on manual updates)

### Stock Availability
- Opening stock is **NOT available** until GRN is approved
- Draft GRNs do not add stock
- Approval is explicit action by admin
- Movements are created atomically on approval

### Reporting & Filtering
- GRN list page shows opening stock when filtered by status
- Movement ledger shows reference_type='opening_stock'
- Custom reports can filter by GRN type
- Audit trail shows complete history

## Testing Scenarios

### Test 1: Manual Entry for Single Item
1. Navigate to Opening Stock page
2. Select warehouse
3. Add 1 product with qty 100
4. Click Create
5. Verify GRN appears in list with "draft" status
6. Click Approve
7. Verify stock appears in movements
8. Check stock-balance endpoint

### Test 2: Bulk Import with Mixed Results
1. Prepare CSV with 5 rows:
   - Rows 1-4: Valid
   - Row 5: Invalid (missing warehouse_id)
2. Upload file
3. Verify results show 4 successful, 1 failed
4. Verify error message explains issue
5. Approve successful GRNs
6. Verify stock movements created

### Test 3: Duplicate Prevention
1. Create and approve opening stock for Product A in Warehouse 1
2. Attempt to create another opening stock for Product A in Warehouse 1
3. Verify API returns 409 Conflict with message
4. Verify UI shows error toast

### Test 4: Stock Availability
1. Create and approve opening stock for Product B (qty 50)
2. Navigate to POS
3. Verify Product B available in stock (qty 50)
4. Verify can sell up to 50 units
5. Verify cannot sell more than 50

### Test 5: Transfers from Opening Stock
1. Create opening stock for Product C (qty 100) at Warehouse A
2. Create transfer of 30 units to Warehouse B
3. Verify Warehouse A now shows 70
4. Verify Warehouse B now shows 30
5. Check both movements exist in ledger

## Branding

All pages display:
```
XHETON ERP System | Author: Xhenvolt
```

At the bottom of the page in footer text (gray, small).

## Performance Considerations

- Bulk imports process rows sequentially (not parallel)
- Each row creates separate database transaction
- Large files (1000+ rows) may take 10-30 seconds
- Progress indicated by button state ("Importing...")
- Results displayed immediately after completion

## Future Enhancements

- [ ] Batch auto-assignment (for auto-generated batches)
- [ ] Expiry date range validation
- [ ] Quantity rounding based on UoM
- [ ] Cost per unit validation
- [ ] Warehouse capacity checking
- [ ] Approval workflow (by supervisor)
- [ ] Opening stock audit report
- [ ] Stock count variance report
- [ ] Location-level opening stock (zones/aisles/bins)
- [ ] Integration with accounting (COG entries)

## Support & Troubleshooting

### Issue: "Opening stock already exists for this product/warehouse"
- **Cause**: You previously created and approved opening stock for this combination
- **Solution**: Cannot reopen approved stocks. Create transfer instead.

### Issue: Bulk import shows 0% progress
- **Cause**: File parsing failed
- **Solution**: Verify CSV format matches specification (check column headers)

### Issue: Stock doesn't appear after approval
- **Cause**: Stock movements not created, GRN still draft
- **Solution**: Navigate to GRN page, verify it shows "approved" status

### Issue: Cannot upload Excel file
- **Cause**: File format not recognized
- **Solution**: Export as CSV from Excel first, then upload CSV

## Database & Audit Trail

Every opening stock entry creates:
1. **GRN record** with type='opening_stock'
2. **GRN items** (goods_received_note_items)
3. **Stock movements** (one per item after approval)
4. **Timestamps** (created_at, approved_at)
5. **User attribution** (created_by, approved_by)

Full audit trail is permanently available in:
- `/inventory/movements` page
- `/purchases/grn` page
- Database stock_movements table

---

**System**: XHETON | **Author**: Xhenvolt | **Version**: Opening Stock Feature v1.0
