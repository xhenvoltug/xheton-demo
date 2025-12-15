// =====================================================
// User by ID API Route - Next.js 16 App Router
// GET, PUT, DELETE operations for specific user
// =====================================================

import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';

/**
 * GET /api/users/[id] - Get a specific user
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const result = await query(
      `SELECT user_id, username, email, first_name, last_name, 
              role, status, created_at, last_login, updated_at
       FROM users 
       WHERE user_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        message: `No user found with id: ${id}`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message
    }, { status: 500 });
  }
}

/**
 * PUT /api/users/[id] - Update a specific user
 */
export async function PUT(request, { params }) {
  const client = await getClient();
  
  try {
    const { id } = params;
    const body = await request.json();
    const { first_name, last_name, email, role, status } = body;
    
    await client.query('BEGIN');
    
    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (first_name !== undefined) {
      updates.push('first_name = $' + paramCount++);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push('last_name = $' + paramCount++);
      values.push(last_name);
    }
    if (email !== undefined) {
      updates.push('email = $' + paramCount++);
      values.push(email);
    }
    if (role !== undefined) {
      updates.push('role = $' + paramCount++);
      values.push(role);
    }
    if (status !== undefined) {
      updates.push('status = $' + paramCount++);
      values.push(status);
    }
    
    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No fields to update',
        message: 'Please provide at least one field to update'
      }, { status: 400 });
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const result = await client.query(
      `UPDATE users 
       SET ${updates.join(', ')}
       WHERE user_id = $${paramCount}
       RETURNING user_id, username, email, first_name, last_name, role, status, updated_at`,
      values
    );
    
    await client.query('COMMIT');
    
    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        message: `No user found with id: ${id}`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    }, { status: 200 });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating user:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    }, { status: 500 });
    
  } finally {
    client.release();
  }
}

/**
 * DELETE /api/users/[id] - Delete a specific user (soft delete)
 */
export async function DELETE(request, { params }) {
  const client = await getClient();
  
  try {
    const { id } = params;
    
    await client.query('BEGIN');
    
    // Soft delete by setting status to 'deleted'
    const result = await client.query(
      `UPDATE users 
       SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
       RETURNING user_id, username, email, status`,
      [id]
    );
    
    await client.query('COMMIT');
    
    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        message: `No user found with id: ${id}`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      data: result.rows[0]
    }, { status: 200 });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting user:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    }, { status: 500 });
    
  } finally {
    client.release();
  }
}

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';
