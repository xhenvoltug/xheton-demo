// =====================================================
// XHETON v0.0.012 - Onboarding Plan API Route
// Handle plan selection and free trial activation
// =====================================================

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createFreeTrial, getPricingPlans } from '@/lib/subscription';

// GET - Fetch available pricing plans
export async function GET(request) {
  try {
    const plans = await getPricingPlans();

    return NextResponse.json({
      success: true,
      plans,
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching pricing plans:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch pricing plans',
      message: error.message,
    }, { status: 500 });
  }
}

// POST - Activate plan (free trial or paid)
export async function POST(request) {
  try {
    // Get current user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
      }, { status: 401 });
    }

    const body = await request.json();
    const { planId, planType } = body;

    // If free trial
    if (planType === 'trial' || planType === 'free_trial') {
      const subscription = await createFreeTrial(user.userId, planId);

      console.log(`✅ Free trial activated for user: ${user.email}`);

      return NextResponse.json({
        success: true,
        message: 'Free trial activated successfully',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          trialEndsAt: subscription.trial_ends_at,
          endDate: subscription.end_date,
        },
      }, { status: 201 });
    }

    // If paid plan - redirect to checkout (placeholder)
    return NextResponse.json({
      success: true,
      message: 'Redirecting to payment checkout',
      redirectTo: '/payments/checkout',
      planId,
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Plan activation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to activate plan',
      message: error.message,
    }, { status: 500 });
  }
}
