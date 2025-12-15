import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const res = await query(
      'SELECT * FROM suppliers WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, supplier: res.rows[0] });
  } catch (err) {
    console.error('GET supplier error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch supplier' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { supplier_name, email, phone, mobile, address, city, state_province, country, postal_code, payment_terms, credit_limit, category, is_active } = body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (supplier_name !== undefined) {
      updates.push(`supplier_name = $${paramIndex++}`);
      values.push(supplier_name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(phone);
    }
    if (mobile !== undefined) {
      updates.push(`mobile = $${paramIndex++}`);
      values.push(mobile);
    }
    if (address !== undefined) {
      updates.push(`address = $${paramIndex++}`);
      values.push(address);
    }
    if (city !== undefined) {
      updates.push(`city = $${paramIndex++}`);
      values.push(city);
    }
    if (state_province !== undefined) {
      updates.push(`state_province = $${paramIndex++}`);
      values.push(state_province);
    }
    if (country !== undefined) {
      updates.push(`country = $${paramIndex++}`);
      values.push(country);
    }
    if (postal_code !== undefined) {
      updates.push(`postal_code = $${paramIndex++}`);
      values.push(postal_code);
    }
    if (payment_terms !== undefined) {
      updates.push(`payment_terms = $${paramIndex++}`);
      values.push(payment_terms);
    }
    if (credit_limit !== undefined) {
      updates.push(`credit_limit = $${paramIndex++}`);
      values.push(credit_limit);
    }
    if (category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(category);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(is_active);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const res = await query(
      `UPDATE suppliers SET ${updates.join(', ')} WHERE id = $${paramIndex} AND deleted_at IS NULL RETURNING *`,
      values
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, supplier: res.rows[0] });
  } catch (err) {
    console.error('PUT supplier error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to update supplier' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if supplier has linked purchase orders or invoices
    const linkedCheck = await query(
      `SELECT COUNT(*) as count FROM purchase_orders 
       WHERE supplier_id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (parseInt(linkedCheck.rows[0].count, 10) > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete supplier with linked purchase orders' },
        { status: 409 }
      );
    }

    const res = await query(
      `UPDATE suppliers SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *`,
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Supplier deleted successfully' });
  } catch (err) {
    console.error('DELETE supplier error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to delete supplier' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
