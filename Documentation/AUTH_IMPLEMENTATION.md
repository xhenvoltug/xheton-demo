# XHETON v0.0.012 - Authentication & Onboarding System

## Complete Implementation Documentation

This document describes the complete authentication, onboarding, and subscription gatekeeper system for XHETON.

---

## 🎯 System Overview

XHETON now has a fully functional authentication and subscription management system with the following flow:

```
Landing Page → Signup/Login → Check Status → Onboarding → Plan Selection → Dashboard
```

---

## 📋 Features Implemented

### ✅ 1. Authentication System
- **Email + Password authentication**
- **Password hashing** using bcrypt (12 salt rounds)
- **JWT tokens** stored in HTTP-only cookies
- **Secure session management**
- **Login, Signup, and Logout** functionality

### ✅ 2. Onboarding Flow
- **Step 1: Business Information**
  - Business name
  - Phone number
  - Country selection (default: Uganda)
  - Industry selection
  - Auto-creates default headquarters branch
  
- **Step 2: Plan Selection**
  - View all pricing plans (in UGX)
  - Activate 30-day free trial
  - Select paid plan (redirects to checkout)

### ✅ 3. Subscription Gatekeeper
- **Automatic status checking** on login
- **Trial expiration tracking**
- **Subscription validation**
- **Access control** based on subscription status

### ✅ 4. Route Protection
- **Middleware** for authentication checking
- **Public routes** (landing, login, signup)
- **Auth-only routes** (onboarding)
- **Protected routes** (dashboard, all modules)

### ✅ 5. Database Integration
- **Full PostgreSQL integration**
- **Connection pooling** with primary/fallback
- **Subscription plans** stored in database
- **User subscriptions** tracking
- **Trial management**

---

## 🗂️ File Structure

```
src/
├── lib/
│   ├── auth.js                    # JWT utilities, password hashing
│   ├── subscription.js            # Subscription checking, trial creation
│   └── db.js                      # Database connection (existing)
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js     # POST /api/auth/login
│   │   │   ├── signup/route.js    # POST /api/auth/signup
│   │   │   ├── logout/route.js    # POST /api/auth/logout
│   │   │   └── check-status/route.js  # GET /api/auth/check-status
│   │   │
│   │   └── onboarding/
│   │       ├── start/route.js     # POST /api/onboarding/start
│   │       └── plan/route.js      # GET/POST /api/onboarding/plan
│   │
│   ├── auth/
│   │   ├── login/page.jsx         # Login page
│   │   ├── signup/page.jsx        # Signup page
│   │   ├── check-status/page.jsx  # Status checking page
│   │   └── forgot-password/page.jsx  # Password reset (placeholder)
│   │
│   └── onboarding/
│       ├── start/page.jsx         # Business info collection
│       └── plan/page.jsx          # Plan selection
│
└── middleware.js                  # Route protection middleware

.env                               # Environment variables (JWT_SECRET added)
package.json                       # Version updated to 0.0.012
```

---

## 🔐 Authentication Flow

### 1. User Registration (Signup)

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+256 700 000 000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "user",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+256 700 000 000"
  },
  "token": "jwt_token_here"
}
```

**Database Operations:**
1. Check if user exists
2. Hash password using bcrypt
3. Create user record in `users` table
4. Generate JWT token
5. Set HTTP-only cookie
6. Return user info

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "user",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here"
}
```

**Database Operations:**
1. Find user by email or username
2. Verify password hash
3. Check if user is active
4. Update `last_login_at`
5. Generate JWT token
6. Set HTTP-only cookie

---

### 3. Check Subscription Status

**Endpoint:** `GET /api/auth/check-status`

**Response Scenarios:**

#### A. Not Authenticated
```json
{
  "success": false,
  "error": "Not authenticated",
  "redirectTo": "/auth/login"
}
```

#### B. Not Onboarded
```json
{
  "success": false,
  "error": "Onboarding not completed",
  "redirectTo": "/onboarding/start"
}
```

#### C. No Subscription
```json
{
  "success": false,
  "error": "No active subscription",
  "redirectTo": "/onboarding/plan"
}
```

#### D. Subscription Expired
```json
{
  "success": false,
  "error": "Subscription expired",
  "redirectTo": "/onboarding/subscribe"
}
```

