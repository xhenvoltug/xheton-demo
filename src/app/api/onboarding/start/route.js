// =====================================================
// XHETON v0.0.012 - Onboarding Start API Route
// Save business information and create default branch
// =====================================================

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

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
    const { businessName, phone, country, industry } = body;

    // Validation
    if (!businessName) {
      return NextResponse.json({
        success: false,
        error: 'Business name is required',
      }, { status: 400 });
    }

    // Check if business info already exists
    const existingBusiness = await query(
      'SELECT id FROM business_info WHERE created_by = $1',
      [user.userId]
    );

    let businessId;

    if (existingBusiness.rows.length > 0) {
      // Update existing business info
      const updateResult = await query(`
        UPDATE business_info 
        SET 
          business_name = $1,
          phone = $2,
          country = $3,
          updated_at = NOW(),
          updated_by = $4
        WHERE created_by = $4
        RETURNING id
      `, [businessName, phone, country || 'Uganda', user.userId]);

      businessId = updateResult.rows[0].id;
    } else {
      // Create new business info
      const insertResult = await query(`
        INSERT INTO business_info (
          business_name,
          phone,
          country,
          business_type,
          currency_code,
          currency_symbol,
          created_at,
          updated_at,
          created_by,
          updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7, $7)
        RETURNING id
      `, [
        businessName,
        phone,
        country || 'Uganda',
        industry || 'General',
        'UGX',
        'UGX',
        user.userId,
      ]);

      businessId = insertResult.rows[0].id;
    }

    // Create or update default branch
    const branchCode = businessName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 10) + '-HQ';

    const existingBranch = await query(
      'SELECT id FROM branches WHERE created_by = $1 AND branch_type = $2',
      [user.userId, 'headquarters']
    );

    let branchId;

    if (existingBranch.rows.length > 0) {
      // Update existing branch
      const updateResult = await query(`
        UPDATE branches 
        SET 
          branch_name = $1,
          branch_code = $2,
          phone = $3,
          country = $4,
          updated_at = NOW(),
          updated_by = $5
        WHERE created_by = $5 AND branch_type = 'headquarters'
        RETURNING id
      `, [
        `${businessName} - Headquarters`,
        branchCode,
        phone,
        country || 'Uganda',
        user.userId,
      ]);

      branchId = updateResult.rows[0].id;
    } else {
      // Create new branch
      const insertResult = await query(`
        INSERT INTO branches (
          branch_code,
          branch_name,
          branch_type,
          phone,
          country,
          is_active,
          created_at,
          updated_at,
          created_by,
          updated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7, $7)
        RETURNING id
      `, [
        branchCode,
        `${businessName} - Headquarters`,
        'headquarters',
        phone,
        country || 'Uganda',
        true,
        user.userId,
      ]);

      branchId = insertResult.rows[0].id;
    }

    // Update user's branch association
    await query(
      'UPDATE users SET branch_id = $1, phone = $2, updated_at = NOW() WHERE id = $3',
      [branchId, phone, user.userId]
    );

    console.log(`✅ Onboarding step 1 completed for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Business information saved successfully',
      data: {
        businessId,
        branchId,
        businessName,
        branchCode,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Onboarding start error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to save business information',
      message: error.message,
    }, { status: 500 });
  }
}
