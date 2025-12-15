# XHETON ERP - QUICK API REFERENCE

**System**: XHETON | **Author**: Xhenvolt | **Currency**: UGX  
**Version**: v0.0.015 | **Status**: Production Ready ✅

---

## 🚀 CRITICAL ENDPOINTS (Core Business Logic)

### 1️⃣ CREATE SUPPLIER
```bash
POST /api/purchases/suppliers
Content-Type: application/json

{
  "supplier_code": "SUP-001",
  "supplier_name": "Tech Supplies Ltd",
  "email": "contact@techsupplies.com",
  "phone": "+256701234567",
  "payment_terms": 30,
  "credit_limit": 10000000
}

Response: 201 Created
```

### 2️⃣ CREATE PURCHASE ORDER
```bash
POST /api/purchases/orders
Content-Type: application/json

{
  "supplier_id": "uuid-from-step-1",
  "po_date": "2025-12-14",
  "warehouse_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 100,
      "unit_price": 25000,
      "tax_rate": 0,
      "discount_amount": 0
    }
  ]
}

Response: 201 Created
Auto-generated: PO-20251214-0001
```

### 3️⃣ RECEIVE GOODS (GRN) ⭐ STOCK INCREASES HERE
```bash
POST /api/purchases/grn-new
Content-Type: application/json

{
  "supplier_id": "uuid",
  "warehouse_id": "uuid",
  "po_id": "uuid-optional",
  "items": [
    {
      "product_id": "uuid",
      "po_item_id": "uuid-optional",
      "quantity_received": 100,
      "unit_cost": 25000,
      "batch_number": "BATCH-001",
      "manufacture_date": "2025-11-01",
      "expiry_date": "2026-11-01"
    }
  ]
}

Response: 201 Created
Automatic:
  ✅ GRN created (GRN-20251214-0001)
  ✅ Batch created
  ✅ Product stock INCREMENTED
  ✅ Stock movement IN recorded
```

### 4️⃣ CREATE CUSTOMER
```bash
POST /api/sales/customers
Content-Type: application/json

{
  "customer_code": "CUST-001",
  "customer_name": "ABC Retail Ltd",
  "email": "customer@abc.com",
  "phone": "+256712345678",
  "city": "Kampala"
}

Response: 201 Created
```

### 5️⃣ POS CHECKOUT ⭐ STOCK DECREASES HERE
```bash
POST /api/sales/checkout
Content-Type: application/json

{
  "customer_id": "uuid",
  "warehouse_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 5
    }
  ]
}

Response: 201 Created (if stock available)
{
  "success": true,
  "sales_order": { "order_number": "SO-20251214-0001", ... },
  "invoice": { "invoice_number": "INV-20251214-0001", ... },
  "message": "Sale completed: 5 items, UGX 125,000"
}

Response: 409 Conflict (if insufficient stock)
{
  "success": false,
  "error": "Insufficient stock for product X. Available: 2, Requested: 5"
}

Automatic:
  ✅ Stock validated (409 if insufficient!)
  ✅ Sales order created
  ✅ Product stock DECREMENTED
  ✅ Stock movement OUT recorded
  ✅ Invoice auto-generated
```

---

## 📋 LIST ENDPOINTS (All support pagination & search)

### Suppliers
```bash
GET /api/purchases/suppliers/list?page=1&limit=20&search=tech&status=active
```

### Purchase Orders
```bash
GET /api/purchases/orders?page=1&limit=20&search=PO&status=draft
```

### GRN
```bash
GET /api/purchases/grn-new?page=1&limit=20&search=grn&status=draft
```

### Inventory Batches (read-only)
```bash
GET /api/inventory/batches?page=1&limit=20&warehouse_id=uuid
```

### Stock Movements (audit log)
```bash
GET /api/inventory/movements?page=1&limit=20&product_id=uuid&movement_type=IN
```

### Customers
```bash
GET /api/sales/customers?page=1&limit=20&search=abc&status=active
```

### Purchase Invoices
```bash
GET /api/purchases/invoices?page=1&limit=20&status=unpaid
```

### Sales Invoices
```bash
GET /api/sales/invoices?page=1&limit=20&status=draft
```

---

## 🔐 VALIDATION RULES

### ✅ Stock Validation
```
❌ Can't sell product if: current_stock < quantity
✅ Response: 409 Conflict with "Insufficient stock..." message
✅ Stock only increases via GRN
✅ Stock only decreases via POS Checkout
```

