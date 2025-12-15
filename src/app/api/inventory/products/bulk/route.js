import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, ids, allExcept } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'action is required' },
        { status: 400 }
      );
    }

    const client = await getClient();
    
    try {
      await client.query('BEGIN');

      let affectedCount = 0;

      if (action === 'delete' || action === 'delete_selected' || action === 'delete_unselected' || action === 'delete_all') {
        let whereClause = 'deleted_at IS NULL';
        let params = [];

        if (action === 'delete_selected' && ids && ids.length > 0) {
          whereClause = `id = ANY($1) AND deleted_at IS NULL`;
          params.push(ids);
        } else if (action === 'delete_unselected' && ids && ids.length > 0) {
          whereClause = `id != ALL($1) AND deleted_at IS NULL`;
          params.push(ids);
        }
        // else: delete_all uses just the base whereClause

        const result = await client.query(
          `UPDATE products SET deleted_at = NOW(), updated_by = $${params.length + 1} WHERE ${whereClause}`,
          [...params, null]
        );
        affectedCount = result.rowCount;
      } else {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
      }

      await client.query('COMMIT');
      client.release();

      return NextResponse.json({
        success: true,
        message: `${affectedCount} product(s) deleted successfully`,
        affectedCount
      });
    } catch (err) {
      await client.query('ROLLBACK');
      client.release();
      throw err;
    }
  } catch (err) {
    console.error('POST /api/inventory/products/bulk error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Bulk operation failed', message: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
