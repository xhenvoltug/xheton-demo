# Inventory, Purchases & Sales API Documentation

## Overview
This document describes the complete RESTful API for inventory management, purchase orders, and sales operations. All endpoints use JSON request/response formats and require authentication (JWT token in Authorization header).

---

## Authentication
All endpoints require a valid JWT token:
```
Authorization: Bearer <token>
```

Tokens are issued via the `/api/auth/login` endpoint (existing auth system).

---

## Inventory Module

### Product Categories
**Endpoint:** `/api/inventory/categories`

**GET** - List all product categories
- Query params: `page` (default 1), `limit` (default 20), `q` (search by name)
- Response: `{ success, categories[], total, page, limit }`

**POST** - Create product category (requires `inventory:create` permission)
- Body: `{ category_name, description? }`
- Response: `{ success, category }` (201)

---

### Products
**Endpoint:** `/api/inventory/products`

**GET** - List all products
- Query params: `page`, `limit`, `q` (search by name/code)
- Response: `{ success, products[], total, page, limit }`

**POST** - Create product (requires `inventory:create` permission)
- Body: `{ product_code, barcode?, product_name, category_id?, description?, cost_price, selling_price, tax_rate?, is_active?, track_inventory? }`
- Response: `{ success, product }` (201)

**Endpoint:** `/api/inventory/products/[id]`

**GET** - Get product details
- Response: `{ success, product }`

**PUT** - Update product (requires `inventory:update` permission, transactional)
- Body: `{ product_code?, product_name?, selling_price?, ... }`
- If `selling_price` changes, automatically inserts record to `product_price_history`
- Response: `{ success, product }`

**DELETE** - Soft delete product (requires `inventory:delete` permission)
- Response: `{ success, message }`

---

### Warehouses
**Endpoint:** `/api/inventory/warehouses`

**GET** - List all warehouses
- Query params: `page`, `limit`, `warehouse_id` (fetch single)
- Response: `{ success, warehouses[]|warehouse, ... }`

**POST** - Create warehouse (requires `inventory:create` permission)
- Body: `{ warehouse_name, warehouse_code, location?, capacity?, manager_name?, contact_number? }`
- Response: `{ success, warehouse }` (201)

---

### Warehouse Locations
**Endpoint:** `/api/inventory/locations`

**GET** - List warehouse locations
- Query params: `page`, `limit`, `warehouse_id` (filter by warehouse)
- Response: `{ success, locations[], total, page, limit }`

**POST** - Create warehouse location (requires `inventory:create` permission)
- Body: `{ warehouse_id, location_code, aisle?, rack?, shelf?, bin_count? }`
- Response: `{ success, location }` (201)

---

### Stock Transfers
**Endpoint:** `/api/inventory/transfers`

**GET** - List stock transfers
- Query params: `page`, `limit`, `type` (default 'transfer')
- Response: `{ success, transfers[], total, page, limit }`

**POST** - Create stock transfer (requires `inventory:create` permission, transactional)
- Body: `{ product_id, from_warehouse_id, to_warehouse_id, quantity, transfer_number?, batch_id?, from_bin_id?, to_bin_id?, notes? }`
- Validates source warehouse has sufficient stock
- Automatically creates OUT movement from source and IN movement to destination
- Response: `{ success, transfer }` (201)

---

### Inventory Adjustments
**Endpoint:** `/api/inventory/adjustments`

**POST** - Record inventory adjustment (requires `inventory:create` permission, transactional)
- Body: `{ product_id, warehouse_id, quantity_change, adjustment_reason?, adjustment_number?, reference_notes? }`
- Validates sufficient stock if reducing inventory
- Automatically creates appropriate stock movement (IN for positive, OUT for negative)
- Response: `{ success, adjustment }` (201)

---

## Purchases Module

### Suppliers
**Endpoint:** `/api/purchases/suppliers`

**GET** - List all suppliers
- Query params: `page`, `limit`, `q` (search by name/code), `status` (active/inactive)
- Response: `{ success, suppliers[], total, page, limit }`

**POST** - Create supplier (requires `purchases:create` permission)
- Body: `{ supplier_code, supplier_name, contact_person?, email?, phone?, address?, city?, country?, payment_terms? }`
- Response: `{ success, supplier }` (201)

---

### Purchase Orders
**Endpoint:** `/api/purchases/orders`

**GET** - List purchase orders
- Query params: `page`, `limit`, `status` (pending/approved/received)
- Response: `{ success, orders[], total, page, limit }`

**POST** - Create purchase order (requires `purchases:create` permission)
- Body: `{ supplier_id, po_number, po_date?, expected_delivery_date?, items: [{ product_id, quantity, unit_price }], notes?, delivery_address? }`
- Response: `{ success, order, po_id }` (201)

**Endpoint:** `/api/purchases/orders/[id]`

**GET** - Get purchase order with items
- Response: `{ success, order, items[] }`

**PUT** - Update purchase order (requires `purchases:update` permission, transactional)
- Body: `{ status?, notes? }`
- Response: `{ success, order }`

**DELETE** - Soft delete purchase order (requires `purchases:delete` permission)
- Response: `{ success, message }`

