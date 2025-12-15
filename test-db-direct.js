const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_HExwNUY6aVP9@ep-small-sound-adgn2dmu-pooler.c-2.us-east-1.aws.neon.tech/xheton_db?sslmode=require&channel_binding=require'
});

async function test() {
  try {
    const res = await pool.query('SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL');
    console.log('Total products (not deleted):', res.rows[0].count);
    
    const res2 = await pool.query('SELECT id, product_code, product_name, deleted_at FROM products LIMIT 5');
    console.log('Sample products:', res2.rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

test();
