import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('q') || '';
    const status = searchParams.get('status');

    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM customers WHERE deleted_at IS NULL';
    const params = [];

    if (search) {
      sql += ` AND (customer_name ILIKE $${params.length + 1} OR customer_code ILIKE $${params.length + 2})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      sql += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    sql += ` ORDER BY customer_name ASC LIMIT ${limit} OFFSET ${offset}`;

    const res = await query(sql, params);
    const countRes = await query(`SELECT COUNT(*) FROM customers WHERE deleted_at IS NULL${search ? ` AND (customer_name ILIKE $1 OR customer_code ILIKE $2)` : ''}${status ? ` AND status = $${search ? 3 : 1}` : ''}`, params.slice(0, params.length - 1));

    return NextResponse.json({
      success: true,
      customers: res.rows,
      total: parseInt(countRes.rows[0].count, 10),
      page,
      limit
    });
  } catch (err) {
    console.error('GET customers error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_code, customer_name, email, phone, address, city, country, credit_limit } = body;

    if (!customer_code || !customer_name) {
      return NextResponse.json({ success: false, error: 'customer_code and customer_name required' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO customers (customer_code, customer_name, email, phone, address, city, country, credit_limit, current_balance, status, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 'active', $9, NOW()) RETURNING *`,
      [customer_code, customer_name, email || null, phone || null, address || null, city || null, country || null, credit_limit || 0, null]
    );

    return NextResponse.json({ success: true, customer: res.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST customer error:', err.message);
    if (err.code === '23505') return NextResponse.json({ success: false, error: 'Customer code already exists' }, { status: 409 });
    return NextResponse.json({ success: false, error: 'Failed to create customer' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
