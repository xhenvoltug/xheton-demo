// =====================================================
// XHETON v0.0.012 - Login API Route
// Handle user authentication with email and password
// =====================================================

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    // Find user by email or username
    const result = await query(`
      SELECT 
        id, 
        username, 
        email, 
        password_hash, 
        first_name, 
        last_name, 
        phone,
        is_active,
        role_id,
        branch_id
      FROM users 
      WHERE (email = $1 OR username = $1) AND deleted_at IS NULL
    `, [email]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password',
      }, { status: 401 });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json({
        success: false,
        error: 'Your account has been deactivated. Please contact support.',
      }, { status: 403 });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password',
      }, { status: 401 });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      roleId: user.role_id,
      branchId: user.branch_id,
    });

    // Set cookie
    await setAuthCookie(token);

    // Log activity
    console.log(`✅ User logged in: ${user.email} (ID: ${user.id})`);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        roleId: user.role_id,
        branchId: user.branch_id,
      },
      token,
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Login error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to login',
      message: error.message,
    }, { status: 500 });
  }
}
