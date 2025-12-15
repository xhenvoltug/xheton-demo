import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Inventory batches - READ ONLY, auto-created by GRN
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const warehouse_id = searchParams.get('warehouse_id') || '';

    const offset = (page - 1) * limit;
    let whereClauses = ['status = \'active\''];
    const params = [];

    if (warehouse_id) {
      whereClauses.push(`warehouse_id = $${params.length + 1}`);
      params.push(warehouse_id);
    }

    const whereClause = whereClauses.join(' AND ');

    const sql = `SELECT pb.id, pb.product_id, pb.batch_number, pb.warehouse_id, pb.quantity,
                        pb.unit_cost, pb.manufacture_date, pb.expiry_date, pb.status, pb.created_at,
                        p.product_code, p.product_name
                 FROM product_batches pb
                 JOIN products p ON pb.product_id = p.id
                 WHERE ${whereClause}
                 ORDER BY pb.expiry_date ASC
                 LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    params.push(limit, offset);
    const res = await query(sql, params);

    const countSql = `SELECT COUNT(*) as count FROM product_batches WHERE ${whereClause}`;
    const countRes = await query(countSql, params.slice(0, params.length - 2));

    return NextResponse.json({
      success: true,
      data: res.rows,
      total: parseInt(countRes.rows[0].count),
      page,
      limit
    });
  } catch (err) {
    console.error('GET batches error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch batches' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
