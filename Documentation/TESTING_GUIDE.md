# Inventory, Purchases & Sales System - Testing Guide

## Quick Start

### 1. Initialize Database
```bash
# Run the seeding script to create roles, permissions, and test data
node scripts/seed-db.js
```

Expected output:
```
✓ Created role: Administrator
✓ Created role: Manager
✓ Created role: Staff
✓ Created role: Viewer
✓ Created permission: inventory:create
... (and many more permissions)
✓ Created supplier: ABC Pharmaceuticals Ltd
... (and more test data)
✓ Database seeding completed successfully!
```

### 2. Obtain Authentication Token
All endpoints require a JWT token. Use the existing `/api/auth/login` endpoint with test credentials (or your app's login flow).

Example using curl:
```bash
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.token')
```

### 3. Test Each Module

---

## Inventory Module Tests

### Create Product Category
```bash
curl -X POST http://localhost:3000/api/inventory/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category_name": "Antibiotics",
    "description": "Antibiotic medications"
  }'
```

### Create Warehouse
```bash
curl -X POST http://localhost:3000/api/inventory/warehouses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "warehouse_code": "WH001",
    "warehouse_name": "Main Warehouse",
    "location": "Kampala Industrial Area",
    "capacity": 10000
  }'
```

### Create Product
```bash
CATEGORY_ID=1  # Update with actual category ID
curl -X POST http://localhost:3000/api/inventory/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_code": "PROD001",
    "product_name": "Amoxicillin 500mg",
    "category_id": '$CATEGORY_ID',
    "cost_price": 1500,
    "selling_price": 2500,
    "barcode": "1234567890",
    "track_inventory": true
  }'
```

### Get Product Details
```bash
PRODUCT_ID=1  # Update with actual product ID
curl -X GET http://localhost:3000/api/inventory/products/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Update Product Price
```bash
curl -X PUT http://localhost:3000/api/inventory/products/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "selling_price": 3000
  }'
# Verify: Check product_price_history table for new entry
```

### Create Stock Transfer
```bash
curl -X POST http://localhost:3000/api/inventory/transfers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "from_warehouse_id": 1,
    "to_warehouse_id": 2,
    "quantity": 100,
    "transfer_number": "TRF001"
  }'
```

### Record Inventory Adjustment
```bash
curl -X POST http://localhost:3000/api/inventory/adjustments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "warehouse_id": 1,
    "quantity_change": -5,
    "adjustment_reason": "Damaged stock"
  }'
```

---

## Purchases Module Tests

### Create Supplier
```bash
curl -X POST http://localhost:3000/api/purchases/suppliers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_code": "SUP004",
    "supplier_name": "New Pharma Ltd",
    "contact_person": "Jane Supplier",
    "email": "jane@pharma.com",
    "phone": "+256701234567",
    "country": "Uganda"
  }'
```

### Create Purchase Order
```bash
SUPPLIER_ID=1  # Update with actual supplier ID
curl -X POST http://localhost:3000/api/purchases/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": '$SUPPLIER_ID',
    "po_number": "PO-2024-001",
    "po_date": "2024-12-13",
    "items": [
      {
        "product_id": 1,
        "quantity": 500,
        "unit_price": 1500
      }
    ],
    "delivery_address": "Kampala Main Office"
  }'
```

### Get Purchase Order with Items
```bash
PO_ID=1  # Update with actual PO ID
curl -X GET http://localhost:3000/api/purchases/orders/$PO_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Create GRN (Goods Received Note)
```bash
PO_ID=1  # Update with actual PO ID
curl -X POST http://localhost:3000/api/purchases/grn \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "purchase_order_id": '$PO_ID',
    "warehouse_id": 1,
    "grn_number": "GRN-2024-001",
    "grn_date": "2024-12-13",
    "items": [
      {
        "product_id": 1,
        "quantity_received": 500,
        "batch_number": "BATCH-2024-12-001",
        "cost_per_unit": 1500
      }
    ]
  }'
# Verify: Check stock_movements table for IN entry
# Verify: Check product_batches table for new batch
# Verify: Check purchase_order_items.quantity_received is updated
```

### Create Supplier Invoice
```bash
SUPPLIER_ID=1
curl -X POST http://localhost:3000/api/purchases/invoices \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": '$SUPPLIER_ID',
    "invoice_number": "INV-SUP-2024-001",
    "invoice_date": "2024-12-13",
    "total_amount": 750000,
    "items": [
      {
        "description": "Amoxicillin 500mg x 500",
        "quantity": 500,
        "unit_price": 1500
      }
    ]
  }'
# Verify: Check suppliers.current_balance is updated
```

---

## Sales Module Tests

