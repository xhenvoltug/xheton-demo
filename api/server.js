// =====================================================
// XHETON Test API Server
// Simple API endpoint for database connectivity testing
// =====================================================

require('dotenv').config({ path: '../database/.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('../database/config');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// =====================================================
// TEST ENDPOINTS
// =====================================================

/**
 * Health Check Endpoint
 * GET /api/health
 */
app.get('/api/health', async (req, res) => {
  try {
    const health = await db.healthCheck();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      service: 'XHETON API v0.0.014',
      database: health
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error.message
    });
  }
});

/**
 * Database Connection Test
 * GET /api/test/connection
 */
app.get('/api/test/connection', async (req, res) => {
  try {
    const primaryTest = await db.testConnection('primary');
    const fallbackTest = await db.testConnection('fallback');
    
    res.json({
      success: true,
      primary: primaryTest,
      fallback: fallbackTest,
      poolStats: db.getPoolStats()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Connection test failed',
      message: error.message
    });
  }
});

/**
 * Get All Users (CRUD Read Example)
 * GET /api/users
 */
app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT 
        id, 
        username, 
        email, 
        first_name, 
        last_name, 
        is_active,
        created_at,
        updated_at
      FROM users 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 50`
    );
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

/**
 * Get User by ID (CRUD Read Single)
 * GET /api/users/:id
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { rows } = await db.query(
      `SELECT 
        id, 
        username, 
        email, 
        first_name, 
        last_name, 
        phone,
        is_active,
        created_at,
        updated_at
      FROM users 
      WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

/**
 * Create User (CRUD Create Example)
 * POST /api/users
 * Body: { username, email, password, first_name, last_name, phone }
 */
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, phone } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }
    
    // Hash password (in production, use bcrypt)
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(password, 10);
    
    const { rows } = await db.query(
      `INSERT INTO users (
        username, 
        email, 
        password_hash, 
        first_name, 
        last_name, 
        phone,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING id, username, email, first_name, last_name, phone, created_at`,
      [username, email, password_hash, first_name, last_name, phone]
    );
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: rows[0]
    });
  } catch (error) {
    // Handle unique constraint violations
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Username or email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error.message
    });
  }
});

/**
 * Update User (CRUD Update Example)
 * PUT /api/users/:id
 * Body: { first_name, last_name, phone }
 */
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone } = req.body;
    
    const { rows } = await db.query(
      `UPDATE users 
      SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        updated_at = NOW()
      WHERE id = $4 AND deleted_at IS NULL
      RETURNING id, username, email, first_name, last_name, phone, updated_at`,
      [first_name, last_name, phone, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
});

/**
 * Delete User (CRUD Delete - Soft Delete Example)
 * DELETE /api/users/:id
 */
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { rows } = await db.query(
      `UPDATE users 
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, username`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

/**
 * Get Database Statistics
 * GET /api/stats/database
 */
app.get('/api/stats/database', async (req, res) => {
  try {
    const tableStats = await db.query(`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      LIMIT 10
    `);
    
    const tableCount = await db.query(`
      SELECT COUNT(*) as total_tables 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    
    const recordCounts = await db.query(`
      SELECT 
        'users' as table_name, COUNT(*) as count FROM users WHERE deleted_at IS NULL
      UNION ALL
      SELECT 'customers', COUNT(*) FROM customers WHERE deleted_at IS NULL
      UNION ALL
      SELECT 'suppliers', COUNT(*) FROM suppliers WHERE deleted_at IS NULL
      UNION ALL
      SELECT 'products', COUNT(*) FROM products WHERE deleted_at IS NULL
      UNION ALL
      SELECT 'sales_orders', COUNT(*) FROM sales_orders WHERE deleted_at IS NULL
    `);
    
    res.json({
      success: true,
      stats: {
        totalTables: tableCount.rows[0].total_tables,
        topTables: tableStats.rows,
        recordCounts: recordCounts.rows,
        poolStats: db.getPoolStats()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch database statistics',
      message: error.message
    });
  }
});

/**
 * Transaction Example
 * POST /api/test/transaction
 */
app.post('/api/test/transaction', async (req, res) => {
  try {
    const result = await db.transaction(async (client) => {
      // Example: Create a customer and log the action
      const customerResult = await client.query(
        `INSERT INTO customers (customer_code, customer_name, email, phone, is_active)
         VALUES ($1, $2, $3, $4, true)
         RETURNING id, customer_code, customer_name`,
        [`CUST-${Date.now()}`, 'Test Customer', 'test@example.com', '+256700000000']
      );
      
      // Log in audit
      await client.query(
        `INSERT INTO audit_logs (action, entity_type, entity_id, new_values)
         VALUES ($1, $2, $3, $4)`,
        ['create', 'customers', customerResult.rows[0].id, JSON.stringify(customerResult.rows[0])]
      );
      
      return customerResult.rows[0];
    });
    
    res.json({
      success: true,
      message: 'Transaction completed successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Transaction failed',
      message: error.message
    });
  }
});

// =====================================================
// ERROR HANDLERS
// =====================================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =====================================================
// SERVER STARTUP
// =====================================================

const server = app.listen(PORT, async () => {
  console.log('\n===========================================');
  console.log(`🚀 XHETON Test API Server v0.0.014`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('===========================================\n');
  
  // Test database connection on startup
  try {
    const health = await db.healthCheck();
    console.log('✅ Database Health Check:');
    console.log(`   Primary: ${health.primary.success ? '✓ Connected' : '✗ Failed'}`);
    console.log(`   Fallback: ${health.fallback.success ? '✓ Connected' : '✗ Failed'}`);
    console.log(`   Active Pool: ${health.currentActive}\n`);
    
    console.log('📋 Available Endpoints:');
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   GET  http://localhost:${PORT}/api/test/connection`);
    console.log(`   GET  http://localhost:${PORT}/api/users`);
    console.log(`   GET  http://localhost:${PORT}/api/users/:id`);
    console.log(`   POST http://localhost:${PORT}/api/users`);
    console.log(`   PUT  http://localhost:${PORT}/api/users/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/users/:id`);
    console.log(`   GET  http://localhost:${PORT}/api/stats/database`);
    console.log(`   POST http://localhost:${PORT}/api/test/transaction\n`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n⚠️  SIGTERM received, closing server gracefully...');
  
  server.close(async () => {
    console.log('✅ HTTP server closed');
    await db.closeAll();
    console.log('✅ Database connections closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('\n⚠️  SIGINT received, closing server gracefully...');
  
  server.close(async () => {
    console.log('✅ HTTP server closed');
    await db.closeAll();
    console.log('✅ Database connections closed');
    process.exit(0);
  });
});

module.exports = app;
