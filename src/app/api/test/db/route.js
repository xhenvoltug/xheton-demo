// =====================================================
// Database Test API Route - Next.js 16 App Router
// GET /api/test/db
// =====================================================

import { NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';

export async function GET(request) {
  try {
    console.log('\n===========================================');
    console.log('XHETON Database Connection Test');
    console.log('===========================================\n');
    
    const results = {
      timestamp: new Date().toISOString(),
      tests: []
    };
    
    // Test 1: Primary Database Connection
    console.log('Test 1: Testing Primary Database Connection...');
    const primaryTest = await testConnection('primary');
    results.tests.push({
      name: 'Primary Database Connection',
      ...primaryTest
    });
    
    if (primaryTest.success) {
      console.log('✅ Primary database connected successfully');
    } else {
      console.log('❌ Primary database connection failed');
    }
    
    // Test 2: Fallback Database Connection
    console.log('Test 2: Testing Fallback Database Connection...');
    const fallbackTest = await testConnection('fallback');
    results.tests.push({
      name: 'Fallback Database Connection',
      ...fallbackTest
    });
    
    if (fallbackTest.success) {
      console.log('✅ Fallback database connected successfully');
    } else {
      console.log('❌ Fallback database connection failed');
    }
    
    // Test 3: Query Execution
    console.log('Test 3: Testing Query Execution...');
    try {
      const queryResult = await query(
        'SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = $1',
        ['public']
      );
      
      results.tests.push({
        name: 'Query Execution',
        success: true,
        tableCount: parseInt(queryResult.rows[0].table_count)
      });
      
      console.log('✅ Query executed successfully');
      console.log(`   Total tables in public schema: ${queryResult.rows[0].table_count}`);
    } catch (error) {
      results.tests.push({
        name: 'Query Execution',
        success: false,
        error: error.message
      });
      console.log('❌ Query execution failed');
    }
    
    // Test 4: Table Listing
    console.log('Test 4: Listing Database Tables...');
    try {
      const tablesResult = await query(
        `SELECT table_name 
         FROM information_schema.tables 
         WHERE table_schema = 'public' 
         ORDER BY table_name 
         LIMIT 10`,
        []
      );
      
      results.tests.push({
        name: 'Table Listing',
        success: true,
        tables: tablesResult.rows.map(row => row.table_name),
        totalShown: tablesResult.rows.length
      });
      
      console.log('✅ Table listing successful');
      console.log(`   Found ${tablesResult.rows.length} tables (showing first 10)`);
    } catch (error) {
      results.tests.push({
        name: 'Table Listing',
        success: false,
        error: error.message
      });
      console.log('❌ Table listing failed');
    }
    
    console.log('\n===========================================');
    console.log('Test Complete');
    console.log('===========================================\n');
    
    // Determine overall success
    const allTestsPassed = results.tests.every(test => test.success);
    
    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All database tests passed' : 'Some tests failed',
      ...results
    }, { status: allTestsPassed ? 200 : 500 });
    
  } catch (error) {
    console.error('Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';
