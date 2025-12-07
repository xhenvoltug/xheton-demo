#!/usr/bin/env node

// =====================================================
// Next.js 16 PostgreSQL Connection Test Script
// Tests API endpoints connectivity to PostgreSQL
// =====================================================

const http = require('http');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

/**
 * Make HTTP request to test endpoint
 */
function testEndpoint(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Print test result
 */
function printResult(testName, success, message, details = null) {
  const icon = success ? '✓' : '✗';
  const color = success ? colors.green : colors.red;
  
  console.log(`${color}${icon} ${testName}${colors.reset}`);
  console.log(`  ${message}`);
  
  if (details) {
    console.log(`  ${colors.cyan}Details:${colors.reset}`, JSON.stringify(details, null, 2));
  }
  console.log('');
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.bright}${colors.blue}Next.js 16 PostgreSQL Connection Test${colors.reset}`);
  console.log('='.repeat(60) + '\n');

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Health Check Endpoint
  try {
    console.log(`${colors.yellow}[1/3]${colors.reset} Testing Health Check Endpoint...`);
    const result = await testEndpoint('/api/health');
    
    if (result.status === 200 && result.data.success) {
      printResult(
        'Health Check',
        true,
        'API is running and responsive',
        { service: result.data.service, timestamp: result.data.timestamp }
      );
      passedTests++;
    } else {
      printResult(
        'Health Check',
        false,
        `Unexpected response: ${result.status}`,
        result.data
      );
      failedTests++;
    }
  } catch (error) {
    printResult(
      'Health Check',
      false,
      `Error: ${error.message}`,
      null
    );
    failedTests++;
  }

  // Test 2: Database Connection Test Endpoint
  try {
    console.log(`${colors.yellow}[2/3]${colors.reset} Testing Database Connection...`);
    const result = await testEndpoint('/api/test/db');
    
    if (result.status === 200 && result.data.success) {
      printResult(
        'Database Connection',
        true,
        'Successfully connected to PostgreSQL database',
        {
          message: result.data.message,
          tests_passed: result.data.tests?.filter(t => t.success).length || 0,
          total_tests: result.data.tests?.length || 0
        }
      );
      passedTests++;
    } else {
      printResult(
        'Database Connection',
        false,
        'Failed to connect to database',
        result.data
      );
      failedTests++;
    }
  } catch (error) {
    printResult(
      'Database Connection',
      false,
      `Error: ${error.message}`,
      null
    );
    failedTests++;
  }

  // Test 3: Users API Endpoint (GET)
  try {
    console.log(`${colors.yellow}[3/3]${colors.reset} Testing Users API Endpoint...`);
    const result = await testEndpoint('/api/users');
    
    if (result.status === 200 && Array.isArray(result.data.users)) {
      printResult(
        'Users API',
        true,
        'Successfully fetched users from database',
        {
          count: result.data.users.length,
          sample: result.data.users.slice(0, 2),
        }
      );
      passedTests++;
    } else {
      printResult(
        'Users API',
        false,
        `Unexpected response: ${result.status}`,
        result.data
      );
      failedTests++;
    }
  } catch (error) {
    printResult(
      'Users API',
      false,
      `Error: ${error.message}`,
      null
    );
    failedTests++;
  }

  // Summary
  console.log('='.repeat(60));
  console.log(`${colors.bright}Test Summary${colors.reset}`);
  console.log('='.repeat(60));
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`Total: ${passedTests + failedTests}`);
  console.log('='.repeat(60) + '\n');

  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Check if Next.js server is running
console.log(`${colors.cyan}Checking if Next.js server is running on ${BASE_URL}...${colors.reset}\n`);

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
