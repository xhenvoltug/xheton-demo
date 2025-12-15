import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const res = await query(
      `SELECT so.*, c.customer_name FROM sales_orders so
       LEFT JOIN customers c ON so.customer_id = c.id
       WHERE so.id = $1 AND so.deleted_at IS NULL`,
      [id]
    );
    if (res.rowCount === 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    
    const itemsRes = await query(
      `SELECT * FROM sales_order_items WHERE sales_order_id = $1 AND deleted_at IS NULL`,
      [id]
    );

    return NextResponse.json({ success: true, order: res.rows[0], items: itemsRes.rows });
  } catch (err) {
    console.error('GET sales order error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch sales order' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  let client;
  try {
    const user = await requireAuth();
    const allowed = await hasPermission(user.role_id, 'sales', 'update');
    if (!allowed) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    client = await getClient();
    await client.query('BEGIN');

    const updates = [];
    const paramsArr = [];
    let i = 1;

    if (status !== undefined) {
      updates.push('status = $' + i);
      paramsArr.push(status);
      i++;
    }
    if (notes !== undefined) {
      updates.push('notes = $' + i);
      paramsArr.push(notes);
      i++;
    }

    if (updates.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    updates.push('updated_by = $' + i);
    paramsArr.push(user.id || null);
    i++;
    updates.push('updated_at = NOW()');

    paramsArr.push(id);
    const sql = 'UPDATE sales_orders SET ' + updates.join(', ') + ' WHERE id = $' + i + ' RETURNING *';
    const res = await client.query(sql, paramsArr);

    if (res.rowCount === 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'Sales order not found' }, { status: 404 });
    }

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({ success: true, order: res.rows[0] });
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (e) {}
      client.release();
    }
    console.error('PUT sales order error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to update sales order', message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth();
    const allowed = await hasPermission(user.role_id, 'sales', 'delete');
    if (!allowed) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    await query('UPDATE sales_orders SET deleted_at = NOW(), updated_by = $1 WHERE id = $2', [user.id || null, id]);
    return NextResponse.json({ success: true, message: 'Sales order deleted' });
  } catch (err) {
    console.error('DELETE sales order error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to delete sales order' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
