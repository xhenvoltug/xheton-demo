import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';

/**
 * POST /api/purchases/grn-confirm
 * Confirm GRN and increase stock (Inventory += PO items)
 */
export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const { grn_id } = body;

    if (!grn_id) {
      return NextResponse.json(
        { success: false, error: 'grn_id is required' },
        { status: 400 }
      );
    }

    client = await getClient();
    await client.query('BEGIN');

    // Get GRN details
    const grnRes = await client.query(
      `SELECT id, po_id, status FROM goods_received_notes WHERE id = $1`,
      [grn_id]
    );

    if (grnRes.rowCount === 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'GRN not found' }, { status: 404 });
    }

    const grn = grnRes.rows[0];
    
    // Check if already confirmed
    if (grn.status !== 'draft' && grn.status !== 'partial') {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json(
        { success: false, error: `GRN already ${grn.status}. Cannot confirm.` },
        { status: 400 }
      );
    }

    // Get GRN items
    const itemsRes = await client.query(
      `SELECT product_id, quantity_received FROM grn_items WHERE grn_id = $1`,
      [grn_id]
    );

    // Update inventory for each item
    for (const item of itemsRes.rows) {
      // Increase stock
      await client.query(
        `UPDATE products 
         SET current_stock = current_stock + $1, updated_at = NOW()
         WHERE id = $2`,
        [item.quantity_received, item.product_id]
      );

      // Record stock movement (in)
      await client.query(
        `INSERT INTO stock_movements 
         (product_id, quantity, movement_type, reference_id, reference_table, created_by)
         VALUES ($1, $2, 'purchase_grn', $3, 'goods_received_notes', $4)`,
        [item.product_id, item.quantity_received, grn_id, user.id]
      );
    }

    // Update GRN status to completed
    await client.query(
      `UPDATE goods_received_notes 
       SET status = 'completed', updated_at = NOW(), updated_by = $1
       WHERE id = $2`,
      [user.id, grn_id]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: `GRN confirmed. Stock increased for ${itemsRes.rowCount} products.`
    });
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK');
      client.release();
    }
    console.error('POST /api/purchases/grn-confirm error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to confirm GRN', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
