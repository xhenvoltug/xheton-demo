import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const offset = (page - 1) * limit;

    // Get opening stock GRNs
    const result = await query(
      `SELECT 
        g.id, g.grn_number, g.supplier_id, s.name as supplier_name,
        g.warehouse_id, w.name as warehouse_name,
        g.status, g.grn_date, g.notes,
        COUNT(gi.id) as item_count, SUM(gi.quantity_received) as total_items
      FROM goods_received_notes g
      LEFT JOIN suppliers s ON g.supplier_id = s.id
      LEFT JOIN warehouses w ON g.warehouse_id = w.id
      LEFT JOIN goods_received_note_items gi ON g.id = gi.grn_id
      WHERE g.type = 'opening_stock' AND g.deleted_at IS NULL
      GROUP BY g.id, g.grn_number, g.supplier_id, s.name, g.warehouse_id, w.name, g.status, g.grn_date, g.notes
      ORDER BY g.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(DISTINCT g.id) as total
      FROM goods_received_notes g
      WHERE g.type = 'opening_stock' AND g.deleted_at IS NULL`
    );

    const total = countResult.rows[0]?.total || 0;
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: { page, limit, total, pages }
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      warehouse_id,
      items, // Array of { product_id, quantity, batch_number, unit_cost, expiry_date }
      notes,
      created_by_id
    } = body;

    // Validate
    if (!warehouse_id) {
      return NextResponse.json(
        { success: false, error: 'Warehouse is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one item is required' },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of items) {
      if (!item.product_id) {
        return NextResponse.json(
          { success: false, error: 'Product ID is required for all items' },
          { status: 400 }
        );
      }
      if (item.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: 'Quantity must be greater than 0' },
          { status: 400 }
        );
      }

      // Check for duplicate opening stock
      const checkResult = await query(
        `SELECT COUNT(*) as count FROM goods_received_notes g
        JOIN goods_received_note_items gi ON g.id = gi.grn_id
        WHERE g.type = 'opening_stock' 
        AND g.warehouse_id = $1 
        AND gi.product_id = $2 
        AND g.status = 'approved'
        AND g.deleted_at IS NULL`,
        [warehouse_id, item.product_id]
      );

      if (checkResult.rows[0]?.count > 0) {
        const productResult = await query(
          `SELECT code FROM products WHERE id = $1`,
          [item.product_id]
        );
        const productCode = productResult.rows[0]?.code || item.product_id;
        return NextResponse.json(
          { success: false, error: `Opening stock already exists for product ${productCode} in this warehouse` },
          { status: 409 }
        );
      }
    }

    // Get opening stock supplier (create if not exists)
    let supplierResult = await query(
      `SELECT id FROM suppliers WHERE name = 'Opening Stock' LIMIT 1`
    );

    let supplier_id = supplierResult.rows[0]?.id;

    if (!supplier_id) {
      const createSupplier = await query(
        `INSERT INTO suppliers (name, email, phone, address, city, created_at)
        VALUES ('Opening Stock', 'internal@xheton.local', '', 'Internal', 'Internal', NOW())
        RETURNING id`,
        []
      );
      supplier_id = createSupplier.rows[0].id;
    }

    // Generate GRN number
    const grnCountResult = await query(
      `SELECT COUNT(*) as count FROM goods_received_notes WHERE type = 'opening_stock'`
    );
    const grnCount = grnCountResult.rows[0]?.count || 0;
    const grn_number = `OPEN-${new Date().getTime()}-${grnCount + 1}`;

    // Create GRN
    const grnResult = await query(
      `INSERT INTO goods_received_notes (
        grn_number, supplier_id, warehouse_id, type, status, 
        grn_date, notes, created_by, created_at
      ) VALUES ($1, $2, $3, 'opening_stock', 'draft', NOW(), $4, $5, NOW())
      RETURNING id`,
      [grn_number, supplier_id, warehouse_id, notes || '', created_by_id || 'system']
    );

    const grn_id = grnResult.rows[0].id;

    // Add items to GRN
    for (const item of items) {
      await query(
        `INSERT INTO goods_received_note_items (
          grn_id, product_id, quantity_received, batch_number, 
          unit_cost, expiry_date, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [
          grn_id,
          item.product_id,
          item.quantity,
          item.batch_number || null,
          item.unit_cost || 0,
          item.expiry_date || null
        ]
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: grn_id,
        grn_number,
        status: 'draft',
        item_count: items.length,
        message: 'Opening stock GRN created. Click Approve to finalize.'
      }
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// Bulk import endpoint
export async function PUT(request) {
  try {
    const body = await request.json();
    const { items, created_by_id } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items array is required' },
        { status: 400 }
      );
    }

    const results = [];

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      const result = { row: idx + 1, success: false, message: '' };

      try {
        // Validate required fields
        if (!item.product_id || !item.warehouse_id || !item.quantity) {
          result.message = 'Missing product_id, warehouse_id, or quantity';
          results.push(result);
          continue;
        }

        if (item.quantity <= 0) {
          result.message = 'Quantity must be > 0';
          results.push(result);
          continue;
        }

        // Check for duplicate
        const checkResult = await query(
          `SELECT COUNT(*) as count FROM goods_received_notes g
          JOIN goods_received_note_items gi ON g.id = gi.grn_id
          WHERE g.type = 'opening_stock' 
          AND g.warehouse_id = $1 
          AND gi.product_id = $2 
          AND g.status = 'approved'
          AND g.deleted_at IS NULL`,
          [item.warehouse_id, item.product_id]
        );

        if (checkResult.rows[0]?.count > 0) {
          result.message = 'Opening stock already exists for this product/warehouse';
          results.push(result);
          continue;
        }

        // Get supplier
        let supplierResult = await query(
          `SELECT id FROM suppliers WHERE name = 'Opening Stock' LIMIT 1`
        );
        let supplier_id = supplierResult.rows[0]?.id;
        if (!supplier_id) {
          const createSupplier = await query(
            `INSERT INTO suppliers (name, email, phone, address, city, created_at)
            VALUES ('Opening Stock', 'internal@xheton.local', '', 'Internal', 'Internal', NOW())
            RETURNING id`
          );
          supplier_id = createSupplier.rows[0].id;
        }

        // Generate GRN
        const grnCountResult = await query(
          `SELECT COUNT(*) as count FROM goods_received_notes WHERE type = 'opening_stock'`
        );
        const grnCount = grnCountResult.rows[0]?.count || 0;
        const grn_number = `OPEN-${new Date().getTime()}-${grnCount + idx + 1}`;

        // Create GRN
        const grnResult = await query(
          `INSERT INTO goods_received_notes (
            grn_number, supplier_id, warehouse_id, type, status,
            grn_date, notes, created_by, created_at
          ) VALUES ($1, $2, $3, 'opening_stock', 'draft', NOW(), $4, $5, NOW())
          RETURNING id`,
          [grn_number, supplier_id, item.warehouse_id, item.notes || '', created_by_id || 'system']
        );

        const grn_id = grnResult.rows[0].id;

        // Add item
        await query(
          `INSERT INTO goods_received_note_items (
            grn_id, product_id, quantity_received, batch_number,
            unit_cost, expiry_date, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [
            grn_id,
            item.product_id,
            item.quantity,
            item.batch_number || null,
            item.unit_cost || 0,
            item.expiry_date || null
          ]
        );

        result.success = true;
        result.message = `GRN ${grn_number} created (draft)`;
        result.grn_id = grn_id;
      } catch (err) {
        result.message = err.message;
      }

      results.push(result);
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      data: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
        results
      }
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
