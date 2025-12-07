// =====================================================
// Subscription Management Utilities for XHETON v0.0.012
// Check subscription status, trial, and access control
// =====================================================

import { query } from './db';

/**
 * Check if user has active subscription or trial
 * @param {string} userId - User ID
 * @returns {Promise<object>} Subscription status object
 */
export async function checkSubscriptionStatus(userId) {
  try {
    // Get user's current subscription
    const result = await query(`
      SELECT 
        us.id,
        us.status,
        us.start_date,
        us.end_date,
        us.trial_ends_at,
        us.billing_cycle,
        us.amount,
        sp.plan_name,
        sp.plan_code,
        sp.features,
        CASE 
          WHEN us.trial_ends_at IS NOT NULL AND us.trial_ends_at > NOW() THEN true
          ELSE false
        END as is_trial_active,
        CASE 
          WHEN us.status = 'active' AND us.end_date > CURRENT_DATE THEN true
          ELSE false
        END as is_subscription_active
      FROM user_subscriptions us
      INNER JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = $1
      ORDER BY us.created_at DESC
      LIMIT 1
    `, [userId]);

    if (result.rows.length === 0) {
      return {
        hasSubscription: false,
        hasActiveTrial: false,
        hasAccess: false,
        subscription: null,
      };
    }

    const subscription = result.rows[0];
    const hasActiveTrial = subscription.is_trial_active;
    const hasActiveSubscription = subscription.is_subscription_active;
    const hasAccess = hasActiveTrial || hasActiveSubscription;

    return {
      hasSubscription: true,
      hasActiveTrial,
      hasActiveSubscription,
      hasAccess,
      subscription: {
        id: subscription.id,
        planName: subscription.plan_name,
        planCode: subscription.plan_code,
        status: subscription.status,
        startDate: subscription.start_date,
        endDate: subscription.end_date,
        trialEndsAt: subscription.trial_ends_at,
        billingCycle: subscription.billing_cycle,
        amount: subscription.amount,
        features: subscription.features,
      },
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    throw error;
  }
}

/**
 * Check if user has completed onboarding
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if onboarded
 */
export async function isUserOnboarded(userId) {
  try {
    const result = await query(`
      SELECT 
        CASE 
          WHEN bi.id IS NOT NULL AND b.id IS NOT NULL THEN true
          ELSE false
        END as is_onboarded
      FROM users u
      LEFT JOIN business_info bi ON bi.created_by = u.id
      LEFT JOIN branches b ON b.created_by = u.id
      WHERE u.id = $1
      LIMIT 1
    `, [userId]);

    if (result.rows.length === 0) {
      return false;
    }

    return result.rows[0].is_onboarded;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

/**
 * Create free trial subscription for user
 * @param {string} userId - User ID
 * @param {string} planId - Plan ID (optional, uses free trial plan if not provided)
 * @returns {Promise<object>} Created subscription
 */
export async function createFreeTrial(userId, planId = null) {
  try {
    // If no plan ID provided, get the free trial plan
    let actualPlanId = planId;
    
    if (!actualPlanId) {
      const planResult = await query(`
        SELECT id FROM subscription_plans 
        WHERE plan_code = 'FREE_TRIAL' OR plan_name ILIKE '%trial%'
        LIMIT 1
      `);
      
      if (planResult.rows.length === 0) {
        throw new Error('Free trial plan not found');
      }
      
      actualPlanId = planResult.rows[0].id;
    }

    // Create subscription with 30-day free trial
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const result = await query(`
      INSERT INTO user_subscriptions (
        user_id,
        plan_id,
        status,
        billing_cycle,
        amount,
        start_date,
        end_date,
        trial_ends_at,
        auto_renew
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      userId,
      actualPlanId,
      'active',
      'monthly',
      0,
      new Date(),
      endDate,
      trialEndDate,
      true,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error('Error creating free trial:', error);
    throw error;
  }
}

/**
 * Get all available pricing plans
 * @returns {Promise<Array>} Array of pricing plans
 */
export async function getPricingPlans() {
  try {
    const result = await query(`
      SELECT 
        id,
        plan_name,
        plan_code,
        description,
        price_monthly,
        price_annual,
        discount_annual_percent,
        max_users,
        max_branches,
        max_products,
        max_storage_gb,
        features,
        is_popular,
        display_order
      FROM subscription_plans
      WHERE is_active = true
      ORDER BY display_order ASC, price_monthly ASC
    `);

    return result.rows;
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    throw error;
  }
}

/**
 * Update user's last visited route
 * @param {string} userId - User ID
 * @param {string} route - Route path
 */
export async function updateLastVisitedRoute(userId, route) {
  try {
    await query(`
      UPDATE users 
      SET 
        last_login_at = NOW(),
        updated_at = NOW()
      WHERE id = $1
    `, [userId]);

    // Store in user_sessions if exists, or we could add a field to users table
    // For now, we'll just update last_login_at
  } catch (error) {
    console.error('Error updating last visited route:', error);
  }
}

/**
 * Get user's last visited route
 * @param {string} userId - User ID
 * @returns {Promise<string|null>} Last visited route or null
 */
export async function getLastVisitedRoute(userId) {
  // This would require adding a field to users table
  // For now, return null (will default to /dashboard)
  return null;
}
