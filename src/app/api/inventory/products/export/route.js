import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { format, filterSearch, filterCategory, filterStock, selectedIds } = body;

    if (!['csv', 'json'].includes(format)) {
      return NextResponse.json(
        { success: false, error: 'Invalid format. Supported: csv, json' },
        { status: 400 }
      );
    }

    // Build query
    let whereClause = 'deleted_at IS NULL';
    let params = [];
    let paramIndex = 1;

    if (filterSearch) {
      whereClause += ` AND (product_name ILIKE $${paramIndex} OR product_code ILIKE $${paramIndex} OR barcode ILIKE $${paramIndex})`;
      params.push(`%${filterSearch}%`);
      paramIndex++;
    }

    if (filterCategory && filterCategory !== 'all') {
      whereClause += ` AND category_id = $${paramIndex}`;
      params.push(filterCategory);
      paramIndex++;
    }

    if (filterStock && filterStock !== 'all') {
      if (filterStock === 'out_of_stock') {
        whereClause += ` AND current_stock = 0`;
      } else if (filterStock === 'low') {
        whereClause += ` AND current_stock > 0 AND current_stock < 20`;
      } else if (filterStock === 'normal') {
        whereClause += ` AND current_stock >= 20`;
      }
    }

    if (selectedIds && selectedIds.length > 0) {
      whereClause += ` AND id = ANY($${paramIndex})`;
      params.push(selectedIds);
    }

    const result = await query(
      `SELECT id, product_code, product_name, category_id, current_stock, cost_price, selling_price, is_active, unit_of_measure
       FROM products
       WHERE ${whereClause}
       ORDER BY created_at DESC`,
      params
    );

    const products = result.rows;

    if (format === 'csv') {
      const headers = ['ID', 'Product Code', 'Product Name', 'Current Stock', 'Cost Price', 'Selling Price', 'Unit', 'Status'];
      const rows = products.map(p => [
        p.id,
        p.product_code,
        `"${p.product_name}"`,
        p.current_stock,
        p.cost_price,
        p.selling_price,
        p.unit_of_measure,
        p.is_active ? 'Active' : 'Inactive'
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="products.csv"'
        }
      });
    } else if (format === 'json') {
      return NextResponse.json({
        success: true,
        count: products.length,
        data: products,
        exportDate: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error('POST /api/inventory/products/export error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Export failed', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
