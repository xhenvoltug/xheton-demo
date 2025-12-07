// =====================================================
// XHETON v0.0.013 - Sign Out User
// Removes JWT cookie and invalidates session
// =====================================================

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    // Get current user from JWT token (before removing it)
    const user = await getCurrentUser();

    if (user) {
      // Update last_login_at to track logout time (optional)
      await query(`
        UPDATE users 
        SET updated_at = NOW()
        WHERE id = $1
      `, [user.userId]);

      console.log(`✅ User signed out: ${user.email}`);
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully',
    }, { status: 200 });

    // Remove auth cookie
    response.cookies.delete('xheton_auth_token');

    return response;

  } catch (error) {
    console.error('❌ Error signing out:', error);
    
    // Even if there's an error, still remove the cookie
    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully',
    }, { status: 200 });

    response.cookies.delete('xheton_auth_token');
    
    return response;
  }
}
