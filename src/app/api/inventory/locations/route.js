import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const warehouseId = searchParams.get('warehouse_id');

    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM warehouse_locations WHERE deleted_at IS NULL';
    const params = [];

    if (warehouseId) {
      sql += ` AND warehouse_id = $${params.length + 1}`;
      params.push(warehouseId);
    }

    sql += ` ORDER BY location_code ASC LIMIT ${limit} OFFSET ${offset}`;

    const res = await query(sql, params);
    const countRes = await query(`SELECT COUNT(*) FROM warehouse_locations WHERE deleted_at IS NULL${warehouseId ? ` AND warehouse_id = $1` : ''}`, warehouseId ? [warehouseId] : []);

    return NextResponse.json({
      success: true,
      locations: res.rows,
      total: parseInt(countRes.rows[0].count, 10),
      page,
      limit
    });
  } catch (err) {
    console.error('GET locations error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch warehouse locations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { warehouse_id, location_code, aisle, rack, shelf, bin_count } = body;

    if (!warehouse_id || !location_code) {
      return NextResponse.json({ success: false, error: 'warehouse_id and location_code required' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO warehouse_locations (warehouse_id, location_code, aisle, rack, shelf, bin_count, status, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'active', $7, NOW()) RETURNING *`,
      [warehouse_id, location_code, aisle || null, rack || null, shelf || null, bin_count || 0, null]
    );

    return NextResponse.json({ success: true, location: res.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST location error:', err.message);
    if (err.code === '23505') return NextResponse.json({ success: false, error: 'Location code already exists in warehouse' }, { status: 409 });
    return NextResponse.json({ success: false, error: 'Failed to create warehouse location' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
