// =====================================================
// Database Configuration
// Supports PostgreSQL with fallback to local database
// =====================================================

const { Pool } = require('pg');

// Environment variables configuration
const config = {
  // Primary (Internet) Database Configuration
  primary: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'xheton_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: parseInt(process.env.DB_POOL_SIZE || '20'), // Connection pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
  
  // Fallback (Local) Database Configuration
  fallback: {
    host: process.env.DB_FALLBACK_HOST || 'localhost',
    port: parseInt(process.env.DB_FALLBACK_PORT || '5432'),
    database: process.env.DB_FALLBACK_NAME || 'xheton_local_db',
    user: process.env.DB_FALLBACK_USER || 'postgres',
    password: process.env.DB_FALLBACK_PASSWORD || 'postgres',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  }
};

// Primary database pool
let primaryPool = null;
let fallbackPool = null;
let currentPool = 'primary';

/**
 * Initialize primary database connection pool
 */
function initPrimaryPool() {
  if (!primaryPool) {
    primaryPool = new Pool(config.primary);
    
    primaryPool.on('error', (err) => {
      console.error('Primary database pool error:', err);
      // Automatically switch to fallback on critical errors
      if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        switchToFallback();
      }
    });
    
    primaryPool.on('connect', () => {
      console.log('Connected to primary database');
    });
  }
  
  return primaryPool;
}

/**
 * Initialize fallback database connection pool
 */
function initFallbackPool() {
  if (!fallbackPool) {
    fallbackPool = new Pool(config.fallback);
    
    fallbackPool.on('error', (err) => {
      console.error('Fallback database pool error:', err);
    });
    
    fallbackPool.on('connect', () => {
      console.log('Connected to fallback database');
    });
  }
  
  return fallbackPool;
}

/**
 * Switch to fallback database
 */
function switchToFallback() {
  console.warn('Switching to fallback database...');
  currentPool = 'fallback';
  initFallbackPool();
}

/**
 * Switch back to primary database
 */
function switchToPrimary() {
  console.log('Switching to primary database...');
  currentPool = 'primary';
  initPrimaryPool();
}

/**
 * Get current active database pool
 */
function getPool() {
  if (currentPool === 'primary') {
    return primaryPool || initPrimaryPool();
  } else {
    return fallbackPool || initFallbackPool();
  }
}

/**
 * Test database connection
 */
async function testConnection(poolType = 'primary') {
  try {
    const pool = poolType === 'primary' ? initPrimaryPool() : initFallbackPool();
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    client.release();
    
    return {
      success: true,
      poolType,
      currentTime: result.rows[0].current_time,
      version: result.rows[0].pg_version
    };
  } catch (error) {
    return {
      success: false,
      poolType,
      error: error.message
    };
  }
}

/**
 * Execute query with automatic fallback
 */
async function query(text, params) {
  const pool = getPool();
  
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error(`Query error on ${currentPool} database:`, error.message);
    
    // If primary fails, try fallback
    if (currentPool === 'primary') {
      console.warn('Attempting query on fallback database...');
      switchToFallback();
      
      try {
        const fallbackResult = await fallbackPool.query(text, params);
        return fallbackResult;
      } catch (fallbackError) {
        console.error('Fallback database query also failed:', fallbackError.message);
        throw fallbackError;
      }
    } else {
      throw error;
    }
  }
}

/**
 * Execute transaction with automatic rollback on error
 */
async function transaction(callback) {
  const pool = getPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction rolled back:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Close all database connections
 */
async function closeAll() {
  const promises = [];
  
  if (primaryPool) {
    promises.push(primaryPool.end());
  }
  
  if (fallbackPool) {
    promises.push(fallbackPool.end());
  }
  
  await Promise.all(promises);
  console.log('All database connections closed');
}

/**
 * Get connection pool statistics
 */
function getPoolStats() {
  const pool = getPool();
  
  return {
    currentPool,
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
}

/**
 * Health check for both databases
 */
async function healthCheck() {
  const primaryHealth = await testConnection('primary');
  const fallbackHealth = await testConnection('fallback');
  
  return {
    primary: primaryHealth,
    fallback: fallbackHealth,
    currentActive: currentPool
  };
}

// Initialize primary pool on module load
initPrimaryPool();

module.exports = {
  query,
  transaction,
  getPool,
  testConnection,
  healthCheck,
  switchToFallback,
  switchToPrimary,
  getPoolStats,
  closeAll,
  config
};
