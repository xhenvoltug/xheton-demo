const { query } = require('./src/lib/db');

async function createOpeningStockSupplier() {
  try {
    // Check if it already exists
    const existing = await query(
      "SELECT id FROM suppliers WHERE supplier_code = 'OPENING_STOCK' AND deleted_at IS NULL"
    );

    if (existing.rowCount > 0) {
      console.log('✅ Opening Stock supplier already exists');
      process.exit(0);
    }

    // Create Opening Stock supplier
    const result = await query(
      `INSERT INTO suppliers (supplier_name, supplier_code, email, country, is_active, payment_terms, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, supplier_name, supplier_code`,
      ['Opening Stock', 'OPENING_STOCK', 'system@xheton.local', 'Internal', true, 0]
    );

    console.log('✅ Opening Stock supplier created successfully:');
    console.log(result.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createOpeningStockSupplier();
