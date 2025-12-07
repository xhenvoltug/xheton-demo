// =====================================================
// XHETON v0.0.013 - System Settings API
// Get and update system-wide settings
// =====================================================

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

// GET /api/settings - Fetch all system settings
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

    // Check if settings table exists, if not create it
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT,
        type VARCHAR(50) DEFAULT 'string',
        category VARCHAR(100) DEFAULT 'general',
        description TEXT,
        updated_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fetch all settings
    const result = await query(`
      SELECT key, value, type, category, description, updated_at
      FROM settings
      ORDER BY category, key
    `);

    // If no settings exist, create defaults
    if (result.rows.length === 0) {
      const defaultSettings = [
        { key: 'company_name', value: 'XHETON', type: 'string', category: 'branding', description: 'Company name displayed across the system' },
        { key: 'company_tagline', value: 'Modern Business Management', type: 'string', category: 'branding', description: 'Company tagline' },
        { key: 'default_currency', value: 'UGX', type: 'string', category: 'financial', description: 'Default currency code' },
        { key: 'currency_symbol', value: 'UGX', type: 'string', category: 'financial', description: 'Currency symbol' },
        { key: 'enable_notifications', value: 'true', type: 'boolean', category: 'notifications', description: 'Enable system notifications' },
        { key: 'notification_email', value: '', type: 'string', category: 'notifications', description: 'Email for system notifications' },
        { key: 'enable_email_alerts', value: 'true', type: 'boolean', category: 'notifications', description: 'Enable email alerts' },
        { key: 'low_stock_threshold', value: '10', type: 'number', category: 'inventory', description: 'Low stock alert threshold' },
        { key: 'enable_landing_page', value: 'true', type: 'boolean', category: 'landing', description: 'Enable landing page' },
        { key: 'show_pricing', value: 'true', type: 'boolean', category: 'landing', description: 'Show pricing on landing page' },
        { key: 'show_testimonials', value: 'true', type: 'boolean', category: 'landing', description: 'Show testimonials on landing page' },
      ];

      for (const setting of defaultSettings) {
        await query(`
          INSERT INTO settings (key, value, type, category, description, updated_by)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (key) DO NOTHING
        `, [setting.key, setting.value, setting.type, setting.category, setting.description, user.userId]);
      }

      // Re-fetch settings
      const newResult = await query(`
        SELECT key, value, type, category, description, updated_at
        FROM settings
        ORDER BY category, key
      `);

      return NextResponse.json({
        success: true,
        settings: newResult.rows,
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      settings: result.rows,
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch settings',
      message: error.message,
    }, { status: 500 });
  }
}

// POST /api/settings - Update system settings
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
    const { settings } = body;

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json({
        success: false,
        error: 'Settings array is required',
      }, { status: 400 });
    }

    // Update each setting
    for (const setting of settings) {
      const { key, value } = setting;

      await query(`
        UPDATE settings 
        SET 
          value = $1,
          updated_by = $2,
          updated_at = NOW()
        WHERE key = $3
      `, [value, user.userId, key]);
    }

    console.log(`✅ Settings updated by user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error updating settings:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update settings',
      message: error.message,
    }, { status: 500 });
  }
}
