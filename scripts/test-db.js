#!/usr/bin/env node
// =====================================================
// Standalone Database Connection Test
// Run: node scripts/test-db.js
// =====================================================

require('dotenv').config();
const { Pool } = require('pg');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'xheton_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

async function testConnection() {
  console.log('\n===========================================');
  console.log('XHETON Database Connection Test');
  console.log('===========================================\n');
  
  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Database: ${config.database}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Password: ${config.password ? '****' : 'Not set'}\n`);
  
  const pool = new Pool(config);
  
  try {
    console.log('Attempting to connect...\n');
    
    // Test 1: Basic Connection
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!\n');
    
    // Test 2: Get PostgreSQL Version
    const versionResult = await client.query('SELECT version()');
    console.log('PostgreSQL Version:');
    console.log(`  ${versionResult.rows[0].version}\n`);
    
    // Test 3: Get Current Time
    const timeResult = await client.query('SELECT NOW() as current_time');
    console.log('Current Database Time:');
    console.log(`  ${timeResult.rows[0].current_time}\n`);
    
    // Test 4: Check if database exists
    const dbCheckResult = await client.query(
      'SELECT datname FROM pg_database WHERE datname = $1',
      [config.database]
    );
    
    if (dbCheckResult.rows.length > 0) {
      console.log(`✅ Database '${config.database}' exists\n`);
    } else {
      console.log(`⚠️  Database '${config.database}' not found\n`);
    }
    
    // Test 5: Count tables
    const tableCountResult = await client.query(
      `SELECT COUNT(*) as table_count 
       FROM information_schema.tables 
       WHERE table_schema = 'public'`
    );
    
    console.log('Database Schema:');
    console.log(`  Tables in 'public' schema: ${tableCountResult.rows[0].table_count}\n`);
    
    // Test 6: List first 10 tables
    const tablesResult = await client.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name 
       LIMIT 10`
    );
    
    if (tablesResult.rows.length > 0) {
      console.log('Sample Tables (first 10):');
      tablesResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.table_name}`);
      });
      console.log('');
    }
    
    client.release();
    
    console.log('===========================================');
    console.log('✅ All tests passed successfully!');
    console.log('===========================================\n');
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection failed!\n');
    console.error('Error Details:');
    console.error(`  Code: ${error.code || 'N/A'}`);
    console.error(`  Message: ${error.message}\n`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Troubleshooting:');
      console.error('  1. Ensure PostgreSQL is running');
      console.error('  2. Check if the host and port are correct');
      console.error('  3. Verify firewall settings\n');
    } else if (error.code === '28P01') {
      console.error('Troubleshooting:');
      console.error('  1. Check username and password');
      console.error('  2. Verify pg_hba.conf authentication settings\n');
    } else if (error.code === '3D000') {
      console.error('Troubleshooting:');
      console.error(`  1. Database '${config.database}' does not exist`);
      console.error('  2. Create the database first or check the DB_NAME in .env\n');
    }
    
    console.log('===========================================\n');
    
    await pool.end();
    process.exit(1);
  }
}

testConnection();
