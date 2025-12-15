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
    let sql = 'SELECT * FROM suppliers WHERE deleted_at IS NULL';
    const params = [];

    if (search) {
      sql += ` AND (supplier_name ILIKE $${params.length + 1} OR supplier_code ILIKE $${params.length + 2})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      sql += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    sql += ` ORDER BY supplier_name ASC LIMIT ${limit} OFFSET ${offset}`;

    const res = await query(sql, params);
    const countRes = await query(`SELECT COUNT(*) FROM suppliers WHERE deleted_at IS NULL${search ? ` AND (supplier_name ILIKE $1 OR supplier_code ILIKE $2)` : ''}${status ? ` AND status = $${search ? 3 : 1}` : ''}`, params.slice(0, params.length - 1));

    return NextResponse.json({
      success: true,
      suppliers: res.rows,
      total: parseInt(countRes.rows[0].count, 10),
      page,
      limit
    });
  } catch (err) {
    console.error('GET suppliers error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      supplier_code, supplier_name, company_name, email, phone, mobile, 
      website, address, city, state_province, country, postal_code,
      tax_id, payment_terms, credit_limit, category 
    } = body;

    if (!supplier_code || !supplier_name) {
      return NextResponse.json({ success: false, error: 'supplier_code and supplier_name required' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO suppliers 
       (supplier_code, supplier_name, company_name, email, phone, mobile, website,
        address, city, state_province, country, postal_code, tax_id,
        payment_terms, credit_limit, category, is_active, current_balance, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, true, 0, NOW(), NOW())
       RETURNING *`,
      [
        supplier_code, supplier_name, company_name || null, email || null, phone || null, mobile || null,
        website || null, address || null, city || null, state_province || null, country || 'Uganda',
        postal_code || null, tax_id || null, payment_terms || 30, credit_limit || 0, category || null
      ]
    );

    return NextResponse.json({ success: true, supplier: res.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST supplier error:', err.message);
    if (err.code === '23505') return NextResponse.json({ success: false, error: 'Supplier code already exists' }, { status: 409 });
    return NextResponse.json({ success: false, error: 'Failed to create supplier' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
