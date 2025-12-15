import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const res = await query(
      `SELECT po.*, s.supplier_name FROM purchase_orders po
       JOIN suppliers s ON po.supplier_id = s.id
       WHERE po.id = $1 AND po.deleted_at IS NULL`,
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Purchase order not found' }, { status: 404 });
    }

    const poId = res.rows[0].id;
    const itemsRes = await query(
      `SELECT poi.id, poi.product_id, poi.quantity, poi.quantity_received, poi.unit_price, 
              poi.discount_amount, poi.tax_rate, poi.tax_amount, poi.line_total,
              p.product_code, p.product_name
       FROM purchase_order_items poi
       JOIN products p ON poi.product_id = p.id
       WHERE poi.po_id = $1`,
      [poId]
    );

    return NextResponse.json({ 
      success: true, 
      purchase_order: { ...res.rows[0], items: itemsRes.rows } 
    });
  } catch (err) {
    console.error('GET PO error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch purchase order' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, notes, expected_delivery_date } = body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(notes);
    }
    if (expected_delivery_date !== undefined) {
      updates.push(`expected_delivery_date = $${paramIndex++}`);
      values.push(expected_delivery_date);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const res = await query(
      `UPDATE purchase_orders SET ${updates.join(', ')} WHERE id = $${paramIndex} AND deleted_at IS NULL RETURNING *`,
      values
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Purchase order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, purchase_order: res.rows[0] });
  } catch (err) {
    console.error('PUT PO error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to update purchase order' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if PO has linked GRN
    const linkedCheck = await query(
      `SELECT COUNT(*) as count FROM goods_received_notes WHERE po_id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (parseInt(linkedCheck.rows[0].count, 10) > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete purchase order with linked GRN' },
        { status: 409 }
      );
    }

    const res = await query(
      `UPDATE purchase_orders SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *`,
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Purchase order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Purchase order deleted successfully' });
  } catch (err) {
    console.error('DELETE PO error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to delete purchase order' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
