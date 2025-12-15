import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const res = await query('SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (res.rowCount === 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, product: res.rows[0] });
  } catch (err) {
    console.error('GET product error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  let client;
  try {
    const { id } = await params;
    const body = await request.json();
    
    client = await getClient();
    await client.query('BEGIN');

    const updates = [];
    const paramsArr = [];
    let i = 1;
    for (const key of ['product_code','barcode','product_name','category_id','description','cost_price','selling_price','current_stock','tax_rate','is_active','track_inventory']) {
      if (body[key] !== undefined) {
        updates.push(key + ' = $' + i);
        paramsArr.push(body[key]);
        i++;
      }
    }
    if (updates.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    let oldPrice = null;
    if (body.selling_price !== undefined) {
      const oldRes = await client.query('SELECT selling_price FROM products WHERE id = $1', [id]);
      oldPrice = oldRes.rows[0] ? oldRes.rows[0].selling_price : null;
    }

    updates.push('updated_by = $' + i);
    paramsArr.push(null);
    i++;
    updates.push('updated_at = NOW()');

    paramsArr.push(id);
    const sql = 'UPDATE products SET ' + updates.join(', ') + ' WHERE id = $' + i + ' RETURNING *';
    const res = await client.query(sql, paramsArr);

    if (res.rowCount === 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    if (body.selling_price !== undefined && oldPrice !== body.selling_price) {
      await client.query(
        `INSERT INTO product_price_history (product_id, price_type, old_price, new_price, effective_date, created_by) VALUES ($1,'selling', $2, $3, NOW(), $4)`,
        [id, oldPrice, body.selling_price, null]
      );
    }

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({ success: true, product: res.rows[0] });
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (e) {}
      client.release();
    }
    console.error('PUT product error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to update product', message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('UPDATE products SET deleted_at = NOW(), updated_by = $1 WHERE id = $2', [null, id]);
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('DELETE product error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
