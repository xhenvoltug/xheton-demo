import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const q = searchParams.get('q') || '';

    const rows = await query(
      `SELECT id, customer_code, customer_name, email, phone, billing_city, is_active, created_at FROM customers
       WHERE (customer_name ILIKE $1 OR customer_code ILIKE $1 OR email ILIKE $1)
       AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as count FROM customers 
       WHERE (customer_name ILIKE $1 OR customer_code ILIKE $1 OR email ILIKE $1)
       AND deleted_at IS NULL`,
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
    console.error('GET /api/sales/customers/list error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
