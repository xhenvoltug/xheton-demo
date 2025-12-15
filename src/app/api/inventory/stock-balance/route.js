import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Get product stock by location
 * Returns real stock calculated from stock_movements
 * Never manually edited - always derived from movements
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const warehouseId = searchParams.get('warehouse_id');
    const locationId = searchParams.get('location_id');

    let whereConditions = ['sm.deleted_at IS NULL'];
    const params = [];
    let paramIndex = 1;

    if (productId) {
      whereConditions.push(`sm.product_id = $${paramIndex++}`);
      params.push(productId);
    }

    if (warehouseId) {
      whereConditions.push(`sm.to_warehouse_id = $${paramIndex++}`);
      params.push(warehouseId);
    }

    if (locationId) {
      whereConditions.push(`sm.to_bin_id = $${paramIndex++}`);
      params.push(locationId);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Calculate stock using stock movements
    const res = await query(
      `SELECT 
        sm.product_id,
        p.product_code,
        p.product_name,
        sm.to_warehouse_id as warehouse_id,
        w.warehouse_name,
        SUM(CASE 
          WHEN sm.movement_type IN ('receipt', 'in', 'transfer_in') THEN sm.quantity
          WHEN sm.movement_type IN ('issue', 'out', 'transfer_out') THEN -sm.quantity
          ELSE 0
        END) as current_stock
       FROM stock_movements sm
       JOIN products p ON sm.product_id = p.id
       LEFT JOIN warehouses w ON sm.to_warehouse_id = w.id
       ${whereClause}
       GROUP BY sm.product_id, p.product_code, p.product_name, sm.to_warehouse_id, w.warehouse_name
       ORDER BY p.product_name, w.warehouse_name`,
      params
    );

    return NextResponse.json({
      success: true,
      data: res.rows
    });
  } catch (err) {
    console.error('GET stock balance error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch stock balance' }, { status: 500 });
  }
}
