// =====================================================
// Database Configuration for Next.js 16 App Router
// PostgreSQL connection with Neon (primary) and local fallback
// =====================================================

import { Pool } from 'pg';

// Environment variables configuration
const config = {
  // Primary Database Configuration (Neon)
  primary: process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Neon
    },
    max: parseInt(process.env.DB_POOL_SIZE || '20'),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  } : {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'xheton_db',
    user: process.env.DB_USER || 'xhenvolt',
    password: process.env.DB_PASSWORD || '',
    max: parseInt(process.env.DB_POOL_SIZE || '20'),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
  
  // Fallback (Local) Database Configuration
  fallback: {
    host: process.env.DB_FALLBACK_HOST || 'localhost',
    port: parseInt(process.env.DB_FALLBACK_PORT || '5432'),
    database: process.env.DB_FALLBACK_NAME || 'xheton_db',
    user: process.env.DB_FALLBACK_USER || 'xhenvolt',
    password: process.env.DB_FALLBACK_PASSWORD || 'xhenvolt123',
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
      console.error('❌ Primary database (Neon) pool error:', err.message);
      // Automatically switch to fallback on critical errors
      if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND') {
        switchToFallback();
      }
    });
    
    primaryPool.on('connect', () => {
      console.log('✅ Connected to primary database (Neon)');
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
      console.error('❌ Fallback database (Local) pool error:', err.message);
    });
    
    fallbackPool.on('connect', () => {
      console.log('✅ Connected to fallback database (Local PostgreSQL)');
    });
  }
  
  return fallbackPool;
}

/**
 * Switch to fallback database
 */
function switchToFallback() {
  console.warn('⚠️ Primary database (Neon) unavailable. Switching to fallback (Local)...');
  currentPool = 'fallback';
  initFallbackPool();
}

/**
 * Switch back to primary database
 */
function switchToPrimary() {
  console.log('🔄 Switching back to primary database (Neon)...');
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
      console.warn(`⚠️ Slow query (${duration}ms):`, text.substring(0, 100));
    }
    
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error.message);
    
    // Try fallback if primary fails with connection errors
    if (currentPool === 'primary' && 
        (error.code === 'ECONNREFUSED' || 
         error.code === 'ETIMEDOUT' || 
         error.code === 'ENOTFOUND' ||
         error.message?.includes('connect'))) {
      console.log('🔄 Retrying with fallback database (Local)...');
      switchToFallback();
      try {
        return await getPool().query(text, params);
      } catch (fallbackError) {
        console.error('❌ Fallback database also failed:', fallbackError.message);
        throw fallbackError;
      }
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