#### E. Access Granted
```json
{
  "success": true,
  "message": "Access granted",
  "redirectTo": "/dashboard",
  "subscriptionStatus": {
    "hasActiveTrial": true,
    "hasActiveSubscription": false,
    "subscription": {
      "planName": "Free Trial",
      "trialEndsAt": "2025-01-06T..."
    }
  }
}
```

---

## 📝 Onboarding Flow

### Step 1: Business Information

**Endpoint:** `POST /api/onboarding/start`

**Request Body:**
```json
{
  "businessName": "My Business Ltd",
  "phone": "+256 700 000 000",
  "country": "Uganda",
  "industry": "Retail"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Business information saved successfully",
  "data": {
    "businessId": "uuid",
    "branchId": "uuid",
    "businessName": "My Business Ltd",
    "branchCode": "MYBUSINESS-HQ"
  }
}
```

**Database Operations:**
1. Create/update record in `business_info` table
2. Create/update headquarters branch in `branches` table
3. Update user's `branch_id`
4. Set currency to UGX
5. Set country to Uganda (or selected)

---

### Step 2: Plan Selection

**Endpoint (GET):** `GET /api/onboarding/plan`

**Response:**
```json
{
  "success": true,
  "plans": [
    {
      "id": "uuid",
      "plan_name": "Starter",
      "plan_code": "STARTER",
      "description": "Perfect for small businesses",
      "price_monthly": 150000,
      "price_annual": 1500000,
      "discount_annual_percent": 17,
      "max_users": 3,
      "max_branches": 1,
      "max_storage_gb": 5,
      "is_popular": false
    },
    ...
  ]
}
```

**Endpoint (POST):** `POST /api/onboarding/plan`

**Request Body (Free Trial):**
```json
{
  "planType": "trial"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Free trial activated successfully",
  "subscription": {
    "id": "uuid",
    "status": "active",
    "trialEndsAt": "2025-01-06T...",
    "endDate": "2025-01-06"
  }
}
```

**Database Operations:**
1. Find or create Free Trial plan
2. Create subscription in `user_subscriptions` table
3. Set `trial_ends_at` to NOW + 30 days
4. Set `status` to 'active'
5. Set `amount` to 0

---

## 🛡️ Route Protection

### Middleware Logic

The `middleware.js` file protects routes based on authentication status:

**Public Routes** (No auth required):
- `/` - Landing page
- `/auth/login`
- `/auth/signup`
- `/auth/forgot-password`

**Auth-Only Routes** (Auth required, no subscription check):
- `/auth/check-status`
- `/onboarding/*`

**Protected Routes** (Auth + active subscription required):
- `/dashboard`
- `/sales/*`
- `/inventory/*`
- `/customers/*`
- `/products/*`
- All other module routes

**Middleware Flow:**
```
1. Check if route is public → Allow
2. Check if route is API → Allow (API handles own auth)
3. Get auth token from cookie
4. If no token → Redirect to /auth/login
5. Verify JWT token
6. If invalid → Delete cookie, redirect to /auth/login
7. If valid → Allow access
8. If accessing protected route → Client checks subscription via /api/auth/check-status
```

---

## 💾 Database Schema

### Key Tables Used

#### `users`
```sql
id                UUID PRIMARY KEY
username          VARCHAR(100) UNIQUE NOT NULL
email             VARCHAR(255) UNIQUE NOT NULL
password_hash     TEXT NOT NULL
first_name        VARCHAR(100)
last_name         VARCHAR(100)
phone             VARCHAR(50)
branch_id         UUID REFERENCES branches(id)
is_active         BOOLEAN DEFAULT true
last_login_at     TIMESTAMPTZ
created_at        TIMESTAMPTZ DEFAULT NOW()
```

#### `business_info`
```sql
id                UUID PRIMARY KEY
business_name     VARCHAR(255) NOT NULL
phone             VARCHAR(50)
country           VARCHAR(100) DEFAULT 'Uganda'
business_type     VARCHAR(100)
currency_code     VARCHAR(10) DEFAULT 'UGX'
currency_symbol   VARCHAR(10) DEFAULT 'UGX'
created_by        UUID
```

#### `branches`
```sql
id                UUID PRIMARY KEY
branch_code       VARCHAR(50) UNIQUE NOT NULL
branch_name       VARCHAR(255) NOT NULL
branch_type       VARCHAR(50) DEFAULT 'branch'
phone             VARCHAR(50)
country           VARCHAR(100) DEFAULT 'Uganda'
is_active         BOOLEAN DEFAULT true
created_by        UUID
```

