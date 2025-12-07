// =====================================================
// XHETON v0.0.012 - Signup API Route
// Handle user registration with email and password
// =====================================================

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, username, firstName, lastName, phone } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 8 characters long',
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username || email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists',
      }, { status: 409 });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await query(`
      INSERT INTO users (
        username,
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        is_active,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, username, email, first_name, last_name, phone, created_at
    `, [
      username || email.split('@')[0],
      email,
      passwordHash,
      firstName || null,
      lastName || null,
      phone || null,
      true,
    ]);

    const user = result.rows[0];

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    // Set cookie
    await setAuthCookie(token);

    // Log activity
    console.log(`✅ New user registered: ${user.email} (ID: ${user.id})`);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
      },
      token,
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Signup error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create account',
      message: error.message,
    }, { status: 500 });
  }
}
