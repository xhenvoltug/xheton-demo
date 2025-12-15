import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';

// GET list, POST create
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const q = searchParams.get('q') || '';

    const rows = await query(
      `SELECT id, product_code, product_name, barcode, category_id, selling_price, cost_price, current_stock, is_active, unit_of_measure
       FROM products
       WHERE (product_name ILIKE $1 OR barcode ILIKE $1 OR product_code ILIKE $1)
       AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as count FROM products 
       WHERE (product_name ILIKE $1 OR barcode ILIKE $1 OR product_code ILIKE $1)
       AND deleted_at IS NULL`,
      [`%${q}%`]
    );

    return NextResponse.json({
      success: true,
      data: rows.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset
    });
  } catch (err) {
    console.error('GET /api/inventory/products error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products', message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      product_code,
      product_name,
      barcode,
      category_id,
      description,
      product_type,
      unit_of_measure,
      cost_price,
      selling_price,
      tax_rate,
      track_inventory,
      is_active,
      is_taxable
    } = body;

    // Validate required fields
    if (!product_name || !product_code) {
      return NextResponse.json(
        { success: false, error: 'product_name and product_code are required' },
        { status: 400 }
      );
    }

    // Sanitize category_id - only accept valid UUIDs or null
    let validCategoryId = null;
    if (category_id && typeof category_id === 'string') {
      // Check if it looks like a UUID (36 chars with hyphens) or is a valid UUID pattern
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidPattern.test(category_id)) {
        validCategoryId = category_id;
      }
      // Otherwise, treat as invalid and ignore (set to null)
    }

    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Insert product
      const res = await client.query(
        `INSERT INTO products 
         (product_code, product_name, barcode, category_id, description, product_type, unit_of_measure, cost_price, selling_price, tax_rate, track_inventory, is_active, is_taxable, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
         RETURNING *`,
        [
          product_code,
          product_name,
          barcode,
          validCategoryId,
          description,
          product_type || 'physical',
          unit_of_measure || 'piece',
          cost_price || 0,
          selling_price || 0,
          tax_rate || 0,
          track_inventory !== false,
          is_active !== false,
          is_taxable !== false,
          null
        ]
      );

      // Record initial price history
      if (selling_price) {
        await client.query(
          `INSERT INTO product_price_history 
           (product_id, price_type, old_price, new_price, effective_date, created_by) 
           VALUES ($1, 'selling', NULL, $2, NOW(), $3)`,
          [res.rows[0].id, selling_price, null]
        );
      }

      await client.query('COMMIT');
      return NextResponse.json(
        { success: true, product: res.rows[0] },
        { status: 201 }
      );
    } catch (txErr) {
      await client.query('ROLLBACK');
      console.error('Create product tx error:', txErr.message);
      if (txErr.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Duplicate product code' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Failed to create product' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('POST /api/inventory/products error:', err.message);
    if (err.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
