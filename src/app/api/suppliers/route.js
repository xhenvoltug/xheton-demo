import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/suppliers - Get all suppliers for dropdowns
 * Returns array of suppliers with id, supplier_name, etc.
 * Auto-creates Opening Stock supplier if it doesn't exist
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;
    const offset = parseInt(searchParams.get('offset')) || 0;

    // Ensure Opening Stock supplier exists
    const openingStockCheck = await query(
      `SELECT id FROM suppliers WHERE supplier_code = 'OPENING_STOCK' AND deleted_at IS NULL LIMIT 1`
    );

    console.log('Opening Stock check result:', openingStockCheck.rowCount);

    if (openingStockCheck.rowCount === 0) {
      try {
        // Create Opening Stock supplier if it doesn't exist
        const createResult = await query(
          `INSERT INTO suppliers (supplier_name, supplier_code, email, country, is_active, payment_terms, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           RETURNING id, supplier_name`,
          ['Opening Stock', 'OPENING_STOCK', 'system@xheton.local', 'Internal', true, 0]
        );
        console.log('Opening Stock supplier created:', createResult.rows[0]);
      } catch (createErr) {
        console.warn('Could not create Opening Stock supplier:', createErr.message);
      }
    }

    const rows = await query(
      `SELECT id, supplier_name, supplier_code, email, phone, address, city, country, 
              credit_limit, payment_terms, is_active, created_at
       FROM suppliers
       WHERE deleted_at IS NULL
       ORDER BY supplier_name ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    console.log('Total suppliers returned:', rows.rowCount);
    // Return as array directly for compatibility with dropdown forms
    return NextResponse.json(rows.rows);
  } catch (err) {
    console.error('GET /api/suppliers error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suppliers', message: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/suppliers - Create a new supplier
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { supplier_name, supplier_code, email, phone, country, is_active, payment_terms } = body;

    if (!supplier_name || !supplier_code) {
      return NextResponse.json(
        { success: false, error: 'supplier_name and supplier_code are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO suppliers (supplier_name, supplier_code, email, phone, country, is_active, payment_terms, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id, supplier_name, supplier_code, email, phone, country, is_active, payment_terms`,
      [supplier_name, supplier_code, email || null, phone || null, country || null, is_active !== false, payment_terms || 0]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error('POST /api/suppliers error:', err.message);
    if (err.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'Supplier code already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create supplier', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
