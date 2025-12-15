import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Inventory movements - READ ONLY AUDIT LOG of all stock changes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const product_id = searchParams.get('product_id') || '';
    const warehouse_id = searchParams.get('warehouse_id') || '';
    const movement_type = searchParams.get('movement_type') || ''; // IN or OUT

    const offset = (page - 1) * limit;
    let whereClauses = [];
    const params = [];

    if (product_id) {
      whereClauses.push(`sm.product_id = $${params.length + 1}`);
      params.push(product_id);
    }

    if (warehouse_id) {
      whereClauses.push(`sm.warehouse_id = $${params.length + 1}`);
      params.push(warehouse_id);
    }

    if (movement_type && movement_type !== 'all') {
      whereClauses.push(`sm.movement_type = $${params.length + 1}`);
      params.push(movement_type);
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `SELECT sm.id, sm.product_id, sm.warehouse_id, sm.batch_id, sm.movement_type,
                        sm.quantity, sm.reference_type, sm.reference_id, sm.notes, sm.created_at,
                        p.product_code, p.product_name
                 FROM stock_movements sm
                 JOIN products p ON sm.product_id = p.id
                 ${whereClause}
                 ORDER BY sm.created_at DESC
                 LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    params.push(limit, offset);
    const res = await query(sql, params);

    const countSql = `SELECT COUNT(*) as count FROM stock_movements sm ${whereClause}`;
    const countRes = await query(countSql, params.slice(0, params.length - 2));

    return NextResponse.json({
      success: true,
      data: res.rows,
      total: parseInt(countRes.rows[0].count),
      page,
      limit
    });
  } catch (err) {
    console.error('GET movements error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch movements' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
