import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Stock Transfer API
 * Transfers stock between warehouses/locations
 * Validates source has sufficient stock before creating movement
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromWarehouseId = searchParams.get('from_warehouse_id');
    const toWarehouseId = searchParams.get('to_warehouse_id');
    const productId = searchParams.get('product_id');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    let whereConditions = ["sm.movement_type IN ('transfer_in', 'transfer_out')"];
    const params = [];
    let paramIndex = 1;

    if (fromWarehouseId) {
      whereConditions.push(`sm.from_warehouse_id = $${paramIndex++}`);
      params.push(fromWarehouseId);
    }

    if (toWarehouseId) {
      whereConditions.push(`sm.to_warehouse_id = $${paramIndex++}`);
      params.push(toWarehouseId);
    }

    if (productId) {
      whereConditions.push(`sm.product_id = $${paramIndex++}`);
      params.push(productId);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const res = await query(
      `SELECT sm.*,
              p.product_code, p.product_name,
              wf.warehouse_name as from_warehouse, wt.warehouse_name as to_warehouse
       FROM stock_movements sm
       JOIN products p ON sm.product_id = p.id
       LEFT JOIN warehouses wf ON sm.from_warehouse_id = wf.id
       LEFT JOIN warehouses wt ON sm.to_warehouse_id = wt.id
       ${whereClause}
       ORDER BY sm.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: res.rows,
      pagination: { page, limit, total: res.rows.length }
    });
  } catch (err) {
    console.error('GET transfers error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch transfers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      product_id,
      quantity,
      from_warehouse_id,
      to_warehouse_id,
      from_bin_id,
      to_bin_id,
      created_by_id,
      notes
    } = body;

    if (!product_id || !quantity || !from_warehouse_id || !to_warehouse_id) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: product_id, quantity, from_warehouse_id, to_warehouse_id'
      }, { status: 400 });
    }

    if (quantity <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Quantity must be greater than 0'
      }, { status: 400 });
    }

    // Check source warehouse has sufficient stock
    const stockRes = await query(
      `SELECT COALESCE(SUM(CASE 
        WHEN movement_type IN ('receipt', 'in', 'transfer_in') THEN quantity
        WHEN movement_type IN ('issue', 'out', 'transfer_out') THEN -quantity
        ELSE 0
      END), 0) as current_stock
       FROM stock_movements
       WHERE product_id = $1 AND to_warehouse_id = $2`,
      [product_id, from_warehouse_id]
    );

    const currentStock = parseFloat(stockRes.rows[0]?.current_stock || 0);

    if (currentStock < quantity) {
      return NextResponse.json({
        success: false,
        error: `Insufficient stock. Available: ${currentStock}, Requested: ${quantity}`
      }, { status: 400 });
    }

    // Create OUT movement (from source)
    const outMoveNum = `MOVE-OUT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await query(
      `INSERT INTO stock_movements (
        movement_number, movement_type, product_id,
        from_warehouse_id, quantity, reference_type,
        notes, created_by, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        outMoveNum,
        'transfer_out',
        product_id,
        from_warehouse_id,
        quantity,
        'transfer',
        notes || null,
        created_by_id
      ]
    );

    // Create IN movement (to destination)
    const inMoveNum = `MOVE-IN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const inRes = await query(
      `INSERT INTO stock_movements (
        movement_number, movement_type, product_id,
        to_warehouse_id, quantity, reference_type,
        notes, created_by, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *`,
      [
        inMoveNum,
        'transfer_in',
        product_id,
        to_warehouse_id,
        quantity,
        'transfer',
        notes || null,
        created_by_id
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        transfer_id: inRes.rows[0].id,
        from_movement: outMoveNum,
        to_movement: inMoveNum,
        product_id,
        quantity,
        from_warehouse: from_warehouse_id,
        to_warehouse: to_warehouse_id
      },
      message: 'Stock transferred successfully. Available immediately.'
    });
  } catch (err) {
    console.error('Stock transfer error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to transfer stock' }, { status: 500 });
  }
}
      [product_id, from_warehouse_id]
    );
    const balance = parseInt(balanceRes.rows[0].balance, 10);
    if (balance < quantity) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: `Insufficient stock. Available: ${balance}, Required: ${quantity}` }, { status: 400 });
    }

    // Create transfer record
    const transferRes = await client.query(
      `INSERT INTO inventory_transfers (product_id, from_warehouse_id, to_warehouse_id, from_bin_id, to_bin_id, quantity, transfer_number, transfer_date, transfer_type, status, notes, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10, $11, NOW()) RETURNING *`,
      [product_id, from_warehouse_id, to_warehouse_id, from_bin_id || null, to_bin_id || null, quantity, transfer_number || `TR-${Date.now()}`, transfer_date || new Date(), transfer_type || 'transfer', notes || null, user.id || null]
    );

    // Record OUT movement from source
    await recordStockMovement(client, {
      movement_number: `OUT-${transferRes.rows[0].transfer_number}`,
      movement_type: 'OUT',
      product_id,
      batch_id: batch_id || null,
      from_warehouse_id,
      from_bin_id: from_bin_id || null,
      quantity,
      unit_cost: 0,
      reference_type: 'TRANSFER',
      reference_id: transferRes.rows[0].id,
      notes: `Transfer ${transferRes.rows[0].transfer_number}`,
      created_by: user.id || null
    });

    // Record IN movement to destination
    await recordStockMovement(client, {
      movement_number: `IN-${transferRes.rows[0].transfer_number}`,
      movement_type: 'IN',
      product_id,
      batch_id: batch_id || null,
      to_warehouse_id,
      to_bin_id: to_bin_id || null,
      quantity,
      unit_cost: 0,
      reference_type: 'TRANSFER',
      reference_id: transferRes.rows[0].id,
      notes: `Transfer ${transferRes.rows[0].transfer_number}`,
      created_by: user.id || null
    });

    // Update transfer status
    await client.query(
      `UPDATE inventory_transfers SET status = 'completed' WHERE id = $1`,
      [transferRes.rows[0].id]
    );

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({ success: true, transfer: transferRes.rows[0] }, { status: 201 });
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (e) {}
      client.release();
    }
    console.error('POST transfer error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to create transfer', message: err.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
