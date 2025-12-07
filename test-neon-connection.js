// =====================================================
// Test Neon Database Connection
// Verifies primary (Neon) and fallback (Local) connections
// =====================================================

require('dotenv').config();
const { Pool } = require('pg');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

async function testNeonConnection() {
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}🧪 XHETON Database Connection Test${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Test 1: Neon Database (Primary)
  console.log(`${colors.yellow}[1/2]${colors.reset} Testing PRIMARY database (Neon)...`);
  
  const neonConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
  };

  let neonSuccess = false;
  let neonPool;

  try {
    neonPool = new Pool(neonConfig);
    const result = await neonPool.query('SELECT NOW() as current_time, current_database() as db_name, version() as version');
    
    console.log(`${colors.green}✅ Neon connection successful!${colors.reset}`);
    console.log(`   Database: ${result.rows[0].db_name}`);
    console.log(`   Time: ${result.rows[0].current_time}`);
    console.log(`   Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    
    // Test table count
    const tableResult = await neonPool.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(`   Tables: ${tableResult.rows[0].table_count}`);
    
    neonSuccess = true;
  } catch (error) {
    console.log(`${colors.red}❌ Neon connection failed: ${error.message}${colors.reset}`);
  } finally {
    if (neonPool) {
      await neonPool.end();
    }
  }

  console.log('');

  // Test 2: Local PostgreSQL (Fallback)
  console.log(`${colors.yellow}[2/2]${colors.reset} Testing FALLBACK database (Local PostgreSQL)...`);
  
  const localConfig = {
    host: process.env.DB_FALLBACK_HOST || 'localhost',
    port: parseInt(process.env.DB_FALLBACK_PORT || '5432'),
    database: process.env.DB_FALLBACK_NAME || 'xheton_db',
    user: process.env.DB_FALLBACK_USER || 'xhenvolt',
    password: process.env.DB_FALLBACK_PASSWORD || 'xhenvolt123',
    connectionTimeoutMillis: 5000,
  };

  let localSuccess = false;
  let localPool;

  try {
    localPool = new Pool(localConfig);
    const result = await localPool.query('SELECT NOW() as current_time, current_database() as db_name, version() as version');
    
    console.log(`${colors.green}✅ Local connection successful!${colors.reset}`);
    console.log(`   Database: ${result.rows[0].db_name}`);
    console.log(`   Time: ${result.rows[0].current_time}`);
    console.log(`   Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    
    // Test table count
    const tableResult = await localPool.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(`   Tables: ${tableResult.rows[0].table_count}`);
    
    localSuccess = true;
  } catch (error) {
    console.log(`${colors.red}❌ Local connection failed: ${error.message}${colors.reset}`);
  } finally {
    if (localPool) {
      await localPool.end();
    }
  }

  // Summary
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}📊 Summary${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  console.log(`Primary (Neon):   ${neonSuccess ? colors.green + '✅ Connected' : colors.red + '❌ Failed'}${colors.reset}`);
  console.log(`Fallback (Local): ${localSuccess ? colors.green + '✅ Connected' : colors.red + '❌ Failed'}${colors.reset}`);
  
  if (neonSuccess) {
    console.log(`\n${colors.green}✅ System will use Neon database (primary)${colors.reset}`);
  } else if (localSuccess) {
    console.log(`\n${colors.yellow}⚠️  System will use Local database (fallback)${colors.reset}`);
  } else {
    console.log(`\n${colors.red}❌ Both databases are unavailable!${colors.reset}`);
    process.exit(1);
  }
  
  console.log('');
}

// Run the test
testNeonConnection()
  .then(() => {
    console.log(`${colors.green}✅ Connection test completed${colors.reset}\n`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`${colors.red}❌ Test failed:${colors.reset}`, error);
    process.exit(1);
  });
