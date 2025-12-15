#!/usr/bin/env node

/**
 * Pricing Plans Seeding Script
 * Seeds landing_pricing_plans table with XHETON pricing tiers
 * Run: node scripts/seed-pricing-plans.js [--neon] [--local]
 * 
 * Options:
 *   --neon   Seed Neon cloud database
 *   --local  Seed local database (default)
 */

const { Pool } = require('pg');
require('dotenv').config();

// Determine which database to seed
const args = process.argv.slice(2);
const seedNeon = args.includes('--neon');
const seedLocal = args.includes('--local') || !args.length; // Default to local

let connectionString;
let dbName;

if (seedNeon) {
  connectionString = process.env.DATABASE_URL;
  dbName = 'Neon (Cloud)';
} else {
  connectionString = `postgresql://${process.env.DB_FALLBACK_USER}:${process.env.DB_FALLBACK_PASSWORD}@${process.env.DB_FALLBACK_HOST}:${process.env.DB_FALLBACK_PORT}/${process.env.DB_FALLBACK_NAME}`;
  dbName = 'Local (PostgreSQL)';
}

const pool = new Pool({
  connectionString,
  ssl: seedNeon ? { rejectUnauthorized: false } : false,
});

async function seedPricingPlans() {
  const client = await pool.connect();
  try {
    console.log(`Starting pricing plans seeding on ${dbName}...\n`);
    
    // Debug: check which database we're connected to
    const dbCheck = await client.query('SELECT current_database(), current_user');
    console.log(`Connected to: ${dbCheck.rows[0].current_database} as ${dbCheck.rows[0].current_user}\n`);

    // Pricing plans based on XHETON documentation
    const plans = [
      {
        plan_name: 'Free Trial',
        plan_code: 'FREE_TRIAL',
        description: 'Evaluate XHETON with full access to all features for 14 days',
        price_monthly: 0,
        price_annual: 0,
        discount_label: '14-day trial',
        features: ['2 users', '1 location', '500 MB storage', 'All modules', 'Email support', 'Basic reports'],
        is_popular: false,
        display_order: 0,
        cta_text: 'Start Free Trial',
      },
      {
        plan_name: 'Starter',
        plan_code: 'STARTER',
        description: 'Perfect for small businesses getting started',
        price_monthly: 150000,
        price_annual: 1500000,
        discount_label: 'Save 17%',
        features: ['3 users', '1 location', '5 GB storage', 'Core modules', 'Email support', 'Standard reports', 'Basic API access'],
        is_popular: false,
        display_order: 1,
        cta_text: 'Get Started',
      },
      {
        plan_name: 'Business',
        plan_code: 'BUSINESS',
        description: 'Best for growing businesses',
        price_monthly: 350000,
        price_annual: 3500000,
        discount_label: 'Save 17%',
        features: ['10 users', '3 locations', '25 GB storage', 'All modules', 'Priority support', 'Advanced analytics', 'Full API access', 'Custom fields'],
        is_popular: true,
        display_order: 2,
        cta_text: 'Get Started',
      },
      {
        plan_name: 'Enterprise',
        plan_code: 'ENTERPRISE',
        description: 'Tailored solutions for large organizations',
        price_monthly: 750000,
        price_annual: 7500000,
        discount_label: 'Save 17%',
        features: ['Unlimited users', 'Unlimited locations', 'Unlimited storage', 'All modules + Custom', 'Dedicated account manager', 'Custom reports & BI', 'Advanced API + Webhooks', 'Full customization'],
        is_popular: false,
        display_order: 3,
        cta_text: 'Contact Sales',
      },
    ];

    console.log('💰 Creating pricing plans...');
    for (const plan of plans) {
      await client.query(
        `INSERT INTO landing_pricing_plans 
         (plan_name, plan_code, description, price_monthly, price_annual, discount_label, features, is_popular, display_order, cta_text, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
         ON CONFLICT (plan_code) DO NOTHING`,
        [
          plan.plan_name,
          plan.plan_code,
          plan.description,
          plan.price_monthly,
          plan.price_annual,
          plan.discount_label,
          JSON.stringify(plan.features),
          plan.is_popular,
          plan.display_order,
          plan.cta_text,
        ]
      );
      console.log(`  ✓ Added plan: ${plan.plan_name}`);
    }

    // Also seed subscription_plans table (used by onboarding API)
    console.log('\n📋 Creating subscription plans...');
    const subscriptionPlans = [
      {
        plan_name: 'Free Trial',
        plan_code: 'FREE_TRIAL',
        description: 'Evaluate XHETON with full access to all features for 14 days',
        price_monthly: 0,
        price_annual: 0,
        max_users: 5,
        max_branches: 1,
        max_storage_gb: 10,
        is_popular: false,
        display_order: 0,
      },
      {
        plan_name: 'Starter',
        plan_code: 'STARTER',
        description: 'Perfect for small businesses getting started',
        price_monthly: 150000,
        price_annual: 1500000,
        max_users: 3,
        max_branches: 1,
        max_storage_gb: 5,
        is_popular: false,
        display_order: 1,
      },
      {
        plan_name: 'Business',
        plan_code: 'BUSINESS',
        description: 'Best for growing businesses',
        price_monthly: 350000,
        price_annual: 3500000,
        max_users: 10,
        max_branches: 3,
        max_storage_gb: 25,
        is_popular: true,
        display_order: 2,
      },
      {
        plan_name: 'Enterprise',
        plan_code: 'ENTERPRISE',
        description: 'Tailored solutions for large organizations',
        price_monthly: 750000,
        price_annual: 7500000,
        max_users: 50,
        max_branches: 10,
        max_storage_gb: 100,
        is_popular: false,
        display_order: 3,
      },
    ];

    for (const plan of subscriptionPlans) {
      await client.query(
        `INSERT INTO subscription_plans 
         (plan_name, plan_code, description, price_monthly, price_annual, discount_annual_percent, max_users, max_branches, max_storage_gb, is_popular, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, 15.00, $6, $7, $8, $9, $10, true)
         ON CONFLICT (plan_code) DO NOTHING`,
        [
          plan.plan_name,
          plan.plan_code,
          plan.description,
          plan.price_monthly,
          plan.price_annual,
          plan.max_users,
          plan.max_branches,
          plan.max_storage_gb,
          plan.is_popular,
          plan.display_order,
        ]
      );
      console.log(`  ✓ Added plan: ${plan.plan_name}`);
    }

    console.log('\n========================================');
    console.log('✓ Pricing plans seeded successfully!');
    console.log('========================================\n');
    console.log('Created:');
    console.log('  • 1 Free Trial plan (UGX 0)');
    console.log('  • 1 Starter plan (UGX 150,000/month)');
    console.log('  • 1 Business plan (UGX 350,000/month) ⭐ Popular');
    console.log('  • 1 Enterprise plan (UGX 750,000/month)');
    console.log('\nBoth landing_pricing_plans and subscription_plans tables populated.\n');

  } catch (err) {
    console.error('Seeding error:', err.message);
    throw err;
  } finally {
    await client.release();
    await pool.end();
  }
}

// Run the seeding
seedPricingPlans().catch(console.error);
