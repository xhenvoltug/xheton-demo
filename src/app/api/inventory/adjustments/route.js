import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';
import { recordStockMovement } from '@/lib/inventory';

export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const { product_id, warehouse_id, quantity_change, adjustment_reason, adjustment_number, reference_notes } = body;

    if (!product_id || !warehouse_id || quantity_change === undefined || quantity_change === null) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    client = await getClient();
    await client.query('BEGIN');

    // If reducing stock, verify sufficient balance exists
    if (quantity_change < 0) {
      const balanceRes = await client.query(
        `SELECT COALESCE(SUM(CASE WHEN movement_type = 'IN' THEN quantity ELSE -quantity END), 0) as balance
         FROM stock_movements WHERE product_id = $1 AND to_warehouse_id = $2`,
        [product_id, warehouse_id]
      );
      const balance = parseInt(balanceRes.rows[0].balance, 10);
      if (balance < Math.abs(quantity_change)) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json({ success: false, error: `Insufficient stock. Available: ${balance}, Required: ${Math.abs(quantity_change)}` }, { status: 400 });
      }
    }

    // Create adjustment record
    const adjustRes = await client.query(
      `INSERT INTO inventory_adjustments (product_id, warehouse_id, quantity_change, adjustment_reason, adjustment_number, reference_notes, status, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'approved', $7, NOW()) RETURNING *`,
      [product_id, warehouse_id, quantity_change, adjustment_reason || null, adjustment_number || `ADJ-${Date.now()}`, reference_notes || null, null]
    );

    // Record stock movement
    const movementType = quantity_change > 0 ? 'IN' : 'OUT';
    await recordStockMovement(client, {
      movement_number: adjustRes.rows[0].adjustment_number,
      movement_type: movementType,
      product_id,
      to_warehouse_id: movementType === 'IN' ? warehouse_id : null,
      from_warehouse_id: movementType === 'OUT' ? warehouse_id : null,
      quantity: Math.abs(quantity_change),
      unit_cost: 0,
      reference_type: 'ADJUSTMENT',
      reference_id: adjustRes.rows[0].id,
      notes: `Adjustment: ${adjustment_reason}`,
      created_by: null
    });

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({ success: true, adjustment: adjustRes.rows[0] }, { status: 201 });
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (e) {}
      client.release();
    }
    console.error('POST adjustment error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to create adjustment', message: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
