// =====================================================
// XHETON v0.0.013 - Get Branches
// Returns user's branches for selection
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

    // Fetch branches for current user
    const result = await query(`
      SELECT 
        id,
        branch_name as name,
        branch_code as code,
        location,
        is_active
      FROM branches
      WHERE created_by = $1 AND is_active = true
      ORDER BY branch_name
    `, [user.userId]);

    return NextResponse.json({
      success: true,
      branches: result.rows,
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching branches:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch branches',
      message: error.message,
    }, { status: 500 });
  }
}
