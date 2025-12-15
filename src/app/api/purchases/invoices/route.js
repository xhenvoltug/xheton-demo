import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const supplierId = searchParams.get('supplier_id');
    const status = searchParams.get('status');

    const offset = (page - 1) * limit;
    let sql = `SELECT si.*, s.supplier_name FROM supplier_invoices si
               LEFT JOIN suppliers s ON si.supplier_id = s.id
               WHERE si.deleted_at IS NULL`;
    const params = [];

    if (supplierId) {
      sql += ` AND si.supplier_id = $${params.length + 1}`;
      params.push(supplierId);
    }

    if (status) {
      sql += ` AND si.status = $${params.length + 1}`;
      params.push(status);
    }

    sql += ` ORDER BY si.invoice_date DESC LIMIT ${limit} OFFSET ${offset}`;

    const res = await query(sql, params);
    const countRes = await query(`SELECT COUNT(*) FROM supplier_invoices WHERE deleted_at IS NULL${supplierId ? ` AND supplier_id = $1` : ''}${status ? ` AND status = $${supplierId ? 2 : 1}` : ''}`, params.slice(0, params.length - 1));

    return NextResponse.json({
      success: true,
      invoices: res.rows,
      total: parseInt(countRes.rows[0].count, 10),
      page,
      limit
    });
  } catch (err) {
    console.error('GET supplier invoices error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch supplier invoices' }, { status: 500 });
  }
}

export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const { supplier_id, grn_id, invoice_number, invoice_date, items, total_amount, tax_amount, notes } = body;

    if (!supplier_id || !invoice_number || !total_amount) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    client = await getClient();
    await client.query('BEGIN');

    // Create supplier invoice
    const invoiceRes = await client.query(
      `INSERT INTO supplier_invoices (supplier_id, grn_id, invoice_number, invoice_date, total_amount, tax_amount, status, notes, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'posted', $7, $8, NOW()) RETURNING *`,
      [supplier_id, grn_id || null, invoice_number, invoice_date || new Date(), total_amount, tax_amount || 0, notes || null, null]
    );
    const invoiceId = invoiceRes.rows[0].id;

    // Insert invoice items
    if (items && Array.isArray(items)) {
      for (const item of items) {
        const { description, quantity, unit_price } = item;
        await client.query(
          `INSERT INTO supplier_invoice_items (supplier_invoice_id, description, quantity, unit_price, line_total, created_by, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [invoiceId, description || null, quantity || 0, unit_price || 0, (quantity || 0) * (unit_price || 0), null]
        );
      }
    }

    // Update supplier balance
    await client.query(
      `UPDATE suppliers SET current_balance = current_balance + $1 WHERE id = $2`,
      [total_amount, supplier_id]
    );

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({ success: true, invoice: invoiceRes.rows[0], invoice_id: invoiceId }, { status: 201 });
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (e) {}
      client.release();
    }
    console.error('POST supplier invoice error:', err.message);
    if (err.code === '23505') return NextResponse.json({ success: false, error: 'Invoice number already exists' }, { status: 409 });
    return NextResponse.json({ success: false, error: 'Failed to create supplier invoice', message: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
