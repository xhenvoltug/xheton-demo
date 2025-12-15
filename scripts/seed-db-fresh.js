#!/usr/bin/env node

/**
 * Database Seeding Script
 * Seeds fresh database with roles, permissions, and initial data
 * Run: node scripts/seed-db-fresh.js
 */

const { Pool } = require('pg');
require('dotenv').config();

// Use fallback database (local) for seeding, not Neon cloud
const connectionString = `postgresql://${process.env.DB_FALLBACK_USER}:${process.env.DB_FALLBACK_PASSWORD}@${process.env.DB_FALLBACK_HOST}:${process.env.DB_FALLBACK_PORT}/${process.env.DB_FALLBACK_NAME}`;

const pool = new Pool({
  connectionString,
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Starting database seed...\n');
    
    // Debug: check which database we're connected to
    const dbCheck = await client.query('SELECT current_database(), current_user');
    console.log(`Connected to: ${dbCheck.rows[0].current_database} as ${dbCheck.rows[0].current_user}\n`);

    // 1. Create roles
    console.log('📋 Creating roles...');
    const roles = [
      { role_code: 'admin', role_name: 'Administrator', description: 'Full system access' },
      { role_code: 'manager', role_name: 'Manager', description: 'Manager with full module access' },
      { role_code: 'staff', role_name: 'Staff', description: 'Staff with read/create access' },
      { role_code: 'viewer', role_name: 'Viewer', description: 'Read-only access' },
    ];

    const roleMap = {};
    for (const role of roles) {
      await client.query(
        `INSERT INTO roles (role_code, role_name, description, is_active, created_at)
         VALUES ($1, $2, $3, true, NOW())
         ON CONFLICT (role_code) DO NOTHING`,
        [role.role_code, role.role_name, role.description]
      );
      // Fetch the role ID regardless of insert or conflict
      const result = await client.query(
        `SELECT id FROM roles WHERE role_code = $1`,
        [role.role_code]
      );
      if (result.rows.length > 0) {
        roleMap[role.role_code] = result.rows[0].id;
        console.log(`  ✓ Created role: ${role.role_name}`);
      }
    }

    // 2. Create permissions
    console.log('\n🔐 Creating permissions...');
    const permissions = [
      // Inventory permissions
      { permission_code: 'inventory:read', description: 'View inventory' },
      { permission_code: 'inventory:create', description: 'Create inventory items' },
      { permission_code: 'inventory:update', description: 'Update inventory items' },
      { permission_code: 'inventory:delete', description: 'Delete inventory items' },
      // Purchases permissions
      { permission_code: 'purchases:read', description: 'View purchase orders' },
      { permission_code: 'purchases:create', description: 'Create purchase orders' },
      { permission_code: 'purchases:update', description: 'Update purchase orders' },
      { permission_code: 'purchases:delete', description: 'Delete purchase orders' },
      // Sales permissions
      { permission_code: 'sales:read', description: 'View sales' },
      { permission_code: 'sales:create', description: 'Create sales' },
      { permission_code: 'sales:update', description: 'Update sales' },
      { permission_code: 'sales:delete', description: 'Delete sales' },
    ];

    const permissionMap = {};
    for (const perm of permissions) {
      await client.query(
        `INSERT INTO permissions (permission_name, permission_code, description, is_active, created_at)
         VALUES ($1, $2, $3, true, NOW())
         ON CONFLICT (permission_code) DO NOTHING`,
        [perm.permission_code, perm.permission_code, perm.description]
      );
      // Fetch the permission ID regardless of insert or conflict
      const result = await client.query(
        `SELECT id FROM permissions WHERE permission_code = $1`,
        [perm.permission_code]
      );
      if (result.rows.length > 0) {
        permissionMap[perm.permission_code] = result.rows[0].id;
        console.log(`  ✓ Created permission: ${perm.permission_code}`);
      }
    }

    // 3. Assign permissions to roles
    console.log('\n🔗 Assigning permissions to roles...');
    const rolePermissions = {
      admin: Object.keys(permissionMap), // Admin has all permissions
      manager: ['inventory:read', 'inventory:create', 'inventory:update', 'purchases:read', 'purchases:create', 'purchases:update', 'sales:read', 'sales:create', 'sales:update'],
      staff: ['inventory:read', 'inventory:create', 'purchases:read', 'sales:read', 'sales:create'],
      viewer: ['inventory:read', 'purchases:read', 'sales:read'],
    };

    for (const [roleCode, permCodes] of Object.entries(rolePermissions)) {
      for (const permCode of permCodes) {
        const roleId = roleMap[roleCode];
        const permId = permissionMap[permCode];
        if (roleId && permId) {
          await client.query(
            `INSERT INTO role_permissions (role_id, permission_id, created_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (role_id, permission_id) DO NOTHING`,
            [roleId, permId]
          );
        }
      }
      console.log(`  ✓ Assigned permissions to ${roleCode}`);
    }

    // 4. Create test suppliers
    console.log('\n🏭 Creating test suppliers...');
    const suppliers = [
      { supplier_code: 'SUP001', supplier_name: 'ABC Pharmaceuticals Ltd', email: 'info@abcpharma.com' },
      { supplier_code: 'SUP002', supplier_name: 'XYZ Medical Supplies', email: 'contact@xyzmedical.com' },
      { supplier_code: 'SUP003', supplier_name: 'Global Health Products', email: 'sales@globalhp.com' },
    ];

    for (const supplier of suppliers) {
      await client.query(
        `INSERT INTO suppliers (supplier_code, supplier_name, email, current_balance, is_active, created_at)
         VALUES ($1, $2, $3, 0, true, NOW())
         ON CONFLICT (supplier_code) DO NOTHING`,
        [supplier.supplier_code, supplier.supplier_name, supplier.email]
      );
      console.log(`  ✓ Created supplier: ${supplier.supplier_name}`);
    }

    // 5. Create test customers
    console.log('\n👥 Creating test customers...');
    const customers = [
      { customer_code: 'CUST001', customer_name: 'Main Clinic', email: 'clinic@example.com' },
      { customer_code: 'CUST002', customer_name: 'City Hospital', email: 'hospital@example.com' },
      { customer_code: 'CUST003', customer_name: 'Health Center', email: 'health@example.com' },
    ];

    for (const customer of customers) {
      await client.query(
        `INSERT INTO customers (customer_code, customer_name, email, current_balance, credit_limit, is_active, created_at)
         VALUES ($1, $2, $3, 0, 100000, true, NOW())
         ON CONFLICT (customer_code) DO NOTHING`,
        [customer.customer_code, customer.customer_name, customer.email]
      );
      console.log(`  ✓ Created customer: ${customer.customer_name}`);
    }

    // 6. Create test warehouses
    console.log('\n🏢 Creating test warehouses...');
    const warehouses = [
      { warehouse_code: 'WH001', warehouse_name: 'Main Warehouse', city: 'Kampala' },
      { warehouse_code: 'WH002', warehouse_name: 'Branch Warehouse', city: 'Jinja' },
    ];

    for (const warehouse of warehouses) {
      await client.query(
        `INSERT INTO warehouses (warehouse_code, warehouse_name, city, is_active, created_at)
         VALUES ($1, $2, $3, true, NOW())
         ON CONFLICT (warehouse_code) DO NOTHING`,
        [warehouse.warehouse_code, warehouse.warehouse_name, warehouse.city]
      );
      console.log(`  ✓ Created warehouse: ${warehouse.warehouse_name}`);
    }

    // 7. Create test product categories
    console.log('\n📂 Creating product categories...');
    const categories = [
      { category_code: 'CAT001', category_name: 'Antibiotics', description: 'Antibiotic medications' },
      { category_code: 'CAT002', category_name: 'Antivirals', description: 'Antiviral medications' },
      { category_code: 'CAT003', category_name: 'Analgesics', description: 'Pain relief medications' },
    ];

    for (const category of categories) {
      await client.query(
        `INSERT INTO product_categories (category_code, category_name, description, is_active, created_at)
         VALUES ($1, $2, $3, true, NOW())
         ON CONFLICT (category_code) DO NOTHING`,
        [category.category_code, category.category_name, category.description]
      );
      console.log(`  ✓ Created category: ${category.category_name}`);
    }

    console.log('\n========================================');
    console.log('✓ Database seeding completed successfully!');
    console.log('========================================\n');
    console.log('Created:');
    console.log('  • 4 roles');
    console.log('  • 12 permissions');
    console.log('  • 3 suppliers');
    console.log('  • 3 customers');
    console.log('  • 2 warehouses');
    console.log('  • 3 product categories\n');
    console.log('💡 Tip: Run "node scripts/seed-pricing-plans.js" to add pricing plans');
    console.log('========================================\n');

  } catch (err) {
    console.error('Seeding error:', err.message);
    throw err;
  } finally {
    await client.release();
    await pool.end();
  }
}

seed();
