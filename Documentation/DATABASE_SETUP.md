# XHETON Database Setup Guide

## Prerequisites
- PostgreSQL 12+ installed and running
- Node.js 18+ installed
- Terminal access

## Step 1: Configure PostgreSQL

### Check if PostgreSQL is Running
```bash
sudo systemctl status postgresql
```

If not running, start it:
```bash
sudo systemctl start postgresql
```

### Create Database and User

1. Switch to postgres user:
```bash
sudo -i -u postgres
```

2. Access PostgreSQL:
```bash
psql
```

3. Create the database:
```sql
CREATE DATABASE xheton_db;
CREATE DATABASE xheton_local_db;  -- Fallback database
```

4. Create a user (or use existing):
```sql
-- Create new user
CREATE USER xhe WITH PASSWORD 'your_secure_password';

-- Or update existing user password
ALTER USER xhe WITH PASSWORD 'your_secure_password';
```

5. Grant privileges:
```sql
GRANT ALL PRIVILEGES ON DATABASE xheton_db TO xhe;
GRANT ALL PRIVILEGES ON DATABASE xheton_local_db TO xhe;

-- For PostgreSQL 15+, also grant schema permissions
\c xheton_db
GRANT ALL ON SCHEMA public TO xhe;
ALTER DATABASE xheton_db OWNER TO xhe;

\c xheton_local_db
GRANT ALL ON SCHEMA public TO xhe;
ALTER DATABASE xheton_local_db OWNER TO xhe;
```

6. Exit psql:
```sql
\q
```

7. Exit postgres user:
```bash
exit
```

## Step 2: Update Environment Variables

Edit the `.env` file in the project root:

```bash
nano .env
```

Update the following values:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=xhe
DB_PASSWORD=your_actual_password_here  # Replace with your actual password
DB_NAME=xheton_db
DB_POOL_SIZE=20

DB_FALLBACK_HOST=localhost
DB_FALLBACK_PORT=5432
DB_FALLBACK_USER=xhe
DB_FALLBACK_PASSWORD=your_actual_password_here  # Replace with your actual password
DB_FALLBACK_NAME=xheton_local_db
```

**Important:** Replace `your_actual_password_here` with the actual password you set for the `xhe` user.

## Step 3: Install Database Schema

Run the installation script to create all tables:

```bash
psql -U xhe -d xheton_db -f database/install.sql
```

Enter your password when prompted.

## Step 4: Test Database Connection

Run the standalone test script:

```bash
node scripts/test-db.js
```

Expected output:
```
✅ Successfully connected to PostgreSQL!
PostgreSQL Version: PostgreSQL 14.x...
✅ Database 'xheton_db' exists
Tables in 'public' schema: 150+
✅ All tests passed successfully!
```

## Step 5: Start Next.js Development Server

```bash
npm run dev
```

## Step 6: Test API Endpoints

Once the dev server is running, visit:

### Health Check
```
http://localhost:3000/api/health
```

### Database Test
```
http://localhost:3000/api/test/db
```

### Users API
```
GET http://localhost:3000/api/users
```

## Troubleshooting

### Error: "password authentication failed"
- **Solution:** Update the password in `.env` file with the correct password
- Verify the user exists: `psql -U postgres -c "\du"`

### Error: "database does not exist"
- **Solution:** Create the database as shown in Step 1
- Verify databases exist: `psql -U postgres -l`

### Error: "connection refused"
- **Solution:** Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Check if PostgreSQL is listening on port 5432: `sudo netstat -tlnp | grep 5432`

### Error: "peer authentication failed"
- **Solution:** Update `pg_hba.conf` to use `md5` authentication instead of `peer`
- Location: `/etc/postgresql/14/main/pg_hba.conf` (version may vary)
- Change `local all all peer` to `local all all md5`
- Restart PostgreSQL: `sudo systemctl restart postgresql`

## Verification Checklist

- [ ] PostgreSQL is running
- [ ] Database `xheton_db` exists
- [ ] User `xhe` exists with correct password
- [ ] User has permissions on the database
- [ ] `.env` file has correct credentials
- [ ] `node scripts/test-db.js` runs successfully
- [ ] `npm run dev` starts without errors
- [ ] `/api/health` endpoint responds
- [ ] `/api/test/db` endpoint responds

## Next Steps

After successful setup:
1. Install the database schema using `database/install.sql`
2. Start developing your application
3. Use the API endpoints in `src/app/api/` for database operations

## Support

For more information, see:
- `/database/README.md` - Detailed database documentation
- `/database/QUICKREF.md` - Quick reference guide
- `/DATABASE_DELIVERY_SUMMARY.md` - Complete delivery summary
