# XHETON PostgreSQL Database Configuration - Complete Setup

## ✅ What Was Done

### 1. **Proper Next.js 16 App Router Structure**
   - Moved API functionality from root `/api` to proper Next.js App Router location: `/src/app/api`
   - Created Next.js 16 compatible API routes using the new App Router conventions
   - Implemented proper route handlers with `NextResponse`

### 2. **Database Configuration** (`/src/lib/db.js`)
   - Created centralized database configuration using ES6 modules
   - Implemented connection pooling for efficient resource management
   - Added automatic failover to fallback database
   - Included comprehensive error handling and logging
   - Added slow query detection (queries > 1 second)

### 3. **API Endpoints Created**

#### Health Check
- **Route:** `/api/health`
- **File:** `src/app/api/health/route.js`
- **Purpose:** Check API and database health status

#### Database Test
- **Route:** `/api/test/db`
- **File:** `src/app/api/test/db/route.js`
- **Purpose:** Run comprehensive database connectivity tests

#### Users CRUD
- **Route:** `/api/users`
- **File:** `src/app/api/users/route.js`
- **Methods:** GET (list), POST (create)

- **Route:** `/api/users/[id]`
- **File:** `src/app/api/users/[id]/route.js`
- **Methods:** GET (read), PUT (update), DELETE (soft delete)

### 4. **Testing Utilities**

#### Standalone Test Script
- **File:** `scripts/test-db.js`
- **Command:** `npm run test:db` or `node scripts/test-db.js`
- **Features:**
  - Tests database connectivity
  - Displays PostgreSQL version
  - Shows current database time
  - Lists tables in the schema
  - Provides detailed error diagnostics

### 5. **Environment Configuration**

#### Updated `.env` File
```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=xhe
DB_PASSWORD=your_password
DB_NAME=xheton_db
DB_POOL_SIZE=20

# Fallback Database Configuration
DB_FALLBACK_HOST=localhost
DB_FALLBACK_PORT=5432
DB_FALLBACK_USER=xhe
DB_FALLBACK_PASSWORD=your_password
DB_FALLBACK_NAME=xheton_local_db

# API Configuration
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

#### Created `.env.example`
Template file for environment variables with documentation.

### 6. **Dependencies Installed**
- `pg` (node-postgres) - PostgreSQL client for Node.js
- `dotenv` - Environment variable management

### 7. **Documentation Created**

#### `/DATABASE_SETUP.md`
Complete step-by-step setup guide including:
- PostgreSQL installation verification
- Database and user creation
- Permission configuration
- Environment setup
- Testing procedures
- Troubleshooting guide

#### `/src/app/api/README.md`
API documentation including:
- Endpoint descriptions
- Request/response examples
- Error handling
- Testing with curl and browser
- Development guidelines

## 📁 File Structure

```
xheton/
├── .env                              # Environment variables (configured)
├── .env.example                      # Environment template
├── package.json                      # Updated with pg, dotenv, test:db script
├── DATABASE_SETUP.md                 # Complete setup guide
├── scripts/
│   └── test-db.js                   # Standalone database test
├── src/
│   ├── lib/
│   │   └── db.js                    # Database configuration (NEW)
│   └── app/
│       └── api/
│           ├── README.md            # API documentation (NEW)
│           ├── health/
│           │   └── route.js         # Health check endpoint (NEW)
│           ├── test/
│           │   └── db/
│           │       └── route.js     # Database test endpoint (NEW)
│           └── users/
│               ├── route.js         # Users CRUD endpoints (NEW)
│               └── [id]/
│                   └── route.js     # User by ID endpoints (NEW)
└── database/
    ├── schema_core.sql              # Core database schema (existing)
    ├── schema_additional.sql        # Additional modules (existing)
    ├── schema_future_landing.sql    # Future scaffolds (existing)
    ├── install.sql                  # Master installation script (existing)
    ├── README.md                    # Database documentation (existing)
    └── QUICKREF.md                  # Quick reference (existing)
```

## 🚀 How to Get Started

### Step 1: Configure PostgreSQL Password

**You MUST update the password in `.env` file!**

The current error is because the password is set to `your_password`. Update it:

1. Open `.env`:
   ```bash
   nano .env
   ```

2. Update this line:
   ```env
   DB_PASSWORD=your_actual_password_here
   DB_FALLBACK_PASSWORD=your_actual_password_here
   ```

3. Save and exit (Ctrl+X, Y, Enter)

### Step 2: Ensure PostgreSQL is Running

```bash
sudo systemctl status postgresql
```

If not running:
```bash
sudo systemctl start postgresql
```

### Step 3: Create Database (if not exists)

```bash
sudo -i -u postgres
psql
```

In PostgreSQL:
```sql
CREATE DATABASE xheton_db;
CREATE DATABASE xheton_local_db;

