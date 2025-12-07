// =====================================================
// XHETON v0.0.013 - Get Current User Info
// Returns logged-in user details
// =====================================================

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    // Get current user from JWT token
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
      }, { status: 401 });
    }

    // Fetch full user details from database
    const result = await query(`
      SELECT 
        u.id,
        u.email,
        u.username,
        u.full_name,
        u.phone,
        u.role_id,
        u.is_active,
        u.created_at,
        u.last_login_at,
        bi.business_name,
        bi.default_branch_id,
        b.branch_name as default_branch_name
      FROM users u
      LEFT JOIN business_info bi ON bi.created_by = u.id
      LEFT JOIN branches b ON b.id = bi.default_branch_id
      WHERE u.id = $1
      LIMIT 1
    `, [user.userId]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    const userData = result.rows[0];

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        fullName: userData.full_name,
        phone: userData.phone,
        roleId: userData.role_id,
        isActive: userData.is_active,
        businessName: userData.business_name,
        defaultBranchId: userData.default_branch_id,
        defaultBranchName: userData.default_branch_name,
        createdAt: userData.created_at,
        lastLoginAt: userData.last_login_at,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching user info:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user info',
      message: error.message,
    }, { status: 500 });
  }
}
