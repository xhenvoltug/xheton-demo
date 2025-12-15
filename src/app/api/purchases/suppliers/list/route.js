import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;
    let whereClauses = ['deleted_at IS NULL'];
    const params = [];

    if (search) {
      whereClauses.push(`(supplier_name ILIKE $${params.length + 1} OR supplier_code ILIKE $${params.length + 2} OR email ILIKE $${params.length + 3})`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status && status !== 'all') {
      whereClauses.push(`is_active = $${params.length + 1}`);
      params.push(status === 'active');
    }

    const whereClause = whereClauses.join(' AND ');

    // Fetch suppliers
    const sql = `SELECT id, supplier_code, supplier_name, email, phone, city, payment_terms, credit_limit, current_balance, category, is_active, created_at
                 FROM suppliers 
                 WHERE ${whereClause}
                 ORDER BY supplier_name ASC
                 LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    
    params.push(limit, offset);
    const rows = await query(sql, params);

    // Fetch total count
    const countSql = `SELECT COUNT(*) as count FROM suppliers WHERE ${whereClause}`;
    const countResult = await query(countSql, params.slice(0, params.length - 2));

    return NextResponse.json({
      success: true,
      data: rows.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset
    });
  } catch (err) {
    console.error('GET /api/purchases/suppliers/list error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suppliers', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
