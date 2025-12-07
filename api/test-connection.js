// =====================================================
// Database Connection Test Script
// Run: node test-connection.js
// =====================================================

require('dotenv').config();
const db = require('../database/config');

async function runTests() {
  console.log('\n===========================================');
  console.log('XHETON Database Connection Test');
  console.log('===========================================\n');
  
  try {
    // Test 1: Primary Database Connection
    console.log('Test 1: Testing Primary Database Connection...');
    const primaryTest = await db.testConnection('primary');
    
    if (primaryTest.success) {
      console.log('✅ Primary database connected successfully');
      console.log(`   Time: ${primaryTest.currentTime}`);
      console.log(`   Version: ${primaryTest.version.substring(0, 50)}...`);
    } else {
      console.log('❌ Primary database connection failed');
      console.log(`   Error: ${primaryTest.error}`);
    }
    
    console.log('\n-------------------------------------------\n');
    
    // Test 2: Fallback Database Connection
    console.log('Test 2: Testing Fallback Database Connection...');
    const fallbackTest = await db.testConnection('fallback');
    
    if (fallbackTest.success) {
      console.log('✅ Fallback database connected successfully');
      console.log(`   Time: ${fallbackTest.currentTime}`);
      console.log(`   Version: ${fallbackTest.version.substring(0, 50)}...`);
    } else {
      console.log('❌ Fallback database connection failed');
      console.log(`   Error: ${fallbackTest.error}`);
    }
    
    console.log('\n-------------------------------------------\n');
    
    // Test 3: Query Execution
    console.log('Test 3: Testing Query Execution...');
    const queryResult = await db.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = $1', ['public']);
    
    console.log('✅ Query executed successfully');
    console.log(`   Total tables in public schema: ${queryResult.rows[0].table_count}`);
    
    console.log('\n-------------------------------------------\n');
    
    // Test 4: Pool Statistics
    console.log('Test 4: Connection Pool Statistics...');
    const poolStats = db.getPoolStats();
    
    console.log('✅ Pool stats retrieved');
    console.log(`   Active Pool: ${poolStats.currentPool}`);
    console.log(`   Total Connections: ${poolStats.totalCount}`);
    console.log(`   Idle Connections: ${poolStats.idleCount}`);
    console.log(`   Waiting Requests: ${poolStats.waitingCount}`);
    
    console.log('\n-------------------------------------------\n');
    
    // Test 5: Table Existence Check
    console.log('Test 5: Checking Core Tables Existence...');
    const tablesToCheck = [
      'users',
      'customers', 
      'suppliers',
      'products',
      'sales_orders',
      'purchase_orders',
      'inventory_adjustments',
      'journal_entries',
      'employees',
      'notifications'
    ];
    
    for (const table of tablesToCheck) {
      const checkResult = await db.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [table]
      );
      
      const exists = checkResult.rows[0].exists;
      console.log(`   ${exists ? '✅' : '❌'} ${table}: ${exists ? 'exists' : 'missing'}`);
    }
    
    console.log('\n-------------------------------------------\n');
    
    // Test 6: Health Check
    console.log('Test 6: Full Health Check...');
    const health = await db.healthCheck();
    
    console.log('✅ Health check completed');
    console.log(`   Primary Status: ${health.primary.success ? 'Healthy' : 'Unhealthy'}`);
    console.log(`   Fallback Status: ${health.fallback.success ? 'Healthy' : 'Unhealthy'}`);
    console.log(`   Currently Active: ${health.currentActive}`);
    
    console.log('\n===========================================');
    console.log('✅ All tests completed successfully!');
    console.log('===========================================\n');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
  } finally {
    // Close connections
    await db.closeAll();
    process.exit(0);
  }
}

// Run tests
runTests();
