#!/usr/bin/env node

/**
 * Database Seeding Script
 * Initializes roles, permissions, and basic test data for inventory/purchases/sales modules
 * Run: node scripts/seed-db.js
 */

const { Pool } = require('pg');
require('dotenv').config();

// Use fallback database (local) or DATABASE_URL
const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_FALLBACK_USER}:${process.env.DB_FALLBACK_PASSWORD}@${process.env.DB_FALLBACK_HOST}:${process.env.DB_FALLBACK_PORT}/${process.env.DB_FALLBACK_NAME}`;

const pool = new Pool({
  connectionString,
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Starting database seed...');

    // 1. Create roles if not exists
    const roles = [
      { code: 'admin', name: 'Administrator', description: 'Full system access' },
      { code: 'manager', name: 'Manager', description: 'Department manager with create/update access' },
      { code: 'staff', name: 'Staff', description: 'Regular staff with read/create access' },
      { code: 'viewer', name: 'Viewer', description: 'Read-only access' },
    ];

    for (const role of roles) {
      const existing = await client.query(
        'SELECT id FROM roles WHERE code = $1',
        [role.code]
      );
      if (existing.rowCount === 0) {
        await client.query(
          'INSERT INTO roles (code, name, description, is_active, created_at) VALUES ($1, $2, $3, true, NOW())',
          [role.code, role.name, role.description]
        );
        console.log(`✓ Created role: ${role.name}`);
      }
    }

    // 2. Create permissions if not exists
    const permissions = [
      { code: 'inventory:create', module: 'inventory', action: 'create', description: 'Create inventory items' },
      { code: 'inventory:read', module: 'inventory', action: 'read', description: 'Read inventory items' },
      { code: 'inventory:update', module: 'inventory', action: 'update', description: 'Update inventory items' },
      { code: 'inventory:delete', module: 'inventory', action: 'delete', description: 'Delete inventory items' },
      { code: 'purchases:create', module: 'purchases', action: 'create', description: 'Create purchase orders' },
      { code: 'purchases:read', module: 'purchases', action: 'read', description: 'Read purchase orders' },
      { code: 'purchases:update', module: 'purchases', action: 'update', description: 'Update purchase orders' },
      { code: 'purchases:delete', module: 'purchases', action: 'delete', description: 'Delete purchase orders' },
      { code: 'sales:create', module: 'sales', action: 'create', description: 'Create sales orders' },
      { code: 'sales:read', module: 'sales', action: 'read', description: 'Read sales orders' },
      { code: 'sales:update', module: 'sales', action: 'update', description: 'Update sales orders' },
      { code: 'sales:delete', module: 'sales', action: 'delete', description: 'Delete sales orders' },
    ];

    for (const perm of permissions) {
      const existing = await client.query(
        'SELECT id FROM permissions WHERE code = $1',
        [perm.code]
      );
      if (existing.rowCount === 0) {
        await client.query(
          'INSERT INTO permissions (code, module, action, description, created_at) VALUES ($1, $2, $3, $4, NOW())',
          [perm.code, perm.module, perm.action, perm.description]
        );
        console.log(`✓ Created permission: ${perm.code}`);
      }
    }

    // 3. Assign permissions to roles
    const rolePermissions = [
      { role: 'admin', perms: ['inventory:create', 'inventory:read', 'inventory:update', 'inventory:delete', 'purchases:create', 'purchases:read', 'purchases:update', 'purchases:delete', 'sales:create', 'sales:read', 'sales:update', 'sales:delete'] },
      { role: 'manager', perms: ['inventory:create', 'inventory:read', 'inventory:update', 'purchases:create', 'purchases:read', 'purchases:update', 'sales:create', 'sales:read', 'sales:update'] },
      { role: 'staff', perms: ['inventory:create', 'inventory:read', 'purchases:read', 'sales:create', 'sales:read'] },
      { role: 'viewer', perms: ['inventory:read', 'purchases:read', 'sales:read'] },
    ];

    for (const rp of rolePermissions) {
      const roleRes = await client.query('SELECT id FROM roles WHERE code = $1', [rp.role]);
      const roleId = roleRes.rows[0].id;

      for (const permCode of rp.perms) {
        const permRes = await client.query('SELECT id FROM permissions WHERE code = $1', [permCode]);
        const permId = permRes.rows[0].id;

        const existing = await client.query(
          'SELECT id FROM role_permissions WHERE role_id = $1 AND permission_id = $2',
          [roleId, permId]
        );
        if (existing.rowCount === 0) {
          await client.query(
            'INSERT INTO role_permissions (role_id, permission_id, created_at) VALUES ($1, $2, NOW())',
            [roleId, permId]
          );
        }
      }
      console.log(`✓ Assigned permissions to role: ${rp.role}`);
    }

    // 4. Create test suppliers
    const suppliers = [
      { code: 'SUP001', name: 'ABC Pharmaceuticals Ltd', contact: 'John Supplier', email: 'supply@abc.com', phone: '+256701123456', country: 'Uganda' },
      { code: 'SUP002', name: 'Global Medical Supplies', contact: 'Mary Sales', email: 'sales@global.com', phone: '+256702234567', country: 'Kenya' },
      { code: 'SUP003', name: 'East Africa Imports', contact: 'David Import', email: 'import@eafrica.com', phone: '+256703345678', country: 'Uganda' },
    ];

    for (const sup of suppliers) {
      const existing = await client.query('SELECT id FROM suppliers WHERE supplier_code = $1', [sup.code]);
      if (existing.rowCount === 0) {
        await client.query(
          'INSERT INTO suppliers (supplier_code, supplier_name, contact_person, email, phone, country, status, current_balance, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, NOW())',
          [sup.code, sup.name, sup.contact, sup.email, sup.phone, sup.country, 'active']
        );
        console.log(`✓ Created supplier: ${sup.name}`);
      }
    }

    // 5. Create test customers
    const customers = [
      { code: 'CUST001', name: 'City Clinic', email: 'clinic@city.com', phone: '+256701999111', city: 'Kampala', country: 'Uganda', credit: 50000 },
      { code: 'CUST002', name: 'Rural Health Center', email: 'health@rural.com', phone: '+256702999222', city: 'Jinja', country: 'Uganda', credit: 30000 },
      { code: 'CUST003', name: 'Private Hospital', email: 'hospital@private.com', phone: '+256703999333', city: 'Kampala', country: 'Uganda', credit: 100000 },
    ];

    for (const cust of customers) {
      const existing = await client.query('SELECT id FROM customers WHERE customer_code = $1', [cust.code]);
      if (existing.rowCount === 0) {
        await client.query(
          'INSERT INTO customers (customer_code, customer_name, email, phone, city, country, credit_limit, current_balance, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8, NOW())',
          [cust.code, cust.name, cust.email, cust.phone, cust.city, cust.country, cust.credit, 'active']
        );
        console.log(`✓ Created customer: ${cust.name}`);
      }
    }

    // 6. Create test warehouses
    const warehouses = [
      { code: 'WH001', name: 'Main Warehouse', location: 'Kampala Industrial', capacity: 10000 },
      { code: 'WH002', name: 'Branch Warehouse', location: 'Jinja', capacity: 5000 },
    ];

    for (const wh of warehouses) {
      const existing = await client.query('SELECT id FROM warehouses WHERE warehouse_code = $1', [wh.code]);
      if (existing.rowCount === 0) {
        await client.query(
          'INSERT INTO warehouses (warehouse_code, warehouse_name, location, capacity, status, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
          [wh.code, wh.name, wh.location, wh.capacity, 'active']
        );
        console.log(`✓ Created warehouse: ${wh.name}`);
      }
    }

    // 7. Create product categories
    const categories = [
      { code: 'CAT001', name: 'Antibiotics' },
      { code: 'CAT002', name: 'Antivirals' },
      { code: 'CAT003', name: 'Analgesics' },
    ];

    for (const cat of categories) {
      const existing = await client.query('SELECT id FROM product_categories WHERE category_name = $1', [cat.name]);
      if (existing.rowCount === 0) {
        await client.query(
          'INSERT INTO product_categories (category_name, created_at) VALUES ($1, NOW())',
          [cat.name]
        );
        console.log(`✓ Created category: ${cat.name}`);
      }
    }

    console.log('\n✓ Database seeding completed successfully!');
  } catch (err) {
    console.error('Seeding error:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
