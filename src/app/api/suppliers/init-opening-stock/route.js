import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * POST /api/suppliers/init-opening-stock - Initialize Opening Stock supplier
 * This endpoint creates the Opening Stock supplier if it doesn't exist
 */
export async function POST(request) {
  try {
    // Check if Opening Stock supplier already exists
    const checkResult = await query(
      `SELECT id FROM suppliers WHERE supplier_code = 'OPENING_STOCK' AND deleted_at IS NULL LIMIT 1`
    );

    if (checkResult.rowCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Opening Stock supplier already exists',
        id: checkResult.rows[0].id
      });
    }

    // Create Opening Stock supplier
    const insertResult = await query(
      `INSERT INTO suppliers (supplier_name, supplier_code, email, country, is_active, payment_terms, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, supplier_name, supplier_code`,
      ['Opening Stock', 'OPENING_STOCK', 'system@xheton.local', 'Internal', true, 0]
    );

    return NextResponse.json({
      success: true,
      message: 'Opening Stock supplier created',
      data: insertResult.rows[0]
    }, { status: 201 });
  } catch (err) {
    console.error('POST /api/suppliers/init-opening-stock error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize Opening Stock supplier', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
