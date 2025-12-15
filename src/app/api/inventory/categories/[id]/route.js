import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const res = await query(
      'SELECT * FROM product_categories WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: res.rows[0] });
  } catch (err) {
    console.error('GET category error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { category_name, description, is_active } = body;

    if (!category_name) {
      return NextResponse.json({ success: false, error: 'category_name required' }, { status: 400 });
    }

    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (category_name !== undefined) {
      updateFields.push(`category_name = $${paramIndex}`);
      updateValues.push(category_name);
      paramIndex++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      updateValues.push(description);
      paramIndex++;
    }

    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramIndex}`);
      updateValues.push(is_active);
      paramIndex++;
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    const sql = `UPDATE product_categories SET ${updateFields.join(', ')} WHERE id = $${paramIndex} AND deleted_at IS NULL RETURNING *`;

    const res = await query(sql, updateValues);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: res.rows[0] });
  } catch (err) {
    console.error('PUT category error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Soft delete: set deleted_at timestamp
    const res = await query(
      'UPDATE product_categories SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *',
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    console.error('DELETE category error:', err.message);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
