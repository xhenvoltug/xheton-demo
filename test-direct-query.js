const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'xheton',
});

async function main() {
  try {
    await client.connect();
    const result = await client.query('SELECT id, product_code, product_name, current_stock, deleted_at FROM products');
    console.log('Total products in DB:', result.rows.length);
    console.log('Products:', result.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
