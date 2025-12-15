import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GRN (Goods Received Note) API
 * Core principle: GRN is the ONLY entry point for creating stock
 * On approval, creates stock_movement with type 'receipt'
 * Updates product stock by location via movements
 */

// GET: List all GRNs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const supplierId = searchParams.get('supplier_id');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let whereConditions = ['grn.deleted_at IS NULL'];
    const params = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`grn.status = $${paramIndex++}`);
      params.push(status);
    }

    if (supplierId) {
      whereConditions.push(`grn.supplier_id = $${paramIndex++}`);
      params.push(supplierId);
    }

    if (search) {
      whereConditions.push(`(grn.grn_number ILIKE $${paramIndex} OR s.supplier_name ILIKE $${paramIndex} OR w.warehouse_name ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countRes = await query(
      `SELECT COUNT(*) FROM goods_received_notes grn
       LEFT JOIN suppliers s ON grn.supplier_id = s.id
       LEFT JOIN warehouses w ON grn.warehouse_id = w.id
       ${whereClause}`,
      params.slice(0, -1) // Don't include pagination params in count
    );
    const totalCount = parseInt(countRes.rows[0]?.count || 0);

    // Get paginated results
    const res = await query(
      `SELECT grn.*, 
              s.supplier_name, s.supplier_code,
              w.warehouse_name, w.warehouse_code,
              (SELECT COUNT(*) FROM goods_received_note_items WHERE grn_id = grn.id) as item_count,
              (SELECT SUM(quantity_received) FROM goods_received_note_items WHERE grn_id = grn.id) as total_items
       FROM goods_received_notes grn
       LEFT JOIN suppliers s ON grn.supplier_id = s.id
       LEFT JOIN warehouses w ON grn.warehouse_id = w.id
       ${whereClause}
       ORDER BY grn.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: res.rows,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (err) {
    console.error('GET GRNs error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch GRNs' }, { status: 500 });
  }
}

// POST: Create new GRN
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      supplier_id, 
      warehouse_id, 
      po_reference,
      grn_date = new Date(),
      notes,
      items = [] // Array of {product_id, quantity, batch_number, unit_cost}
    } = body;

    if (!supplier_id || !warehouse_id || items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: supplier_id, warehouse_id, items'
      }, { status: 400 });
    }

    // Generate GRN number
    const grnRes = await query(
      `SELECT COUNT(*) FROM goods_received_notes WHERE deleted_at IS NULL`
    );
    const grnNumber = `GRN-${Date.now()}-${grnRes.rows[0].count + 1}`;

    // Create GRN (initially as draft)
    const createRes = await query(
      `INSERT INTO goods_received_notes (
        grn_number, supplier_id, warehouse_id, po_reference, grn_date, notes, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'draft', NOW())
      RETURNING *`,
      [grnNumber, supplier_id, warehouse_id, po_reference || null, grn_date, notes || null]
    );

    const grnId = createRes.rows[0].id;

    // Add items to GRN
    for (const item of items) {
      const { product_id, quantity, batch_number, unit_cost = 0 } = item;

      if (!product_id || !quantity) {
        return NextResponse.json({
          success: false,
          error: 'Each item requires product_id and quantity'
        }, { status: 400 });
      }

      await query(
        `INSERT INTO goods_received_note_items (
          grn_id, product_id, quantity_received, batch_number, unit_cost, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())`,
        [grnId, product_id, quantity, batch_number || null, unit_cost]
      );
    }

    return NextResponse.json({
      success: true,
      data: createRes.rows[0],
      message: 'GRN created successfully in draft status'
    }, { status: 201 });
  } catch (err) {
    console.error('POST GRN error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to create GRN' }, { status: 500 });
  }
}
