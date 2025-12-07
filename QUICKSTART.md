# 🚀 Quick Start - PostgreSQL Database Connection

## ⚡ Fast Setup (2 Minutes)

### 1. Update Password in `.env`
```bash
nano .env
```

Change this line:
```env
DB_PASSWORD=your_password  # ❌ Change this!
```

To your actual PostgreSQL password:
```env
DB_PASSWORD=your_actual_password  # ✅ Your real password
```

Save and exit (Ctrl+X, Y, Enter)

### 2. Test Connection
```bash
npm run test:db
```

**Expected Output:**
```
✅ Successfully connected to PostgreSQL!
PostgreSQL Version: PostgreSQL 14.x...
✅ Database 'xheton_db' exists
✅ All tests passed successfully!
```

**If you see errors**, follow the detailed setup in `DATABASE_SETUP.md`

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test API Endpoints

Open your browser:

- **Health Check:** http://localhost:3000/api/health
- **Database Test:** http://localhost:3000/api/test/db
- **Users API:** http://localhost:3000/api/users

---

## 📋 Checklist

- [ ] Updated `DB_PASSWORD` in `.env`
- [ ] PostgreSQL is running
- [ ] `npm run test:db` passed
- [ ] `npm run dev` started successfully
- [ ] `/api/health` returns success
- [ ] `/api/test/db` returns success

---

## ❌ Common Issues

### "password authentication failed"
**Fix:** Update `DB_PASSWORD` in `.env` with correct password

### "database does not exist"
**Fix:** Create database:
```bash
sudo -i -u postgres
psql
CREATE DATABASE xheton_db;
\q
exit
```

### "connection refused"
**Fix:** Start PostgreSQL:
```bash
sudo systemctl start postgresql
```

---

## 📚 Need More Help?

- **Full Setup:** See `DATABASE_SETUP.md`
- **API Docs:** See `src/app/api/README.md`
- **Database Info:** See `database/README.md`
- **Summary:** See `DATABASE_CONFIGURATION_SUMMARY.md`

---

**Ready to code! 🎉**
