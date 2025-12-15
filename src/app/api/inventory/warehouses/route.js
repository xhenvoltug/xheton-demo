import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const warehouseId = searchParams.get('warehouse_id');

    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM warehouses WHERE deleted_at IS NULL';
    const params = [];

    if (warehouseId) {
      sql = `SELECT * FROM warehouses WHERE id = $1 AND deleted_at IS NULL`;
      params.push(warehouseId);
    } else {
      sql += ` ORDER BY warehouse_name ASC LIMIT ${limit} OFFSET ${offset}`;
    }

    const res = await query(sql, params);

    if (warehouseId) {
      return res.rowCount === 0
        ? NextResponse.json({ success: false, error: 'Warehouse not found' }, { status: 404 })
        : NextResponse.json({ success: true, warehouse: res.rows[0] });
    }

    const countRes = await query('SELECT COUNT(*) FROM warehouses WHERE deleted_at IS NULL');
    return NextResponse.json({
      success: true,
      warehouses: res.rows,
      total: parseInt(countRes.rows[0].count, 10),
      page,
      limit
    });
  } catch (err) {
    console.error('GET warehouses error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch warehouses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { warehouse_name, warehouse_code, city, address, capacity, warehouse_type } = body;

    if (!warehouse_name || !warehouse_code) {
      return NextResponse.json({ success: false, error: 'warehouse_name and warehouse_code required' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO warehouses (warehouse_name, warehouse_code, city, address, capacity, warehouse_type, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW()) RETURNING *`,
      [warehouse_name, warehouse_code, city || null, address || null, capacity || null, warehouse_type || 'main']
    );

    return NextResponse.json({ success: true, warehouse: res.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST warehouse error:', err.message);
    if (err.code === '23505') return NextResponse.json({ success: false, error: 'Warehouse code already exists' }, { status: 409 });
    return NextResponse.json({ success: false, error: 'Failed to create warehouse' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
