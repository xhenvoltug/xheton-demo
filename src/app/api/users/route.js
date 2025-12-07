// =====================================================
// Users API Route - Next.js 16 App Router
// CRUD operations for Users table
// =====================================================

import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';

/**
 * GET /api/users - Get all users
 * Query params: ?limit=10&offset=0
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = parseInt(searchParams.get('offset')) || 0;
    
    const result = await query(
      `SELECT id, username, email, first_name, last_name, 
              role_id, is_active, created_at, last_login_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    // Get total count
    const countResult = await query('SELECT COUNT(*) as total FROM users', []);
    
    return NextResponse.json({
      success: true,
      users: result.rows,
      pagination: {
        limit,
        offset,
        total: parseInt(countResult.rows[0].total)
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    }, { status: 500 });
  }
}

/**
 * POST /api/users - Create a new user
 */
export async function POST(request) {
  const client = await getClient();
  
  try {
    const body = await request.json();
    const { username, email, password_hash, first_name, last_name, role = 'user' } = body;
    
    // Validate required fields
    if (!username || !email || !password_hash) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'username, email, and password_hash are required'
      }, { status: 400 });
    }
    
    await client.query('BEGIN');
    
    const result = await client.query(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'active')
       RETURNING user_id, username, email, first_name, last_name, role, status, created_at`,
      [username, email, password_hash, first_name, last_name, role]
    );
    
    await client.query('COMMIT');
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0]
    }, { status: 201 });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating user:', error);
    
    // Check for unique constraint violations
    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: 'Duplicate entry',
        message: 'Username or email already exists'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create user',
      message: error.message
    }, { status: 500 });
    
  } finally {
    client.release();
  }
}

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';
