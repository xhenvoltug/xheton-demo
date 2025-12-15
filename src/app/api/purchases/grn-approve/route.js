import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GRN Approval Endpoint
 * When approved: 
 * 1. Creates stock_movement entries for each item (type: 'receipt')
 * 2. Updates GRN status to 'approved'
 * 3. Stock becomes available immediately
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { grn_id, approved_by_id, notes } = body;

    if (!grn_id || !approved_by_id) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: grn_id, approved_by_id'
      }, { status: 400 });
    }

    // Get GRN details
    const grnRes = await query(
      `SELECT * FROM goods_received_notes WHERE id = $1 AND deleted_at IS NULL`,
      [grn_id]
    );

    if (grnRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'GRN not found' }, { status: 404 });
    }

    const grn = grnRes.rows[0];

    if (grn.status !== 'draft') {
      return NextResponse.json({
        success: false,
        error: `Cannot approve GRN with status: ${grn.status}`
      }, { status: 400 });
    }

    // Get GRN items
    const itemsRes = await query(
      `SELECT * FROM goods_received_note_items WHERE grn_id = $1`,
      [grn_id]
    );

    const items = itemsRes.rows;

    if (items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'GRN has no items to approve'
      }, { status: 400 });
    }

    // Create stock movements for each item
    for (const item of items) {
      const movementNum = `MOVE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await query(
        `INSERT INTO stock_movements (
          movement_number, movement_type, product_id, batch_id,
          from_warehouse_id, to_warehouse_id, quantity, unit_cost,
          reference_type, reference_id, movement_date, notes, created_by, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())`,
        [
          movementNum,           // movement_number
          'receipt',              // movement_type - IN
          item.product_id,        // product_id
          null,                   // batch_id (can be linked to batch if needed)
          null,                   // from_warehouse_id (NULL for receipt)
          grn.warehouse_id,       // to_warehouse_id (destination)
          item.quantity_received, // quantity
          item.unit_cost,         // unit_cost
          'grn',                  // reference_type
          grn_id,                 // reference_id
          grn.grn_date,           // movement_date
          notes || null,          // notes
          approved_by_id          // created_by
        ]
      );
    }

    // Update GRN status to approved
    const updateRes = await query(
      `UPDATE goods_received_notes 
       SET status = 'approved', approved_at = NOW(), approved_by = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [approved_by_id, grn_id]
    );

    return NextResponse.json({
      success: true,
      data: updateRes.rows[0],
      message: `GRN approved. ${items.length} stock movement(s) created. Stock is now available.`
    });
  } catch (err) {
    console.error('GRN approval error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to approve GRN' }, { status: 500 });
  }
}
