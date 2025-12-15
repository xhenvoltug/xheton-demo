import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { grn_id, approved_by_id } = body;

    if (!grn_id) {
      return NextResponse.json(
        { success: false, error: 'GRN ID is required' },
        { status: 400 }
      );
    }

    // Check if GRN exists and is opening stock
    const grnResult = await query(
      `SELECT * FROM goods_received_notes 
      WHERE id = $1 AND type = 'opening_stock' AND deleted_at IS NULL`,
      [grn_id]
    );

    if (grnResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Opening stock GRN not found' },
        { status: 404 }
      );
    }

    const grn = grnResult.rows[0];

    // Check if already approved
    if (grn.status === 'approved') {
      return NextResponse.json(
        { success: false, error: 'This opening stock is already approved' },
        { status: 409 }
      );
    }

    // Get items
    const itemsResult = await query(
      `SELECT * FROM goods_received_note_items WHERE grn_id = $1`,
      [grn_id]
    );

    if (itemsResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'GRN has no items to approve' },
        { status: 400 }
      );
    }

    const items = itemsResult.rows;
    const movements = [];

    // Create stock movements for each item
    for (const item of items) {
      // Generate movement number
      const movementCountResult = await query(
        `SELECT COUNT(*) as count FROM stock_movements 
        WHERE movement_type IN ('receipt', 'in')`
      );
      const movementCount = movementCountResult.rows[0]?.count || 0;
      const movement_number = `MOVE-OPEN-${new Date().getTime()}-${movementCount + 1}`;

      // Create movement
      const movementResult = await query(
        `INSERT INTO stock_movements (
          movement_number, movement_type, product_id,
          from_warehouse_id, to_warehouse_id, quantity, batch_id,
          reference_type, reference_id, created_by, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        RETURNING id, movement_number`,
        [
          movement_number,
          'receipt', // Opening stock is a receipt (IN)
          item.product_id,
          null, // External source
          grn.warehouse_id, // To warehouse
          item.quantity_received,
          item.batch_number || null,
          'opening_stock',
          grn_id,
          approved_by_id || 'system'
        ]
      );

      movements.push(movementResult.rows[0]);
    }

    // Update GRN status
    await query(
      `UPDATE goods_received_notes 
      SET status = 'approved', approved_at = NOW(), approved_by = $1
      WHERE id = $2`,
      [approved_by_id || 'system', grn_id]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: grn_id,
        grn_number: grn.grn_number,
        status: 'approved',
        movements_created: movements.length,
        message: `Opening stock approved! ${movements.length} stock movements created.`
      }
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
