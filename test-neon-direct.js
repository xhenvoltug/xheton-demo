const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_HExwNUY6aVP9@ep-small-sound-adgn2dmu-pooler.c-2.us-east-1.aws.neon.tech/xheton_db?sslmode=require&channel_binding=require';

const pool = new Pool({ connectionString });

async function main() {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL');
    console.log('Product count:', result.rows[0]);
    
    const products = await pool.query('SELECT id, product_code, product_name, current_stock, deleted_at FROM products WHERE deleted_at IS NULL LIMIT 10');
    console.log('Products:', products.rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