#### `subscription_plans`
```sql
id                      UUID PRIMARY KEY
plan_name               VARCHAR(100) UNIQUE NOT NULL
plan_code               VARCHAR(50) UNIQUE NOT NULL
description             TEXT
price_monthly           DECIMAL(15,2) DEFAULT 0    -- UGX
price_annual            DECIMAL(15,2) DEFAULT 0    -- UGX
discount_annual_percent DECIMAL(5,2) DEFAULT 15.00
max_users               INTEGER DEFAULT 1
max_branches            INTEGER DEFAULT 1
max_storage_gb          INTEGER DEFAULT 5
is_active               BOOLEAN DEFAULT true
is_popular              BOOLEAN DEFAULT false
display_order           INTEGER DEFAULT 0
```

#### `user_subscriptions`
```sql
id                UUID PRIMARY KEY
user_id           UUID NOT NULL REFERENCES users(id)
plan_id           UUID NOT NULL REFERENCES subscription_plans(id)
status            VARCHAR(50) DEFAULT 'active'
billing_cycle     VARCHAR(20) DEFAULT 'monthly'
amount            DECIMAL(15,2) NOT NULL       -- UGX
start_date        DATE NOT NULL
end_date          DATE NOT NULL
trial_ends_at     TIMESTAMPTZ
auto_renew        BOOLEAN DEFAULT true
```

---

## 💰 Pricing Plans (UGX)

The system comes with 4 pre-configured plans:

| Plan | Monthly | Annual | Users | Branches | Storage |
|------|---------|--------|-------|----------|---------|
| **Free Trial** | UGX 0 | UGX 0 | 5 | 1 | 10GB |
| **Starter** | UGX 150,000 | UGX 1,500,000 | 3 | 1 | 5GB |
| **Business** | UGX 350,000 | UGX 3,500,000 | 10 | 3 | 25GB |
| **Enterprise** | UGX 750,000 | UGX 7,500,000 | 50 | 10 | 100GB |

*Annual plans save 17%*

---

## 🔧 Configuration

### Environment Variables

Add to `.env`:

```env
# JWT Secret (REQUIRED - Change in production!)
JWT_SECRET=xheton-secret-key-change-in-production-use-long-random-string

# Database Configuration (Already exists)
DB_HOST=localhost
DB_PORT=5432
DB_USER=xhenvolt
DB_PASSWORD=xhenvolt123
DB_NAME=xheton_db
```

---

## 🚀 Testing the System

### 1. Start the Server
```bash
npm run dev
```

### 2. Test Signup Flow
1. Navigate to `http://localhost:3000/auth/signup`
2. Fill in the form and submit
3. Should redirect to `/auth/check-status`
4. Then redirect to `/onboarding/start`

### 3. Complete Onboarding
1. Fill in business information
2. Click Continue
3. Should redirect to `/onboarding/plan`
4. Click "Start Free Trial"
5. Should redirect to `/dashboard`

### 4. Test Login Flow
1. Log out (if needed)
2. Navigate to `http://localhost:3000/auth/login`
3. Enter credentials
4. Should redirect to `/dashboard` (if subscription active)

### 5. Test Route Protection
Try accessing `/dashboard` without logging in:
- Should redirect to `/auth/login`

---

## 🔍 Subscription Checking Logic

```javascript
// Check if user has access
const subscriptionStatus = await checkSubscriptionStatus(userId);

// Status object contains:
{
  hasSubscription: boolean,      // Has any subscription record
  hasActiveTrial: boolean,        // Trial is active (not expired)
  hasActiveSubscription: boolean, // Paid subscription is active
  hasAccess: boolean,             // Either trial OR subscription active
  subscription: {
    planName: string,
    status: string,
    trialEndsAt: date,
    endDate: date,
    ...
  }
}

// Access granted if:
hasActiveTrial === true OR hasActiveSubscription === true
```

---

## 📱 User Experience Flow

### New User Journey
```
1. Landing Page
   ↓ Click "Get Started"
2. Signup Page (/auth/signup)
   ↓ Fill form & submit
3. Check Status (/auth/check-status)
   ↓ Detects: not onboarded
4. Onboarding Step 1 (/onboarding/start)
   ↓ Enter business info
5. Onboarding Step 2 (/onboarding/plan)
   ↓ Click "Start Free Trial"
6. Dashboard (/dashboard)
   ✓ Full access for 30 days
```

