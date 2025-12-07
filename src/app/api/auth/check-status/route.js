// =====================================================
// XHETON v0.0.012 - Check Subscription Status Route
// Validate user subscription and onboarding status
// =====================================================

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { checkSubscriptionStatus, isUserOnboarded } from '@/lib/subscription';

export async function GET(request) {
  try {
    // Get current user from token
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
        redirectTo: '/auth/login',
      }, { status: 401 });
    }

    // Check if user has completed onboarding
    const onboarded = await isUserOnboarded(user.userId);

    if (!onboarded) {
      return NextResponse.json({
        success: false,
        error: 'Onboarding not completed',
        redirectTo: '/onboarding/start',
        user: {
          id: user.userId,
          email: user.email,
        },
      }, { status: 200 });
    }

    // Check subscription status
    const subscriptionStatus = await checkSubscriptionStatus(user.userId);

    // If no subscription or trial
    if (!subscriptionStatus.hasSubscription) {
      return NextResponse.json({
        success: false,
        error: 'No active subscription',
        redirectTo: '/onboarding/plan',
        user: {
          id: user.userId,
          email: user.email,
        },
      }, { status: 200 });
    }

    // If subscription/trial expired
    if (!subscriptionStatus.hasAccess) {
      return NextResponse.json({
        success: false,
        error: 'Subscription expired',
        redirectTo: '/onboarding/subscribe',
        subscriptionStatus,
        user: {
          id: user.userId,
          email: user.email,
        },
      }, { status: 200 });
    }

    // User has access - redirect to dashboard or last visited page
    console.log(`✅ Access granted for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Access granted',
      redirectTo: '/dashboard',
      user: {
        id: user.userId,
        email: user.email,
        username: user.username,
      },
      subscriptionStatus,
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Check status error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check status',
      message: error.message,
      redirectTo: '/auth/login',
    }, { status: 500 });
  }
}
