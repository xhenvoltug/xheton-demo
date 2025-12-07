# Database Quick Reference

## Quick Start Commands

```bash
# 1. Install Database
cd /home/xhenvolt/projects/xheton/database
psql -U postgres -f install.sql

# 2. Setup Environment
cp .env.example .env
nano .env  # Edit with your credentials

# 3. Install API Dependencies
cd ../api
npm install

# 4. Test Connection
npm test

# 5. Start API Server
npm start
```

## Common psql Commands

```sql
-- Connect to database
\c xheton_db

-- List all tables
\dt

-- Describe table structure
\d users
\d sales_orders

-- List all schemas
\dn

-- List all views
\dv

-- Show table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;

-- Count records in all tables
SELECT 
  'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'sales_orders', COUNT(*) FROM sales_orders;
```

## File Structure

```
/home/xhenvolt/projects/xheton/
├── database/
│   ├── schema_core.sql              # Core tables (Users, Products, Sales, etc.)
│   ├── schema_additional.sql        # Accounting, HR, Payroll, Projects
│   ├── schema_future_landing.sql    # Future modules & Landing CMS
│   ├── install.sql                  # Master installation script
│   ├── config.js                    # Database connection config
│   ├── .env.example                 # Environment template
│   └── README.md                    # Full documentation
│
├── api/
│   ├── server.js                    # Express API server
│   ├── test-connection.js           # Connection test script
│   ├── package.json                 # Node.js dependencies
│   └── .env                         # API configuration
│
└── src/                             # Next.js frontend (existing)
```

## Table Count by Module

| Module | Tables | Status |
|--------|--------|--------|
| Core System | 10 | ✅ Active |
| Users & Auth | 5 | ✅ Active |
| Subscription & Billing | 6 | ✅ Active |
| Customers & Suppliers | 3 | ✅ Active |
| Products & Inventory | 14 | ✅ Active |
| Sales | 5 | ✅ Active |
| Procurement | 9 | ✅ Active |
| Accounting | 11 | ✅ Active |
| HR & Payroll | 12 | ✅ Active |
| Projects | 3 | ✅ Active |
| Notifications | 6 | ✅ Active |
| Audit & Monitoring | 3 | ✅ Active |
| Delivery | 3 | ✅ Active |
| CRM | 3 | ✅ Active |
| Documents | 3 | ✅ Active |
| Automation | 2 | ✅ Active |
| **Subtotal Current** | **98** | ✅ |
| Manufacturing | 4 | 🔧 Scaffold |
| Quality Control | 2 | 🔧 Scaffold |
| Asset Management | 4 | 🔧 Scaffold |
| Advanced Features | 5 | 🔧 Scaffold |
| Landing Page CMS | 15 | 🌐 Ready |
| **Total Tables** | **150+** | |

## API Endpoints Reference

### Health & Testing
- `GET /api/health` - System health check
- `GET /api/test/connection` - Database connection test
- `GET /api/stats/database` - Database statistics

### Users CRUD
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Soft delete user

### Transactions
- `POST /api/test/transaction` - Test transaction handling

## Default Data Inserted

### Roles
- Super Admin
- Admin
- Manager
- Sales
- Warehouse
- Accountant
- Viewer

### Subscription Plans
- Starter: UGX 120,000/month
- Business: UGX 350,000/month (Most Popular)
- Enterprise: UGX 900,000/month

### Permissions/Modules
- Dashboard
- Sales Management
- Customer Management
- Purchase Management
- Inventory Management
- Accounting
- HR & Payroll
- Reports
- Settings
- User Management

## Backup Commands

```bash
# Create backup
pg_dump -U postgres xheton_db > backup_$(date +%Y%m%d).sql

# Compressed backup
pg_dump -U postgres xheton_db | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore
psql -U postgres xheton_db < backup_20251207.sql
```

## Troubleshooting Quick Fixes

```bash
# PostgreSQL not running
sudo systemctl start postgresql

# Check PostgreSQL status
sudo systemctl status postgresql

# Reset postgres password
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'newpassword';

# Kill process on port 3001
sudo lsof -i :3001
kill -9 <PID>

# Reinstall npm packages
cd api && rm -rf node_modules && npm install
```

## Currency Format

All monetary values stored as `DECIMAL(15,2)` in **Uganda Shillings (UGX)** only.

Examples:
- UGX 120,000 → `120000.00`
- UGX 1,500,000 → `1500000.00`

## Next.js Integration Example

```javascript
// /src/lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result.rows;
}
```

```javascript
// /src/app/api/users/route.js
import { query } from '@/lib/db';

export async function GET() {
  const users = await query('SELECT * FROM users WHERE deleted_at IS NULL');
  return Response.json({ success: true, data: users });
}
```
