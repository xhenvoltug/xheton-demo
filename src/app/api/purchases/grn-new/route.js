import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';

/**
 * GRN CRITICAL MODULE - MOST IMPORTANT
 * This endpoint creates GRNs and MUST:
 * 1. Create GRN header
 * 2. Auto-create inventory batches for each item
 * 3. Increment product stock
 * 4. Create stock movement IN records
 * All in a single transaction for data consistency
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;
    let whereClauses = ['grn.deleted_at IS NULL'];
    const params = [];

    if (search) {
      whereClauses.push(`(grn.grn_number ILIKE $${params.length + 1} OR s.supplier_name ILIKE $${params.length + 2})`);
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status && status !== 'all') {
      whereClauses.push(`grn.status = $${params.length + 1}`);
      params.push(status);
    }

    const whereClause = whereClauses.join(' AND ');

    const sql = `SELECT grn.id, grn.grn_number, grn.grn_date, grn.supplier_id, s.supplier_name,
                        grn.po_id, grn.status, grn.warehouse_id,
                        (SELECT COUNT(*) FROM grn_items WHERE grn_id = grn.id) as item_count
                 FROM goods_received_notes grn
                 JOIN suppliers s ON grn.supplier_id = s.id
                 WHERE ${whereClause}
                 ORDER BY grn.grn_date DESC
                 LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    params.push(limit, offset);
    const res = await query(sql, params);

    const countSql = `SELECT COUNT(*) as count FROM goods_received_notes grn
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
    console.error('GET GRN error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch GRN' }, { status: 500 });
  }
}

export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const { po_id, supplier_id, warehouse_id, received_by, items, notes } = body;

    if (!supplier_id || !warehouse_id || !items || items.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'supplier_id, warehouse_id, and items array required' 
      }, { status: 400 });
    }

    client = await getClient();
    await client.query('BEGIN');

    try {
      // Generate GRN number
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const countRes = await client.query(
        `SELECT COUNT(*) as count FROM goods_received_notes WHERE grn_date = CURRENT_DATE`
      );
      const grnNumber = `GRN-${dateStr}-${String(parseInt(countRes.rows[0].rows[0].count) + 1).padStart(4, '0')}`;

      // Insert GRN header
      const grnRes = await client.query(
        `INSERT INTO goods_received_notes 
         (grn_number, grn_date, po_id, supplier_id, warehouse_id, received_by, status, notes, created_at, updated_at)
         VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, 'draft', $6, NOW(), NOW())
         RETURNING *`,
        [grnNumber, po_id || null, supplier_id, warehouse_id, received_by || null, notes || null]
      );

      const grnId = grnRes.rows[0].id;
      let totalQuantity = 0;

      // Process each item
      for (const item of items) {
        const { product_id, quantity_received, unit_cost, batch_number, manufacture_date, expiry_date, po_item_id } = item;

        if (!product_id || !quantity_received) {
          throw new Error('Each item requires product_id and quantity_received');
        }

        // 1. Insert GRN item
        await client.query(
          `INSERT INTO grn_items 
           (grn_id, po_item_id, product_id, quantity_received, quantity_accepted, unit_cost, batch_number, manufacture_date, expiry_date, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
          [grnId, po_item_id || null, product_id, quantity_received, quantity_received, unit_cost || 0, batch_number || null, manufacture_date || null, expiry_date || null]
        );

        // 2. Create product batch
        const batchRes = await client.query(
          `INSERT INTO product_batches 
           (product_id, warehouse_id, batch_number, quantity, unit_cost, manufacture_date, expiry_date, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', NOW(), NOW())
           ON CONFLICT DO NOTHING
           RETURNING *`,
          [product_id, warehouse_id, batch_number || `${product_id}-${Date.now()}`, quantity_received, unit_cost || 0, manufacture_date || null, expiry_date || null]
        );

        // 3. Update product current_stock (INCREMENT)
        await client.query(
          `UPDATE products SET current_stock = current_stock + $1, updated_at = NOW() WHERE id = $2`,
          [quantity_received, product_id]
        );

        // 4. Create stock movement record (IN from GRN)
        const batchId = batchRes.rows.length > 0 ? batchRes.rows[0].id : null;
        await client.query(
          `INSERT INTO stock_movements 
           (product_id, warehouse_id, batch_id, movement_type, quantity, reference_type, reference_id, notes, created_at)
           VALUES ($1, $2, $3, 'IN', $4, 'GRN', $5, $6, NOW())`,
          [product_id, warehouse_id, batchId, quantity_received, grnId, `GRN ${grnNumber} - ${quantity_received} units`]
        );

        totalQuantity += quantity_received;
      }

      await client.query('COMMIT');
      client.release();

      return NextResponse.json({ 
        success: true, 
        grn: grnRes.rows[0],
        message: `GRN created with ${items.length} items totaling ${totalQuantity} units`
      }, { status: 201 });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (e) {}
      client.release();
    }
    console.error('POST GRN error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to create GRN', details: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
