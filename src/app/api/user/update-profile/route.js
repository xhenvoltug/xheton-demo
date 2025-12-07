// =====================================================
// XHETON v0.0.013 - Update User Profile
// Updates user name, email, phone, default branch
// =====================================================

import { NextResponse } from 'next/server';
import { getCurrentUser, generateToken, setAuthCookie } from '@/lib/auth';
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
    const { fullName, email, phone, defaultBranchId } = body;

    // Validate input
    if (!fullName || !email) {
      return NextResponse.json({
        success: false,
        error: 'Full name and email are required',
      }, { status: 400 });
    }

    // Check if email is being changed and if it's already taken
    if (email !== user.email) {
      const emailCheck = await query(`
        SELECT id FROM users WHERE email = $1 AND id != $2
      `, [email, user.userId]);

      if (emailCheck.rows.length > 0) {
        return NextResponse.json({
          success: false,
          error: 'Email already in use',
        }, { status: 400 });
      }
    }

    // Update user profile
    const updateResult = await query(`
      UPDATE users 
      SET 
        full_name = $1,
        email = $2,
        phone = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING id, email, username, full_name, phone
    `, [fullName, email, phone || null, user.userId]);

    if (updateResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    // Update default branch in business_info if provided
    if (defaultBranchId) {
      await query(`
        UPDATE business_info 
        SET default_branch_id = $1, updated_at = NOW()
        WHERE created_by = $2
      `, [defaultBranchId, user.userId]);
    }

    const updatedUser = updateResult.rows[0];

    // If email or name changed, generate new JWT token
    let newToken = null;
    if (email !== user.email || fullName !== user.fullName) {
      newToken = generateToken({
        userId: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        fullName: updatedUser.full_name,
      });

      // Set new auth cookie
      const response = NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
          fullName: updatedUser.full_name,
          phone: updatedUser.phone,
        },
      }, { status: 200 });

      setAuthCookie(response, newToken);
      
      console.log(`✅ Profile updated for user: ${updatedUser.email}`);
      return response;
    }

    console.log(`✅ Profile updated for user: ${updatedUser.email}`);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        fullName: updatedUser.full_name,
        phone: updatedUser.phone,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error updating profile:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update profile',
      message: error.message,
    }, { status: 500 });
  }
}
