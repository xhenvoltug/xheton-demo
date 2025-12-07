# XHETON Database Setup & API Testing Guide

**Version:** 0.0.014  
**Date:** December 7, 2025  
**Database:** PostgreSQL 12+  
**Currency:** Uganda Shillings (UGX) Only

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Database Installation](#database-installation)
4. [Database Configuration](#database-configuration)
5. [API Setup & Testing](#api-setup--testing)
6. [Schema Overview](#schema-overview)
7. [Troubleshooting](#troubleshooting)
8. [Migration & Backup](#migration--backup)

---

## 🎯 Overview

This guide will help you set up the complete XHETON database schema with **150+ tables** supporting:

### Current Modules (179 Routes)
- ✅ Sales & Invoicing
- ✅ Customer & Supplier Management
- ✅ Inventory & Stock Control
- ✅ Procurement & Purchase Orders
- ✅ Accounting & Finance
- ✅ HR & Payroll
- ✅ Delivery Management
- ✅ Project Management
- ✅ Notifications & Messaging
- ✅ Audit & System Monitoring
- ✅ Subscription & Billing

### Future Module Scaffolds
- 🔧 Manufacturing & BOM
- 🔧 Quality Control
- 🔧 Asset Management
- 🔧 Multi-Currency Support
- 🔧 Customer Loyalty Programs
- 🔧 IoT/Warehouse Automation
- 🔧 Contract Management

### Landing Page CMS
- 🌐 Site Settings & Branding
- 🌐 Dynamic Page Management
- 🌐 Pricing Plans Editor
- 🌐 Testimonials Manager
- 🌐 Contact Form & Newsletter
- 🌐 Demo Request Tracking
- 🌐 Signup Flow Monitoring

---

## 🔧 Prerequisites

### Required Software

1. **PostgreSQL 12 or higher**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # macOS (using Homebrew)
   brew install postgresql@14
   brew services start postgresql@14
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Node.js 16+ and npm** (for API testing)
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install nodejs
   
   # macOS
   brew install node
   
   # Verify installation
   node --version
   npm --version
   ```

3. **Git** (to clone the repository)
   ```bash
   # Already available if you cloned the repo
   git --version
   ```

### System Requirements
- **RAM:** Minimum 4GB (8GB+ recommended for production)
- **Storage:** 10GB+ free space
- **OS:** Linux, macOS, or Windows with WSL2

---

## 💾 Database Installation

### Step 1: Access PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Or if password authentication is enabled
psql -U postgres
```

### Step 2: Run Installation Script

**Option A: Import via psql command line**

```bash
# Navigate to database directory
cd /home/xhenvolt/projects/xheton/database

# Execute installation script
psql -U postgres -f install.sql
```

**Option B: Import from within psql**

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Execute installation
\i /home/xhenvolt/projects/xheton/database/install.sql
```

**Option C: Step-by-step installation**

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE xheton_db;"

# 2. Connect to database
psql -U postgres -d xheton_db

# 3. Run schema files in order
\i schema_core.sql
\i schema_additional.sql
\i schema_future_landing.sql
```

### Step 3: Verify Installation

```sql
-- Check table count
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Expected result: 150+ tables

-- Check default data
SELECT * FROM roles;
SELECT * FROM subscription_plans;
SELECT * FROM permissions;
```

### Step 4: Create Fallback Database (Optional but Recommended)

```bash
# Create local fallback database
psql -U postgres -c "CREATE DATABASE xheton_local_db;"

# Import schema to fallback
psql -U postgres -d xheton_local_db -f install.sql
```

---

## ⚙️ Database Configuration

### Step 1: Configure Environment Variables

```bash
# Navigate to database directory
cd /home/xhenvolt/projects/xheton/database

# Copy example environment file
cp .env.example .env

# Edit with your credentials
nano .env  # or use your preferred editor
```

### Step 2: Update .env File

```env
# PRIMARY DATABASE (Production/Internet)
DB_HOST=localhost              # Change to your PostgreSQL host
DB_PORT=5432
DB_NAME=xheton_db
DB_USER=postgres
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE  # ⚠️ Change this!
DB_POOL_SIZE=20

# FALLBACK DATABASE (Local)
DB_FALLBACK_HOST=localhost
DB_FALLBACK_PORT=5432
DB_FALLBACK_NAME=xheton_local_db
DB_FALLBACK_USER=postgres
DB_FALLBACK_PASSWORD=YOUR_LOCAL_PASSWORD_HERE

# APPLICATION
NODE_ENV=development
PORT=3001

# SECURITY
JWT_SECRET=your_jwt_secret_min_32_characters_long_here
JWT_EXPIRY=24h
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Set PostgreSQL Password (if not already set)

```bash
# Access PostgreSQL
sudo -u postgres psql

# Set password for postgres user
ALTER USER postgres WITH PASSWORD 'your_secure_password';

# Exit
\q
```

### Step 4: Configure PostgreSQL for Remote Access (Optional)

If you need to access the database from a remote server:

**Edit pg_hba.conf:**
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line (replace with your IP range):
host    all             all             0.0.0.0/0               md5
```

**Edit postgresql.conf:**
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf

# Change listen_addresses:
listen_addresses = '*'
```

**Restart PostgreSQL:**
```bash
sudo systemctl restart postgresql
```

---

## 🚀 API Setup & Testing

### Step 1: Install API Dependencies

```bash
# Navigate to API directory
cd /home/xhenvolt/projects/xheton/api

# Install Node.js dependencies
npm install
```

Expected output:
```
added 85 packages, and audited 86 packages in 8s
found 0 vulnerabilities
```

### Step 2: Test Database Connection

```bash
# Run connection test script
npm test

# Or directly:
node test-connection.js
```

Expected output:
```
===========================================
XHETON Database Connection Test
===========================================

Test 1: Testing Primary Database Connection...
✅ Primary database connected successfully
   Time: 2025-12-07T10:30:45.123Z
   Version: PostgreSQL 14.10...

Test 2: Testing Fallback Database Connection...
✅ Fallback database connected successfully

Test 3: Testing Query Execution...
✅ Query executed successfully
   Total tables in public schema: 152

Test 4: Connection Pool Statistics...
✅ Pool stats retrieved
   Active Pool: primary
   Total Connections: 2
   Idle Connections: 1

Test 5: Checking Core Tables Existence...
   ✅ users: exists
   ✅ customers: exists
   ✅ suppliers: exists
   ✅ products: exists
   ✅ sales_orders: exists
   ✅ purchase_orders: exists

===========================================
✅ All tests completed successfully!
===========================================
```

### Step 3: Start API Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Expected output:
```
===========================================
🚀 XHETON Test API Server v0.0.014
📡 Server running on port 3001
🌍 Environment: development
===========================================

✅ Database Health Check:
   Primary: ✓ Connected
   Fallback: ✓ Connected
   Active Pool: primary

📋 Available Endpoints:
   GET  http://localhost:3001/api/health
   GET  http://localhost:3001/api/test/connection
   GET  http://localhost:3001/api/users
   POST http://localhost:3001/api/users
   PUT  http://localhost:3001/api/users/:id
   DELETE http://localhost:3001/api/users/:id
   GET  http://localhost:3001/api/stats/database
```

### Step 4: Test API Endpoints

**Using cURL:**

```bash
# Health check
curl http://localhost:3001/api/health

# Get all users
curl http://localhost:3001/api/users

# Create a user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@xheton.com",
    "password": "SecurePass123!",
    "first_name": "Admin",
    "last_name": "User",
    "phone": "+256700123456"
  }'

# Database statistics
curl http://localhost:3001/api/stats/database
```

**Using Browser:**

Simply open these URLs in your browser:
- http://localhost:3001/api/health
- http://localhost:3001/api/users
- http://localhost:3001/api/stats/database

**Using Postman/Thunder Client:**

1. Import the following endpoints:
   - GET `http://localhost:3001/api/health`
   - GET `http://localhost:3001/api/users`
   - POST `http://localhost:3001/api/users`
   - PUT `http://localhost:3001/api/users/:id`
   - DELETE `http://localhost:3001/api/users/:id`

---

## 📊 Schema Overview

### Core Tables (50+)

**User Management:**
- `users` - System users and authentication
- `roles` - User roles (Admin, Manager, Sales, etc.)
- `permissions` - Module-level permissions
- `role_permissions` - Permission matrix
- `user_sessions` - Active session tracking

**Subscription & Billing:**
- `subscription_plans` - Pricing tiers (Starter, Business, Enterprise)
- `user_subscriptions` - Active subscriptions
- `payment_methods` - Mobile Money, Bank accounts
- `billing_invoices` - Subscription invoices
- `usage_logs` - Resource usage tracking

**Customer & Supplier:**
- `customers` - Customer master data
- `suppliers` - Supplier information
- `supplier_evaluations` - Supplier ratings

**Product & Inventory:**
- `products` - Product catalog
- `product_categories` - Hierarchical categories
- `product_batches` - Batch/lot tracking
- `warehouses` - Warehouse locations
- `warehouse_locations` - Zones and aisles
- `bins` - Specific storage bins
- `stock_movements` - Inventory movement tracking
- `inventory_adjustments` - Stock corrections
- `inventory_transfers` - Inter-warehouse transfers

**Sales:**
- `sales_orders` - Sales invoices and orders
- `sales_order_items` - Line items
- `sales_returns` - Returns and refunds
- `pos_cash_registers` - POS sessions

**Procurement:**
- `rfqs` - Request for Quotations
- `purchase_orders` - Purchase orders
- `goods_received_notes` - GRN tracking
- `supplier_invoices` - Supplier bills

**Accounting:**
- `chart_of_accounts` - GL accounts
- `bank_accounts` - Cash and bank accounts
- `journal_entries` - Double-entry journals
- `payments` - Customer and supplier payments
- `expenses` - Business expenses
- `budgets` - Budget planning

**HR & Payroll:**
- `employees` - Employee master data
- `attendance_records` - Daily attendance
- `leave_requests` - Time-off requests
- `payroll_periods` - Pay periods
- `payslips` - Employee payslips

**Projects:**
- `projects` - Project tracking
- `project_tasks` - Task breakdown
- `task_time_logs` - Time tracking

**Notifications:**
- `notifications` - User notifications
- `notification_preferences` - Channel settings
- `messages` - Internal messaging

**Audit & Monitoring:**
- `audit_logs` - Complete audit trail
- `system_health_metrics` - Performance monitoring
- `error_logs` - Error tracking

### Future Module Tables (30+)

- Manufacturing (BOM, Work Orders, Machines)
- Quality Control (Inspections, Defects)
- Asset Management (Fixed Assets, Depreciation, Maintenance)
- Loyalty Programs
- IoT Devices
- Contracts

### Landing Page CMS Tables (15+)

- Site Settings
- Landing Pages
- Hero Sections
- Features
- Pricing Plans (Landing)
- Testimonials
- CTA Banners
- FAQs
- Newsletter Subscribers
- Contact Submissions
- Demo Requests
- Signup Tracking
- Onboarding Steps

---

## 🔍 Troubleshooting

### Database Connection Issues

**Problem:** `ECONNREFUSED` or connection timeout

**Solutions:**
```bash
# 1. Check if PostgreSQL is running
sudo systemctl status postgresql

# 2. Start PostgreSQL
sudo systemctl start postgresql

# 3. Check PostgreSQL port
sudo netstat -tulpn | grep 5432

# 4. Verify credentials in .env file
cat /home/xhenvolt/projects/xheton/database/.env
```

### Permission Denied Errors

**Problem:** `permission denied for database` or `role does not exist`

**Solutions:**
```sql
-- Grant all privileges to user
GRANT ALL PRIVILEGES ON DATABASE xheton_db TO postgres;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO postgres;

-- Grant table permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

### Table Already Exists

**Problem:** `relation already exists` during installation

**Solutions:**
```sql
-- Drop and recreate database (⚠️ WARNING: This deletes all data)
DROP DATABASE IF EXISTS xheton_db;
CREATE DATABASE xheton_db;

-- Then re-run installation script
```

### API Server Won't Start

**Problem:** `Error: Cannot find module 'pg'`

**Solutions:**
```bash
# Reinstall dependencies
cd /home/xhenvolt/projects/xheton/api
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use :::3001`

**Solutions:**
```bash
# Find process using port 3001
sudo lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=3002
```

---

## 📦 Migration & Backup

### Create Backup

```bash
# Full database backup
pg_dump -U postgres xheton_db > xheton_backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -U postgres xheton_db | gzip > xheton_backup_$(date +%Y%m%d).sql.gz

# Schema only (no data)
pg_dump -U postgres --schema-only xheton_db > xheton_schema_only.sql

# Data only (no schema)
pg_dump -U postgres --data-only xheton_db > xheton_data_only.sql
```

### Restore Backup

```bash
# Restore full backup
psql -U postgres xheton_db < xheton_backup_20251207.sql

# Restore compressed backup
gunzip -c xheton_backup_20251207.sql.gz | psql -U postgres xheton_db

# Restore to new database
psql -U postgres -c "CREATE DATABASE xheton_restored;"
psql -U postgres xheton_restored < xheton_backup_20251207.sql
```

### Automated Backup Script

Create `/home/xhenvolt/scripts/backup_xheton.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/xhenvolt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="xheton_backup_$DATE.sql.gz"

mkdir -p $BACKUP_DIR
pg_dump -U postgres xheton_db | gzip > "$BACKUP_DIR/$FILENAME"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "xheton_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $FILENAME"
```

Make executable and schedule:
```bash
chmod +x /home/xhenvolt/scripts/backup_xheton.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/xhenvolt/scripts/backup_xheton.sh
```

---

## 🎓 Next Steps

1. **Integrate with Next.js Frontend:**
   - Update `/src/lib/db.js` with connection details
   - Create API routes in `/src/app/api/`
   - Implement authentication middleware

2. **Deploy to Production:**
   - Use managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
   - Set up SSL/TLS connections
   - Configure automatic backups
   - Enable monitoring and alerts

3. **Data Migration:**
   - Import existing customer data
   - Import product catalog
   - Set up initial inventory levels
   - Configure user accounts and roles

4. **Security Hardening:**
   - Enable SSL connections
   - Implement row-level security (RLS)
   - Set up audit logging
   - Regular security patches

---

## 📞 Support

For issues or questions:
- **GitHub Issues:** https://github.com/xhenvoltug/xheton-demo/issues
- **Documentation:** Check `/database/*.sql` files for table comments
- **Database Logs:** `/var/log/postgresql/postgresql-14-main.log`

---

**XHETON Database v0.0.014**  
*Powering Uganda's Next-Generation Business Management Platform*  
*All prices in Uganda Shillings (UGX) only*
