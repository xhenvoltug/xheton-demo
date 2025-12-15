import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const q = searchParams.get('q') || '';

    let whereClause = 'deleted_at IS NULL';
    let params = [];

    if (q && q.trim()) {
      whereClause += ` AND (product_name ILIKE $1 OR barcode ILIKE $1 OR product_code ILIKE $1)`;
      params.push(`%${q}%`);
    }

    // Always add limit and offset at the end
    const limitIndex = params.length + 1;
    const offsetIndex = params.length + 2;
    
    const sql = `SELECT id, product_code, product_name, barcode, category_id, selling_price, cost_price, current_stock, is_active, unit_of_measure
       FROM products
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${limitIndex} OFFSET $${offsetIndex}`;
    
    params.push(limit, offset);

    const countSql = `SELECT COUNT(*) as count FROM products WHERE ${whereClause}`;
    const countParams = q && q.trim() ? [`%${q}%`] : [];

    const rows = await query(sql, params);
    const countResult = await query(countSql, countParams);

    return NextResponse.json({
      success: true,
      data: rows.rows || [],
      total: parseInt(countResult.rows[0]?.count || 0),
      limit,
      offset
    });
  } catch (err) {
    console.error('GET /api/inventory/products/list error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';




