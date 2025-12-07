// =====================================================
// XHETON v0.0.013 - Change Password
// Validates current password and updates to new password
// =====================================================

import { NextResponse } from 'next/server';
import { getCurrentUser, hashPassword, comparePassword } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    // Get current user from JWT token
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
      }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required',
      }, { status: 400 });
    }

    // Validate new password confirmation
    if (newPassword !== confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'New passwords do not match',
      }, { status: 400 });
    }

    // Validate new password strength (minimum 8 characters)
    if (newPassword.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'New password must be at least 8 characters long',
      }, { status: 400 });
    }

    // Get user's current password hash from database
    const userResult = await query(`
      SELECT password_hash FROM users WHERE id = $1
    `, [user.userId]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    const userPasswordHash = userResult.rows[0].password_hash;

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, userPasswordHash);

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Current password is incorrect',
      }, { status: 400 });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password in database
    await query(`
      UPDATE users 
      SET 
        password_hash = $1,
        updated_at = NOW()
      WHERE id = $2
    `, [newPasswordHash, user.userId]);

    console.log(`✅ Password changed for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error changing password:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to change password',
      message: error.message,
    }, { status: 500 });
  }
}
