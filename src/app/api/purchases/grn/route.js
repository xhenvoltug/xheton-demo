import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: List all GRNs with pagination, search, and filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    let whereConditions = ['grn.deleted_at IS NULL'];
    let queryParams = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`(grn.grn_number ILIKE $${paramIndex} OR supp.supplier_name ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      whereConditions.push(`grn.status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countRes = await query(
      `SELECT COUNT(*) FROM goods_received_notes grn 
       LEFT JOIN suppliers supp ON grn.supplier_id = supp.id 
       ${whereClause}`,
      queryParams
    );
    const totalCount = parseInt(countRes.rows[0].count);

    const countParams = [...queryParams];
    countParams.push(limit);
    const limitParam = paramIndex++;
    countParams.push(offset);
    const offsetParam = paramIndex++;

    const res = await query(
      `SELECT grn.*, supp.supplier_name, supp.supplier_code, wh.warehouse_name, u.email as received_by_email
       FROM goods_received_notes grn
       LEFT JOIN suppliers supp ON grn.supplier_id = supp.id
       LEFT JOIN warehouses wh ON grn.warehouse_id = wh.id
       LEFT JOIN users u ON grn.received_by = u.id
       ${whereClause}
       ORDER BY grn.grn_date DESC
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      [...queryParams, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: res.rows,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.error('GET GRN list error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch GRNs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { po_id, supplier_id, warehouse_id, grn_date, received_by, delivery_note_number, vehicle_number, driver_name, notes, grn_items } = body;

    if (!supplier_id || !grn_date || !Array.isArray(grn_items) || grn_items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: supplier_id, grn_date, grn_items' },
        { status: 400 }
      );
    }

    // Insert GRN header
    const grnRes = await client.query(
      `INSERT INTO goods_received_notes (purchase_order_id, warehouse_id, grn_number, grn_date, notes, status, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, 'received', $6, NOW()) RETURNING *`,
      [purchase_order_id, warehouse_id, grn_number, grn_date || new Date(), notes || null, null]
    );
    const grnId = grnRes.rows[0].id;

    // Process each item: insert GRN item, create stock movement, update PO
    for (const item of items) {
      const { product_id, quantity_received, batch_number, cost_per_unit } = item;

      if (!product_id || !quantity_received) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json({ success: false, error: 'Each item must have product_id and quantity_received' }, { status: 400 });
      }

      // Insert GRN item
      await client.query(
        `INSERT INTO grn_items (grn_id, product_id, quantity_received, cost_per_unit, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [grnId, product_id, quantity_received, cost_per_unit || 0, null]
      );

      // If batch_number provided, update or create product_batch
      if (batch_number) {
        const batchRes = await client.query(
          `SELECT id FROM product_batches WHERE product_id = $1 AND batch_number = $2 AND deleted_at IS NULL`,
          [product_id, batch_number]
        );
        if (batchRes.rowCount === 0) {
          await client.query(
            `INSERT INTO product_batches (product_id, batch_number, warehouse_id, quantity_received, status, created_by, created_at)
             VALUES ($1, $2, $3, $4, 'active', $5, NOW())`,
            [product_id, batch_number, warehouse_id, quantity_received, user.id || null]
          );
        } else {
          await client.query(
            `UPDATE product_batches SET quantity_received = quantity_received + $1 WHERE id = $2`,
            [quantity_received, batchRes.rows[0].id]
          );
        }
      }

      // Record stock movement (IN from supplier)
      await recordStockMovement(client, {
        movement_number: `GRN-${grnNumber}-${item.product_id}`,
        movement_type: 'IN',
        product_id,
        batch_id: batch_number ? `${product_id}-${batch_number}` : null,
        to_warehouse_id: warehouse_id,
        quantity: quantity_received,
        unit_cost: cost_per_unit || 0,
        reference_type: 'GRN',
        reference_id: grnId,
        notes: `GRN ${grn_number}`,
        created_by: user.id || null
      });

      // Update PO item quantity_received
      await client.query(
        `UPDATE purchase_order_items SET quantity_received = quantity_received + $1 WHERE purchase_order_id = $2 AND product_id = $3`,
        [quantity_received, purchase_order_id, product_id]
      );
    }

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({ success: true, grn: grnRes.rows[0], grn_id: grnId }, { status: 201 });
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (e) {}
      client.release();
    }
    console.error('POST GRN error:', err.message);
    if (err.code === '23505') return NextResponse.json({ success: false, error: 'GRN number already exists' }, { status: 409 });
    return NextResponse.json({ success: false, error: 'Failed to create GRN', message: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
