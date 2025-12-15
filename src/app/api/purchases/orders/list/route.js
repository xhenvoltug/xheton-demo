import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const q = searchParams.get('q') || '';

    const rows = await query(
      `SELECT po.id, po.po_number, po.supplier_id, s.supplier_name, po.total_amount, po.status, po.created_at FROM purchase_orders po
       LEFT JOIN suppliers s ON po.supplier_id = s.id
       WHERE (po.po_number ILIKE $1 OR s.supplier_name ILIKE $1)
       AND po.deleted_at IS NULL
       ORDER BY po.created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as count FROM purchase_orders po
       LEFT JOIN suppliers s ON po.supplier_id = s.id
       WHERE (po.po_number ILIKE $1 OR s.supplier_name ILIKE $1)
       AND po.deleted_at IS NULL`,
      [`%${q}%`]
    );

    return NextResponse.json({
      success: true,
      data: rows.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset
    });
  } catch (err) {
    console.error('GET /api/purchases/orders/list error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch purchase orders', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
