import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Stock Movements Ledger - READ ONLY
 * Shows all IN, OUT, TRANSFER movements
 * Source location, Destination location, Timestamp
 * Cannot be edited or deleted - audit trail
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;
    const offset = (page - 1) * limit;
    
    const productId = searchParams.get('product_id');
    const warehouseId = searchParams.get('warehouse_id');
    const movementType = searchParams.get('movement_type'); // receipt, issue, transfer, etc.
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');
    const search = searchParams.get('search') || '';

    let whereConditions = ['sm.deleted_at IS NULL'];
    const params = [];
    let paramCount = 1;

    if (productId) {
      whereConditions.push(`sm.product_id = $${paramCount++}`);
      params.push(productId);
    }

    if (warehouseId) {
      whereConditions.push(`(sm.from_warehouse_id = $${paramCount} OR sm.to_warehouse_id = $${paramCount})`);
      params.push(warehouseId);
      paramCount++;
    }

    if (movementType) {
      whereConditions.push(`sm.movement_type = $${paramCount++}`);
      params.push(movementType);
    }

    if (fromDate) {
      whereConditions.push(`sm.movement_date >= $${paramCount++}`);
      params.push(fromDate);
    }

    if (toDate) {
      whereConditions.push(`sm.movement_date <= $${paramCount++}`);
      params.push(toDate);
    }

    if (search) {
      whereConditions.push(`(sm.movement_number ILIKE $${paramCount} OR p.product_name ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countRes = await query(
      `SELECT COUNT(*) as count FROM stock_movements sm 
       JOIN products p ON sm.product_id = p.id
       ${whereClause}`,
      params.slice(0, paramCount - 1)
    );
    const total = parseInt(countRes.rows[0]?.count || 0);

    // Get paginated data
    const res = await query(
      `SELECT sm.*, 
              p.product_code, p.product_name,
              wf.warehouse_name as from_warehouse_name, wf.warehouse_code as from_warehouse_code,
              wt.warehouse_name as to_warehouse_name, wt.warehouse_code as to_warehouse_code,
              bf.bin_code as from_bin_code, bt.bin_code as to_bin_code
       FROM stock_movements sm
       JOIN products p ON sm.product_id = p.id
       LEFT JOIN warehouses wf ON sm.from_warehouse_id = wf.id
       LEFT JOIN warehouses wt ON sm.to_warehouse_id = wt.id
       LEFT JOIN bins bf ON sm.from_bin_id = bf.id
       LEFT JOIN bins bt ON sm.to_bin_id = bt.id
       ${whereClause}
       ORDER BY sm.movement_date DESC, sm.created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: res.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      message: 'Stock movements are read-only for audit trail integrity'
    });
  } catch (err) {
    console.error('GET stock movements error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock movements' },
      { status: 500 }
    );
  }
}

/**
 * POST/PUT/DELETE are intentionally NOT implemented
 * Stock movements are created ONLY via:
 * - GRN approval (creates receipt movement)
 * - Sales (creates issue movement)
 * - Internal transfer (creates transfer movements)
 */
export async function POST(request) {
  return NextResponse.json(
    { success: false, error: 'Manual stock movement creation not allowed. Use GRN, Sales, or Transfer APIs.' },
    { status: 403 }
  );
}

export async function PUT(request) {
  return NextResponse.json(
    { success: false, error: 'Stock movements cannot be edited. This is an audit trail.' },
    { status: 403 }
  );
}

export async function DELETE(request) {
  return NextResponse.json(
    { success: false, error: 'Stock movements cannot be deleted. This is an audit trail.' },
    { status: 403 }
  );
}
