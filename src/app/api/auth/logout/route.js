// =====================================================
// XHETON v0.0.012 - Logout API Route
// Handle user logout and session termination
// =====================================================

import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    // Remove auth cookie
    await removeAuthCookie();

    console.log('✅ User logged out successfully');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Logout error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to logout',
      message: error.message,
    }, { status: 500 });
  }
}
