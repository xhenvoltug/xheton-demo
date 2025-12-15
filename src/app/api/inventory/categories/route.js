import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('q') || '';

    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM product_categories WHERE deleted_at IS NULL';
    const params = [];

    if (search) {
      sql += ` AND category_name ILIKE $${params.length + 1}`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY category_name ASC LIMIT ${limit} OFFSET ${offset}`;

    const res = await query(sql, params);
    const countRes = await query(`SELECT COUNT(*) FROM product_categories WHERE deleted_at IS NULL${search ? ` AND category_name ILIKE $1` : ''}`, search ? [params[0]] : []);

    return NextResponse.json({
      success: true,
      categories: res.rows,
      total: parseInt(countRes.rows[0].count, 10),
      page,
      limit
    });
  } catch (err) {
    console.error('GET categories error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { category_name, description } = body;

    if (!category_name) return NextResponse.json({ success: false, error: 'category_name required' }, { status: 400 });

    // Generate category_code from category_name (e.g., "Electronics" -> "ELEC-001")
    const baseCode = category_name.substring(0, 4).toUpperCase();
    const timestamp = Date.now().toString().slice(-3); // Last 3 digits of timestamp
    const category_code = `${baseCode}${timestamp}`;

    const res = await query(
      `INSERT INTO product_categories (category_code, category_name, description, is_active, created_by, created_at) VALUES ($1, $2, $3, true, $4, NOW()) RETURNING *`,
      [category_code, category_name, description || null, null]
    );

    return NextResponse.json({ success: true, category: res.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST category error:', err.message);
    if (err.code === '23505') return NextResponse.json({ success: false, error: 'Category name already exists' }, { status: 409 });
    return NextResponse.json({ success: false, error: err.message || 'Failed to create category' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
