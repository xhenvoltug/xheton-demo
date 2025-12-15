# Complete API Endpoints Reference

## Authentication
All endpoints require: `Authorization: Bearer <JWT_TOKEN>`

---

## Inventory Module

| Method | Endpoint | Permission | Description |
|--------|----------|-----------|-------------|
| GET | `/api/inventory/categories` | inventory:read | List product categories (paginated, searchable) |
| POST | `/api/inventory/categories` | inventory:create | Create product category |
| GET | `/api/inventory/products` | inventory:read | List products (paginated, searchable) |
| POST | `/api/inventory/products` | inventory:create | Create product with price history |
| GET | `/api/inventory/products/[id]` | inventory:read | Get product details |
| PUT | `/api/inventory/products/[id]` | inventory:update | Update product (transactional, tracks price) |
| DELETE | `/api/inventory/products/[id]` | inventory:delete | Soft delete product |
| GET | `/api/inventory/warehouses` | inventory:read | List warehouses (paginated or fetch single) |
| POST | `/api/inventory/warehouses` | inventory:create | Create warehouse |
| GET | `/api/inventory/locations` | inventory:read | List warehouse locations (paginated) |
| POST | `/api/inventory/locations` | inventory:create | Create warehouse location |
| POST | `/api/inventory/transfers` | inventory:create | Create stock transfer (transactional, dual movements) |
| GET | `/api/inventory/transfers` | inventory:read | List stock transfers |
| POST | `/api/inventory/adjustments` | inventory:create | Record inventory adjustment (transactional) |

---

## Purchases Module

| Method | Endpoint | Permission | Description |
|--------|----------|-----------|-------------|
| GET | `/api/purchases/suppliers` | purchases:read | List suppliers (paginated, searchable, filterable) |
| POST | `/api/purchases/suppliers` | purchases:create | Create supplier |
| GET | `/api/purchases/orders` | purchases:read | List purchase orders (paginated, filterable by status) |
| POST | `/api/purchases/orders` | purchases:create | Create purchase order with line items |
| GET | `/api/purchases/orders/[id]` | purchases:read | Get purchase order with line items |
| PUT | `/api/purchases/orders/[id]` | purchases:update | Update PO status/notes (transactional) |
| DELETE | `/api/purchases/orders/[id]` | purchases:delete | Soft delete purchase order |
| GET | `/api/purchases/grn` | purchases:read | List goods received notes (paginated, filterable) |
| POST | `/api/purchases/grn` | purchases:create | Create GRN (transactional: stock mvmt + PO update) |
| GET | `/api/purchases/invoices` | purchases:read | List supplier invoices (paginated, filterable) |
| POST | `/api/purchases/invoices` | purchases:create | Create supplier invoice (transactional: balance update) |

---

## Sales Module

| Method | Endpoint | Permission | Description |
|--------|----------|-----------|-------------|
| GET | `/api/sales/customers` | sales:read | List customers (paginated, searchable, filterable) |
| POST | `/api/sales/customers` | sales:create | Create customer |
| POST | `/api/sales/pos` | sales:create | Create sale (transactional: stock mvmt + invoice) |
| GET | `/api/sales/orders/[id]` | sales:read | Get sales order with line items |
| PUT | `/api/sales/orders/[id]` | sales:update | Update sales order (transactional) |
| DELETE | `/api/sales/orders/[id]` | sales:delete | Soft delete sales order |

---

## Request/Response Formats

### Success Response (200/201)
```json
{
  "success": true,
  "product": { "id": 1, "product_name": "...", ... },
  "page": 1,
  "limit": 20,
  "total": 150
}
```

### Error Response (400/403/404/409/500)
```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details (optional)"
}
```

---

## Query Parameters

### Pagination
- `page` (default: 1) - Page number
- `limit` (default: 20) - Records per page

### Search & Filter
- `q` - Search by name/code (ILIKE, case-insensitive)
- `status` - Filter by status (active/inactive/pending/completed)
- `supplier_id` - Filter by supplier
- `warehouse_id` - Filter by warehouse
- `po_id` - Filter by purchase order
- `type` - Filter transfer type

---

## Roles & Default Permissions

### Admin
- All inventory, purchases, sales (CRUD)

### Manager
- inventory: create, read, update
- purchases: create, read, update
- sales: create, read, update

### Staff
- inventory: create, read
- purchases: read
- sales: create, read

### Viewer
- inventory: read
- purchases: read
- sales: read

---

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET/PUT succeeded |
| 201 | Created | POST succeeded |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate record (unique constraint) |
| 500 | Server Error | Database error, transaction rollback |

---

## Transactional Endpoints

These endpoints guarantee atomicity (all-or-nothing):

1. **PUT /api/inventory/products/[id]** - Update product + price history insert
2. **POST /api/purchases/grn** - GRN + stock movements + PO updates
3. **POST /api/purchases/invoices** - Invoice creation + balance update
4. **POST /api/sales/pos** - Sale + stock mvmt + invoice + payment
5. **POST /api/inventory/transfers** - Transfer + dual stock movements
6. **POST /api/inventory/adjustments** - Adjustment + stock movement
7. **PUT /api/purchases/orders/[id]** - PO update
8. **PUT /api/sales/orders/[id]** - Sales order update

---

## Soft Deletes

The following endpoints use soft deletes (set `deleted_at` timestamp):
- DELETE /api/inventory/products/[id]
- DELETE /api/purchases/orders/[id]
- DELETE /api/sales/orders/[id]

Records remain in database for audit trail.

---

## Quick Test Command

```bash
# Get auth token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  | jq -r '.token')

# List products
curl -X GET http://localhost:3000/api/inventory/products \
  -H "Authorization: Bearer $TOKEN"

# Create supplier
curl -X POST http://localhost:3000/api/purchases/suppliers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"supplier_code":"TEST001","supplier_name":"Test Supplier"}'

# Create sale
curl -X POST http://localhost:3000/api/sales/pos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id":1,"sale_number":"SALE001","warehouse_id":1,
    "payment_method":"cash","items":[{"product_id":1,"quantity":10}]
  }'
```

---

## Database Initialization

```bash
node scripts/seed-db.js
```

Creates:
- Roles (Admin, Manager, Staff, Viewer)
- Permissions (inventory, purchases, sales)
- Test suppliers, customers, warehouses
- Product categories

---

## Documentation Files

- `Documentation/API_REFERENCE.md` - Detailed endpoint docs
- `Documentation/TESTING_GUIDE.md` - Complete test scenarios
- `IMPLEMENTATION_COMPLETE.md` - Summary & features
- This file - Quick reference

---

**Total Endpoints:** 22  
**Total Permissions:** 12  
**Database Tables Used:** 30+  
**Transactional Operations:** 8

---