### Returning User Journey
```
1. Landing Page
   ↓ Click "Login"
2. Login Page (/auth/login)
   ↓ Enter credentials
3. Check Status (/auth/check-status)
   ↓ Validates subscription
4. Dashboard (/dashboard) OR Subscription Page (if expired)
```

---

## 🛠️ Implementation Notes

### Security Features
- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens in HTTP-only cookies
- ✅ CORS protection
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (React escaping)
- ✅ CSRF protection (SameSite cookies)

### Database Connection
- ✅ Primary/fallback connection pooling
- ✅ Connection timeout handling
- ✅ Error logging with pool identification
- ✅ Automatic failover to local DB

### Branding
- ✅ "XHETON" displayed on all auth pages
- ✅ "by XHENVOLT" tagline
- ✅ All currency in UGX
- ✅ Default country: Uganda
- ✅ Consistent design across pages

---

## 📦 Dependencies Added

```json
{
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "cookie": "^0.6.0"
}
```

---

## 🎨 UI Components Used

All UI built with existing ShadCN components:
- `Button`
- `Input`
- `Label`
- `Select`
- `SelectContent`
- `SelectItem`
- `SelectTrigger`
- `SelectValue`

Icons from `lucide-react`:
- `Eye`, `EyeOff` - Password visibility
- `Loader2` - Loading states
- `AlertCircle` - Error messages
- `Check`, `CheckCircle` - Success indicators
- `Sparkles` - Free trial highlight
- `Building2`, `Phone`, `Globe` - Form icons

---

## 📊 Database Console Logs

The system provides clear logging:

```
✅ Connected to primary database
✅ New user registered: user@example.com (ID: uuid)
✅ User logged in: user@example.com (ID: uuid)
✅ Onboarding step 1 completed for user: user@example.com
✅ Free trial activated for user: user@example.com
✅ Access granted for user: user@example.com
```

Error logs:
```
❌ Login error: Invalid email or password
❌ Signup error: User already exists
❌ Onboarding start error: Business name required
```

---

## 🔮 Future Enhancements (Not Implemented)

The following are placeholder/future features:

1. **Forgot Password** - Page exists, but email sending not implemented
2. **Payment Checkout** - Route exists, but payment gateway integration needed
3. **Subscription Renewal** - Auto-renewal logic needs payment integration
4. **Email Verification** - Email service integration required
5. **Two-Factor Authentication** - Database field exists, logic not implemented
6. **Last Visited Route** - Database structure needed, currently defaults to /dashboard

---

## 📄 Version Information

**XHETON Version:** 0.0.012  
**Implementation Date:** December 7, 2025  
**Database:** PostgreSQL (xheton_db)  
**Framework:** Next.js 16 App Router  
**Language:** JavaScript (No TypeScript)

---

## ✅ Testing Checklist

- [x] User can signup with email/password
- [x] User can login with email/password
- [x] JWT token is set in HTTP-only cookie
- [x] Passwords are hashed with bcrypt
- [x] User is redirected to onboarding if not completed
- [x] Business info is saved to database
- [x] Default branch is created
- [x] Pricing plans are fetched from database
- [x] Free trial can be activated
- [x] Subscription is created in database
- [x] User is redirected to dashboard after trial activation
- [x] Middleware protects routes based on authentication
- [x] Check-status validates subscription
- [x] All currency displays in UGX
- [x] All pages show XHETON/XHENVOLT branding
- [x] Database connection uses primary/fallback logic

---

## 🆘 Troubleshooting

### Issue: "Authentication required" error
**Solution:** Check if JWT_SECRET is set in `.env`

### Issue: Database connection fails
**Solution:** Verify PostgreSQL is running and credentials are correct

### Issue: Pricing plans not showing
**Solution:** Run the INSERT query to add plans to database

### Issue: Middleware redirects not working
**Solution:** Clear browser cookies and try again

### Issue: Trial not activating
**Solution:** Check if Free Trial plan exists in subscription_plans table

---

## 📞 Support

For issues or questions about this implementation:
- Email: support@xhenvolt.com
- System Version: XHETON v0.0.012
- Implementation: Authentication & Subscription Gatekeeper

---

**© 2025 XHENVOLT. All rights reserved.**