---

### Goods Received Notes (GRN)
**Endpoint:** `/api/purchases/grn`

**GET** - List GRNs
- Query params: `page`, `limit`, `po_id` (filter by PO)
- Response: `{ success, grns[], total, page, limit }`

**POST** - Create GRN (requires `purchases:create` permission, transactional)
- Body: `{ purchase_order_id, warehouse_id, grn_number, grn_date?, items: [{ product_id, quantity_received, batch_number?, cost_per_unit? }], notes? }`
- For each item:
  - Inserts GRN item record
  - Creates/updates product batch if batch_number provided
  - Records stock movement (IN to warehouse)
  - Updates PO item `quantity_received`
- Response: `{ success, grn, grn_id }` (201)

---

### Supplier Invoices
**Endpoint:** `/api/purchases/invoices`

**GET** - List supplier invoices
- Query params: `page`, `limit`, `supplier_id`, `status`
- Response: `{ success, invoices[], total, page, limit }`

**POST** - Create supplier invoice (requires `purchases:create` permission, transactional)
- Body: `{ supplier_id, grn_id?, invoice_number, invoice_date?, items?: [{ description, quantity, unit_price }], total_amount, tax_amount?, notes? }`
- Automatically updates supplier `current_balance`
- Response: `{ success, invoice, invoice_id }` (201)

---

## Sales Module

### Customers
**Endpoint:** `/api/sales/customers`

**GET** - List all customers
- Query params: `page`, `limit`, `q` (search by name/code), `status`
- Response: `{ success, customers[], total, page, limit }`

**POST** - Create customer (requires `sales:create` permission)
- Body: `{ customer_code, customer_name, email?, phone?, address?, city?, country?, credit_limit? }`
- Response: `{ success, customer }` (201)

---

### Point of Sale (POS)
**Endpoint:** `/api/sales/pos`

**POST** - Create sale/invoice (requires `sales:create` permission, transactional)
- Body: `{ customer_id, sale_number, sale_date?, warehouse_id, items: [{ product_id, quantity, batch_id? }], notes?, payment_method? (cash/card/credit/cheque) }`
- Validates stock availability for all items
- Creates sales order with items
- Records stock movement OUT for each item
- Creates sales invoice automatically
- If payment_method is provided (not 'credit'), records payment and marks invoice as paid
- For credit sales, updates customer `current_balance`
- Response: `{ success, sale, sale_id, invoice, total_amount }` (201)

---

### Sales Orders
**Endpoint:** `/api/sales/orders`

**GET** - List sales orders (future endpoint - returns empty for now)
- Query params: `page`, `limit`, `status`
- Response: `{ success, orders[], total, page, limit }`

**Endpoint:** `/api/sales/orders/[id]`

**GET** - Get sales order with items
- Response: `{ success, order, items[] }`

**PUT** - Update sales order (requires `sales:update` permission, transactional)
- Body: `{ status?, notes? }`
- Response: `{ success, order }`

**DELETE** - Soft delete sales order (requires `sales:delete` permission)
- Response: `{ success, message }`

---

## Error Responses

Standard error response format:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details (if available)"
}
```

Common HTTP status codes:
- **400**: Bad request (missing/invalid fields)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (permission denied)
- **404**: Not found
- **409**: Conflict (duplicate key, etc.)
- **500**: Internal server error

---

## Transaction Safety

The following operations are wrapped in database transactions for atomicity:
- Product update with price history insertion
- GRN creation with stock movements and PO updates
- Sale creation with stock movements and invoice/payment recording
- Stock transfers with dual movements (OUT from source, IN to destination)
- Supplier invoice creation with balance updates

All transactional operations automatically rollback on any error and release database connections safely.

---

## Permission Requirements

| Module | Action | Permission Code | Required Role |
|--------|--------|-----------------|---------------|
| Inventory | Create/Update/Delete | `inventory:create/update/delete` | Manager, Admin |
| Inventory | Read | `inventory:read` | All |
| Purchases | Create/Update/Delete | `purchases:create/update/delete` | Manager, Admin |
| Purchases | Read | `purchases:read` | All |
| Sales | Create/Update/Delete | `sales:create/update/delete` | Manager, Admin |
| Sales | Read | `sales:read` | All |

Run `scripts/seed-db.js` to initialize roles and permissions in the database.

---

## Setting Up

1. **Seed Database**: Run `node scripts/seed-db.js` to create roles, permissions, suppliers, customers, warehouses, and categories.
2. **Test API**: Use Postman, curl, or any REST client with valid JWT tokens.
3. **Monitor Stock**: Query `stock_movements` to audit all inventory changes.

---

## Notes

- All monetary values use DECIMAL(15,2) format (UGX currency assumed).
- All date/time fields are stored in UTC timezone.
- Soft deletes: Rows are marked with `deleted_at` timestamp rather than removed.
- Audit fields: `created_by`, `updated_by`, `created_at`, `updated_at` are automatically managed.
- Stock balance is computed dynamically: `SUM(IN movements) - SUM(OUT movements)` per product/warehouse.
