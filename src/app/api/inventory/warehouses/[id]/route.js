import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const res = await query(
      'SELECT * FROM warehouses WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Warehouse not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, warehouse: res.rows[0] });
  } catch (err) {
    console.error('GET warehouse error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch warehouse' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { warehouse_name, city, address, capacity, warehouse_type, is_active } = body;

    // Build dynamic update query (exclude warehouse_code since it's unique)
    const updates = [];
    const updateParams = [];
    let paramCount = 1;

    if (warehouse_name !== undefined) {
      updates.push(`warehouse_name = $${paramCount}`);
      updateParams.push(warehouse_name);
      paramCount++;
    }
    if (city !== undefined) {
      updates.push(`city = $${paramCount}`);
      updateParams.push(city);
      paramCount++;
    }
    if (address !== undefined) {
      updates.push(`address = $${paramCount}`);
      updateParams.push(address);
      paramCount++;
    }
    if (capacity !== undefined) {
      updates.push(`capacity = $${paramCount}`);
      updateParams.push(capacity);
      paramCount++;
    }
    if (warehouse_type !== undefined) {
      updates.push(`warehouse_type = $${paramCount}`);
      updateParams.push(warehouse_type);
      paramCount++;
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      updateParams.push(is_active);
      paramCount++;
    }

    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    const whereParamCount = paramCount;
    updateParams.push(id);
    const sql = `UPDATE warehouses SET ${updates.join(', ')} WHERE id = $${whereParamCount} AND deleted_at IS NULL RETURNING *`;

    console.log('UPDATE SQL:', sql, 'PARAMS:', updateParams);
    const res = await query(sql, updateParams);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Warehouse not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, warehouse: res.rows[0] });
  } catch (err) {
    console.error('PUT warehouse error:', err.message);
    if (err.code === '23505') {
      return NextResponse.json({ success: false, error: 'Warehouse code already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update warehouse' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Soft delete: set deleted_at timestamp
    const res = await query(
      'UPDATE warehouses SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *',
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Warehouse not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Warehouse deleted successfully' });
  } catch (err) {
    console.error('DELETE warehouse error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to delete warehouse' }, { status: 500 });
  }
}
