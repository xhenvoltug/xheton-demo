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
    let whereClauses = ['po.deleted_at IS NULL'];
    const params = [];

    if (search) {
      whereClauses.push(`(po.po_number ILIKE $${params.length + 1} OR s.supplier_name ILIKE $${params.length + 2})`);
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status && status !== 'all') {
      whereClauses.push(`po.status = $${params.length + 1}`);
      params.push(status);
    }

    const whereClause = whereClauses.join(' AND ');

    const sql = `SELECT po.id, po.po_number, po.po_date, po.supplier_id, s.supplier_name,
                        po.status, po.total_amount, po.expected_delivery_date,
                        (SELECT COUNT(*) FROM purchase_order_items WHERE po_id = po.id) as item_count
                 FROM purchase_orders po
                 JOIN suppliers s ON po.supplier_id = s.id
                 WHERE ${whereClause}
                 ORDER BY po.po_date DESC
                 LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    params.push(limit, offset);
    const res = await query(sql, params);

    const countSql = `SELECT COUNT(*) as count FROM purchase_orders po
                      JOIN suppliers s ON po.supplier_id = s.id
                      WHERE ${whereClause}`;
    const countRes = await query(countSql, params.slice(0, params.length - 2));

    return NextResponse.json({
      success: true,
      data: res.rows,
      total: parseInt(countRes.rows[0].count),
      page,
      limit
    });
  } catch (err) {
    console.error('GET purchase orders error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch purchase orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { supplier_id, po_date, warehouse_id, expected_delivery_date, notes, items } = body;

    if (!supplier_id || !po_date || !items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'supplier_id, po_date, and items array required' }, { status: 400 });
    }

    // Generate PO number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const countRes = await query(
      `SELECT COUNT(*) as count FROM purchase_orders WHERE po_date >= CURRENT_DATE - INTERVAL '30 days'`
    );
    const poNumber = `PO-${dateStr}-${String(parseInt(countRes.rows[0].count) + 1).padStart(4, '0')}`;

    let totalAmount = 0;
    let subtotal = 0;
    let taxAmount = 0;
    
    items.forEach(item => {
      const lineTotal = (item.quantity * item.unit_price);
      const discounted = lineTotal - (item.discount_amount || 0);
      const withTax = discounted + (item.tax_amount || 0);
      subtotal += lineTotal;
      taxAmount += (item.tax_amount || 0);
      totalAmount += withTax;
    });

    // Insert PO
    const poRes = await query(
      `INSERT INTO purchase_orders 
       (po_number, po_date, supplier_id, warehouse_id, expected_delivery_date, notes, subtotal, tax_amount, total_amount, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft', NOW(), NOW())
       RETURNING *`,
      [poNumber, po_date, supplier_id, warehouse_id || null, expected_delivery_date || null, notes || null, subtotal, taxAmount, totalAmount]
    );

    const poId = poRes.rows[0].id;

    // Insert PO items
    for (const item of items) {
      const lineTotal = (item.quantity * item.unit_price) - (item.discount_amount || 0) + (item.tax_amount || 0);
      await query(
        `INSERT INTO purchase_order_items 
         (po_id, product_id, quantity, unit_price, discount_amount, tax_rate, tax_amount, line_total, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [poId, item.product_id, item.quantity, item.unit_price, item.discount_amount || 0, item.tax_rate || 0, item.tax_amount || 0, lineTotal]
      );
    }

    return NextResponse.json({ success: true, purchase_order: poRes.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST purchase order error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to create purchase order' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