### ✅ Referential Integrity
```
❌ Can't delete supplier with active POs
❌ Can't delete PO with linked GRN  
❌ Can't delete warehouse with stock
❌ Can't delete product category with products
```

### ✅ Data Flow
```
Suppliers → Purchase Orders → GRN → Sales → Invoices

No step can be skipped
No direct stock edits allowed
All changes logged in stock_movements
```

---

## 🧪 QUICK TEST

### Test Stock Increase (GRN):
```bash
# 1. Check current stock
curl http://localhost:3000/api/inventory/products/list

# 2. Create GRN with 100 units
curl -X POST http://localhost:3000/api/purchases/grn-new \
  -H "Content-Type: application/json" \
  -d '{"supplier_id":"...", "warehouse_id":"...", "items":[{"product_id":"...", "quantity_received":100}]}'

# 3. Verify stock increased
curl http://localhost:3000/api/inventory/products/list
# Current_stock should be +100 from before!

# 4. Check audit trail
curl http://localhost:3000/api/inventory/movements?movement_type=IN
# Should see "IN" movement for your product
```

### Test Stock Decrease (POS):
```bash
# Product has stock: 10

# Try to sell 15 (should fail)
curl -X POST http://localhost:3000/api/sales/checkout \
  -H "Content-Type: application/json" \
  -d '{"customer_id":"...", "warehouse_id":"...", "items":[{"product_id":"...", "quantity":15}]}'
# Returns 409: Insufficient stock!

# Try to sell 8 (should succeed)
curl -X POST http://localhost:3000/api/sales/checkout \
  -H "Content-Type: application/json" \
  -d '{"customer_id":"...", "warehouse_id":"...", "items":[{"product_id":"...", "quantity":8}]}'
# Returns 201: Success! Stock becomes 2 (10-8)

# Verify stock decreased
curl http://localhost:3000/api/inventory/products/list
# Current_stock should be 2

# Check audit trail
curl http://localhost:3000/api/inventory/movements?movement_type=OUT
# Should see "OUT" movement
```

---

## 📊 RESPONSE FORMATS

### Success Response
```json
{
  "success": true,
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

### Error Response
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

### Status Codes
```
200 OK - Success
201 Created - New record created
400 Bad Request - Missing required fields
404 Not Found - Record doesn't exist
409 Conflict - Validation failed (e.g., insufficient stock)
500 Server Error - Database error
```

---

## 💰 CURRENCY & CALCULATIONS

- **All values**: UGX (Uganda Shillings)
- **Default VAT**: 18%
- **Auto-calculated**: Subtotal + Tax = Total
- **Example**: 1,000,000 UGX * 18% = 180,000 UGX tax = 1,180,000 UGX total

---

## 🔄 COMPLETE FLOW EXAMPLE

```
1. Create Supplier "ABC Supplies"
   POST /api/purchases/suppliers → SUP-001

2. Create PO from SUP-001 for 100 units @ 25,000 each
   POST /api/purchases/orders → PO-20251214-0001

3. Goods arrive! Receive via GRN
   POST /api/purchases/grn-new
   ✅ Stock increases from 0 to 100
   ✅ Batch created (BATCH-001)
   ✅ Stock movement IN logged

4. Create Customer "XYZ Retail"
   POST /api/sales/customers → CUST-001

5. Sell 50 units to XYZ Retail
   POST /api/sales/checkout
   ✅ Validates: have 100, selling 50 ✓
   ✅ Stock decreases to 50
   ✅ Sales order created (SO-20251214-0001)
   ✅ Invoice created (INV-20251214-0001)
   ✅ Stock movement OUT logged

6. Try to sell 60 more
   POST /api/sales/checkout with 60 units
   ❌ Response 409: "Available: 50, Requested: 60"

7. Sell 50 remaining
   POST /api/sales/checkout
   ✅ Stock becomes 0
   ✅ Order/Invoice created

8. View audit trail
   GET /api/inventory/movements
   ✅ Shows: IN 100, OUT 50, OUT 50
```

---

## 📞 SUPPORT

For issues:
1. Check response HTTP status code
2. Read error message in response
3. Verify required fields in request body
4. Check that foreign key IDs exist (supplier_id, product_id, etc.)
5. Ensure warehouse_id exists

---

**Ready to transform Uganda's enterprise software landscape with XHETON!** 🚀

System: XHETON | Author: Xhenvolt | Made with ❤️ for Africa
