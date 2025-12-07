// =====================================================
// Database Configuration for Next.js 16 App Router
// PostgreSQL connection with connection pooling
// =====================================================

import { Pool } from 'pg';

// Environment variables configuration
const config = {
  // Primary Database Configuration
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

// Global pools for connection reuse across requests
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
      console.log('✅ Connected to primary database');
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
      console.log('✅ Connected to fallback database');
    });
  }
  
  return fallbackPool;
}

/**
 * Switch to fallback database
 */
function switchToFallback() {
  console.warn('⚠️ Switching to fallback database...');
  currentPool = 'fallback';
  initFallbackPool();
}

/**
 * Switch back to primary database
 */
function switchToPrimary() {
  console.log('🔄 Switching to primary database...');
  currentPool = 'primary';
  initPrimaryPool();
}

/**
 * Get the active database pool
 */
function getPool() {
  if (currentPool === 'primary') {
    return initPrimaryPool();
  } else {
    return initFallbackPool();
  }
}

/**
 * Execute a database query
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
export async function query(text, params) {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.warn(`⚠️ Slow query (${duration}ms):`, text);
    }
    
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    
    // Try fallback if primary fails
    if (currentPool === 'primary') {
      console.log('🔄 Retrying with fallback database...');
      switchToFallback();
      return await getPool().query(text, params);
    }
    
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Database client
 */
export async function getClient() {
  const pool = getPool();
  return await pool.connect();
}

/**
 * Test database connection
 * @param {string} poolType - 'primary' or 'fallback'
 * @returns {Promise} Connection test result
 */
export async function testConnection(poolType = 'primary') {
  try {
    const pool = poolType === 'primary' ? initPrimaryPool() : initFallbackPool();
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    
    return {
      success: true,
      pool: poolType,
      currentTime: result.rows[0].current_time,
      version: result.rows[0].version
    };
  } catch (error) {
    return {
      success: false,
      pool: poolType,
      error: error.message
    };
  }
}

/**
 * Health check for the database
 * @returns {Promise} Health status
 */
export async function healthCheck() {
  const primaryStatus = await testConnection('primary');
  const fallbackStatus = await testConnection('fallback');
  
  return {
    primary: primaryStatus,
    fallback: fallbackStatus,
    active: currentPool
  };
}

/**
 * Close all database connections (for graceful shutdown)
 */
export async function closeAll() {
  const promises = [];
  
  if (primaryPool) {
    promises.push(primaryPool.end());
  }
  
  if (fallbackPool) {
    promises.push(fallbackPool.end());
  }
  
  await Promise.all(promises);
  console.log('✅ All database connections closed');
}

// Initialize primary pool on module load
initPrimaryPool();

// Export utility functions
export default {
  query,
  getClient,
  testConnection,
  healthCheck,
  closeAll,
  switchToPrimary,
  switchToFallback
};
