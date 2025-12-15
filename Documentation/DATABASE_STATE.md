# XHETON Database State - December 13, 2025

## ✅ Database Refresh Complete

### Database Status
- **Database**: xheton_db (PostgreSQL, Local)
- **Host**: localhost:5432
- **User**: xhenvolt
- **Status**: Fresh, fully populated with seed data

### Backup Information
- **Backup Location**: `database/backups/xheton_db_backup_20251213_154355.sql`
- **Backup Size**: 8.5 KB
- **Original Export**: Full database exported before refresh

---

## 📊 Current Data Summary

| Entity | Count | Notes |
|--------|-------|-------|
| **Roles** | 4 | Administrator, Manager, Staff, Viewer |
| **Permissions** | 12 | CRUD for inventory, purchases, sales |
| **Suppliers** | 3 | Test suppliers for procurement |
| **Customers** | 3 | Test customers for sales orders |
| **Warehouses** | 2 | Main & Branch warehouses |
| **Product Categories** | 3 | Antibiotics, Antivirals, Analgesics |
| **Landing Pricing Plans** | 4 | Free Trial, Starter, Business, Enterprise |
| **Subscription Plans** | 4 | Same tiers for onboarding API |

---

## 💰 Pricing Plans

All pricing in **Uganda Shillings (UGX)**

### Landing Pricing Plans
Displayed on public pricing page (`landing_pricing_plans` table)

| Plan | Monthly | Annual | Annual Saving | Users | Storage | Popular |
|------|---------|--------|---------------|-------|---------|---------|
| **Free Trial** | UGX 0 | UGX 0 | - | 2 | 500 MB | ❌ |
| **Starter** | UGX 150,000 | UGX 1,500,000 | 17% | 3 | 5 GB | ❌ |
| **Business** | UGX 350,000 | UGX 3,500,000 | 17% | 10 | 25 GB | ⭐ |
| **Enterprise** | UGX 750,000 | UGX 7,500,000 | 17% | 50 | 100 GB | ❌ |

### Subscription Plans
Used by onboarding & billing APIs (`subscription_plans` table)

| Plan | Monthly | Annual | Users | Branches | Storage |
|------|---------|--------|-------|----------|---------|
| **Free Trial** | UGX 0 | UGX 0 | 5 | 1 | 10 GB |
| **Starter** | UGX 150,000 | UGX 1,500,000 | 3 | 1 | 5 GB |
| **Business** | UGX 350,000 | UGX 3,500,000 | 10 | 3 | 25 GB |
| **Enterprise** | UGX 750,000 | UGX 7,500,000 | 50 | 10 | 100 GB |

---

## 🔄 Re-seeding the Database

### Complete Database Refresh
```bash
bash scripts/refresh-db.sh
```
This will:
- Export current database to `database/backups/`
- Drop and recreate xheton_db
- Reapply all schema files
- Seed roles, permissions, test data, and pricing plans

### Seed Individual Components
```bash
# Core data (roles, permissions, suppliers, customers, etc.)
node scripts/seed-db-fresh.js

# Pricing plans only
node scripts/seed-pricing-plans.js
```

---

## 📁 Seeding Scripts

### `/scripts/refresh-db.sh`
- **Purpose**: Complete database refresh workflow
- **Actions**: Export → Drop → Create → Seed
- **Usage**: `bash scripts/refresh-db.sh`

### `/scripts/seed-db-fresh.js`
- **Purpose**: Populate roles, permissions, and test data
- **Populates**: 4 roles, 12 permissions, 3 suppliers, 3 customers, 2 warehouses, 3 categories
- **Usage**: `node scripts/seed-db-fresh.js`

### `/scripts/seed-pricing-plans.js`
- **Purpose**: Populate pricing plans
- **Populates**: 4 plans in both landing_pricing_plans and subscription_plans tables
- **Usage**: `node scripts/seed-pricing-plans.js`

---

## 🗄️ Schema Files Applied

1. **schema_core.sql** - Core business tables
   - Roles, Permissions, Users, Subscriptions
   - Suppliers, Customers, Warehouses, Products
   - Inventory, Sales, Purchases, Accounting

2. **schema_additional.sql** - Additional modules
   - HR, Payroll, Projects, Audit logs
   - Notifications, Messages, Documents

3. **schema_future_landing.sql** - Landing page & future features
   - Landing page sections, testimonials, pricing plans
   - Onboarding progress tracking

---

## ✨ Features Ready

### Core Modules
- ✅ Inventory Management (CRUD, stock movements)
- ✅ Purchases (PO, GRN, Supplier invoices)
- ✅ Sales (Orders, Deliveries, Returns)
- ✅ Accounting (Chart of Accounts, Journals, Statements)
- ✅ User Authentication & Authorization

### Pricing & Billing
- ✅ 4 Tiered pricing plans
- ✅ Free trial support
- ✅ Annual discount (17%)
- ✅ User/branch/storage limits per plan

### API Endpoints
- ✅ 22 endpoints (Inventory, Purchases, Sales)
- ✅ Full CRUD operations
- ✅ Transaction support
- ✅ Permission-based access control

---

## 🚀 Next Steps

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Onboarding Flow**
   - SignUp → Plan Selection → Free Trial/Paid Plan

3. **Test API Endpoints**
   - Use provided API testing guide
   - All 22 endpoints ready for testing

4. **Customize Pricing** (if needed)
   ```bash
   # Edit pricing in database
   psql -h localhost -U xhenvolt -d xheton_db
   UPDATE subscription_plans SET price_monthly = ... WHERE plan_code = 'STARTER';
   ```

---

## 📞 Database Connection

### Local Connection
```
Host: localhost
Port: 5432
User: xhenvolt
Password: xhenvolt123 (from .env: DB_FALLBACK_PASSWORD)
Database: xheton_db
```

### Using psql
```bash
PGPASSWORD=xhenvolt123 psql -h localhost -U xhenvolt -d xheton_db
```

---

## ⚠️ Important Notes

- Database is **completely fresh** and ready for development
- All **backup preserved** for rollback if needed
- **Neon cloud database** is separate (check DATABASE_URL in .env)
- All **seeding scripts are idempotent** (safe to re-run)
- **No API test accounts created** (sign up through onboarding)

---

Generated: December 13, 2025
XHETON v0.0.014
