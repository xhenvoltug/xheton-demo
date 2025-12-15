import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const q = searchParams.get('q') || '';

    const rows = await query(
      `SELECT id, invoice_number, supplier_id as customer_id, total_amount, status, created_at FROM supplier_invoices
       WHERE (invoice_number ILIKE $1)
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as count FROM supplier_invoices 
       WHERE (invoice_number ILIKE $1)`,
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
    console.error('GET /api/purchases/invoices/list error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