### Create Customer
```bash
curl -X POST http://localhost:3000/api/sales/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_code": "CUST004",
    "customer_name": "New Clinic",
    "email": "clinic@new.com",
    "phone": "+256701234567",
    "city": "Kampala",
    "country": "Uganda",
    "credit_limit": 50000
  }'
```

### Create Sale (POS)
```bash
CUSTOMER_ID=1  # Update with actual customer ID
curl -X POST http://localhost:3000/api/sales/pos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": '$CUSTOMER_ID',
    "sale_number": "SALE-2024-001",
    "sale_date": "2024-12-13",
    "warehouse_id": 1,
    "payment_method": "cash",
    "items": [
      {
        "product_id": 1,
        "quantity": 50
      }
    ]
  }'
# Verify: Check stock_movements for OUT entry
# Verify: Check sales_orders and sales_order_items created
# Verify: Check sales_invoices created with status 'paid'
# Verify: Check sales_invoice_payments recorded
```

### Create Sale with Credit Payment
```bash
curl -X POST http://localhost:3000/api/sales/pos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": '$CUSTOMER_ID',
    "sale_number": "SALE-2024-002",
    "sale_date": "2024-12-13",
    "warehouse_id": 1,
    "payment_method": "credit",
    "items": [
      {
        "product_id": 1,
        "quantity": 25
      }
    ]
  }'
# Verify: Check customers.current_balance is increased (credit owed)
# Verify: Check sales_invoices status is 'pending'
```

### Get Sales Order with Items
```bash
SALE_ID=1  # Update with actual sale ID
curl -X GET http://localhost:3000/api/sales/orders/$SALE_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Cases to Test

### Insufficient Stock
```bash
curl -X POST http://localhost:3000/api/sales/pos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "sale_number": "SALE-ERR-001",
    "warehouse_id": 1,
    "items": [
      {
        "product_id": 1,
        "quantity": 99999
      }
    ]
  }'
# Expected: 400 error "Insufficient stock"
```

### Permission Denied
```bash
# Use a token with 'viewer' role (read-only)
curl -X POST http://localhost:3000/api/inventory/products \
  -H "Authorization: Bearer $VIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_code":"TEST","product_name":"Test"}'
# Expected: 403 error "Forbidden"
```

### Duplicate Records
```bash
# Try creating product with existing product_code
curl -X POST http://localhost:3000/api/inventory/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_code":"PROD001","product_name":"Duplicate"}'
# Expected: 409 error "already exists"
```

---

## Verification Queries

Run these SQL queries in your database to verify data integrity:

### Check Stock Balance
```sql
SELECT product_id, to_warehouse_id as warehouse_id,
  SUM(CASE WHEN movement_type = 'IN' THEN quantity ELSE -quantity END) as balance
FROM stock_movements
WHERE deleted_at IS NULL
GROUP BY product_id, to_warehouse_id
ORDER BY product_id, warehouse_id;
```

### Check Supplier Balances
```sql
SELECT supplier_code, supplier_name, current_balance
FROM suppliers
WHERE deleted_at IS NULL
ORDER BY supplier_name;
```

### Check Customer Balances
```sql
SELECT customer_code, customer_name, current_balance
FROM customers
WHERE deleted_at IS NULL
ORDER BY customer_name;
```

### Audit Stock Movements
```sql
SELECT sm.*, p.product_name, w.warehouse_name
FROM stock_movements sm
LEFT JOIN products p ON sm.product_id = p.id
LEFT JOIN warehouses w ON sm.to_warehouse_id = w.id OR sm.from_warehouse_id = w.id
WHERE sm.deleted_at IS NULL
ORDER BY sm.created_at DESC
LIMIT 50;
```

### Check Price History
```sql
SELECT ph.*, p.product_name
FROM product_price_history ph
LEFT JOIN products p ON ph.product_id = p.id
ORDER BY ph.created_at DESC
LIMIT 50;
```

---

## Troubleshooting

### "Permission Denied" on all endpoints
- Ensure roles and permissions are seeded: `node scripts/seed-db.js`
- Verify user's role_id is set in the database
- Check JWT token contains valid user.role_id claim

### "Not found" on product creation
- Ensure category exists if category_id is provided
- Verify warehouse_id exists when creating transfers/sales

### Stock movement not recorded
- Check that the transaction succeeded (no rollback)
- Verify `stock_movements` table has entries
- Ensure `created_by` user exists or is NULL

### Transaction rollback (stock not decremented)
- Check database error logs
- Verify all referenced IDs (product, warehouse, customer) exist
- Ensure sufficient database connections available

---

## Performance Notes

- Product lists are paginated (default 20 per page)
- Use `q` query parameter to search instead of fetching all records
- Stock balance queries compute on-demand; consider caching for high-traffic scenarios
- All transactional operations lock affected rows during processing

---