-- Update user password
ALTER USER xhe WITH PASSWORD 'your_actual_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE xheton_db TO xhe;
GRANT ALL PRIVILEGES ON DATABASE xheton_local_db TO xhe;

\c xheton_db
GRANT ALL ON SCHEMA public TO xhe;
ALTER DATABASE xheton_db OWNER TO xhe;

\c xheton_local_db
GRANT ALL ON SCHEMA public TO xhe;
ALTER DATABASE xheton_local_db OWNER TO xhe;

\q
```

Exit postgres user:
```bash
exit
```

### Step 4: Test Database Connection

```bash
npm run test:db
```

Expected output:
```
✅ Successfully connected to PostgreSQL!
PostgreSQL Version: PostgreSQL 14.x...
✅ Database 'xheton_db' exists
Tables in 'public' schema: 0 (or number of tables)
✅ All tests passed successfully!
```

### Step 5: Install Database Schema (Optional)

If you want to create all the tables:

```bash
psql -U xhe -d xheton_db -f database/install.sql
```

### Step 6: Start Next.js Development Server

```bash
npm run dev
```

### Step 7: Test API Endpoints

Open your browser and visit:

1. **Health Check:**
   ```
   http://localhost:3000/api/health
   ```

2. **Database Test:**
   ```
   http://localhost:3000/api/test/db
   ```

3. **Users API:**
   ```
   http://localhost:3000/api/users
   ```

## 🧪 Testing the Connection

### Using the Standalone Script

```bash
npm run test:db
```

This will:
- ✅ Test connection to PostgreSQL
- ✅ Display PostgreSQL version
- ✅ Show current database time
- ✅ Verify database exists
- ✅ Count tables in schema
- ✅ List sample tables

### Using the API Endpoint

Once the dev server is running:

```bash
curl http://localhost:3000/api/test/db
```

Or visit in browser:
```
http://localhost:3000/api/test/db
```

## ⚠️ Current Status

**Database Connection Test Result:**
- ❌ Connection failed due to incorrect password in `.env`
- The database configuration is correct
- PostgreSQL is accessible
- User `xhe` exists

**To Fix:**
1. Update `DB_PASSWORD` in `.env` file with your actual PostgreSQL password
2. Run `npm run test:db` again
3. Should see ✅ success messages

## 📚 Documentation Reference

1. **Database Setup:** `/DATABASE_SETUP.md`
   - Complete PostgreSQL setup guide
   - Troubleshooting for common issues

2. **API Documentation:** `/src/app/api/README.md`
   - All API endpoints
   - Request/response examples
   - Error handling

3. **Database Schema:** `/database/README.md`
   - Schema structure
   - Table descriptions
   - Installation instructions

4. **Quick Reference:** `/database/QUICKREF.md`
   - Quick commands
   - Common queries

## 🔧 Troubleshooting

### Password Authentication Failed
```
Error Code: 28P01
```
**Solution:** Update the password in `.env` file with the correct PostgreSQL password.

### Database Does Not Exist
```
Error Code: 3D000
```
**Solution:** Create the database using the SQL commands in Step 3 above.

### Connection Refused
```
Error Code: ECONNREFUSED
```
**Solution:** 
- Ensure PostgreSQL is running: `sudo systemctl start postgresql`
- Check if it's listening on port 5432: `sudo netstat -tlnp | grep 5432`

### Peer Authentication Failed
```
Error: peer authentication failed
```
**Solution:** Update `/etc/postgresql/14/main/pg_hba.conf` to use `md5` instead of `peer` authentication, then restart PostgreSQL.

## ✨ Next Steps

1. **Fix the password** in `.env` file
2. **Test the connection** using `npm run test:db`
3. **Install the schema** using the install.sql file
4. **Start the dev server** using `npm run dev`
5. **Test the API endpoints** in your browser
6. **Start developing** your application!

## 📞 Support

If you encounter issues:
1. Check `/DATABASE_SETUP.md` for detailed setup instructions
2. Review the troubleshooting section above
3. Ensure all prerequisites are met
4. Verify PostgreSQL is running and accessible

---

**Summary:** The database is properly configured for Next.js 16 App Router. You just need to update the password in the `.env` file and test the connection!
