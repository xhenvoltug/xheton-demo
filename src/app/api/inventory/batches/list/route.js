import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const q = searchParams.get('q') || '';

    const rows = await query(
      `SELECT id, batch_number, product_id, quantity, expiry_date, status, created_at FROM product_batches
       WHERE (batch_number ILIKE $1)
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as count FROM product_batches 
       WHERE (batch_number ILIKE $1)`,
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
    console.error('GET /api/inventory/batches/list error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch batches', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
