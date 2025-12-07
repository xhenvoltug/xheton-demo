// =====================================================
// Health Check API Route - Next.js 16 App Router
// GET /api/health
// =====================================================

import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/db';

export async function GET(request) {
  try {
    const health = await healthCheck();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      service: 'XHETON API v0.0.014',
      database: health
    }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Health check failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';
