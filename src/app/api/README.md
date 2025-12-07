# XHETON API Routes Documentation

This directory contains Next.js 16 App Router API endpoints for the XHETON application.

## API Structure

```
src/app/api/
├── health/
│   └── route.js          # Health check endpoint
├── test/
│   └── db/
│       └── route.js      # Database connection test
└── users/
    ├── route.js          # Users CRUD (GET all, POST)
    └── [id]/
        └── route.js      # Users CRUD (GET, PUT, DELETE by ID)
```

## Available Endpoints

### 1. Health Check
**GET** `/api/health`

Check the health of the API and database connections.

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-12-07T...",
  "service": "XHETON API v0.0.014",
  "database": {
    "primary": {
      "success": true,
      "pool": "primary",
      "currentTime": "...",
      "version": "PostgreSQL 14..."
    },
    "fallback": {
      "success": true,
      "pool": "fallback",
      "currentTime": "...",
      "version": "PostgreSQL 14..."
    },
    "active": "primary"
  }
}
```

### 2. Database Test
**GET** `/api/test/db`

Run comprehensive database connectivity tests.

**Response:**
```json
{
  "success": true,
  "message": "All database tests passed",
  "timestamp": "2025-12-07T...",
  "tests": [
    {
      "name": "Primary Database Connection",
      "success": true,
      "currentTime": "...",
      "version": "..."
    },
    {
      "name": "Query Execution",
      "success": true,
      "tableCount": 150
    },
    {
      "name": "Table Listing",
      "success": true,
      "tables": ["users", "products", "..."],
      "totalShown": 10
    }
  ]
}
```

### 3. Users API

#### Get All Users
**GET** `/api/users?limit=10&offset=0`

Get a paginated list of users.

**Query Parameters:**
- `limit` (optional): Number of users to return (default: 10)
- `offset` (optional): Number of users to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "admin",
      "status": "active",
      "created_at": "2025-12-07T...",
      "last_login": "2025-12-07T..."
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 100
  }
}
```

#### Create User
**POST** `/api/users`

Create a new user.

**Request Body:**
```json
{
  "username": "jane_doe",
  "email": "jane@example.com",
  "password_hash": "hashed_password_here",
  "first_name": "Jane",
  "last_name": "Doe",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user_id": 2,
    "username": "jane_doe",
    "email": "jane@example.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "role": "user",
    "status": "active",
    "created_at": "2025-12-07T..."
  }
}
```

#### Get User by ID
**GET** `/api/users/[id]`

Get a specific user by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin",
    "status": "active",
    "created_at": "2025-12-07T...",
    "last_login": "2025-12-07T...",
    "updated_at": "2025-12-07T..."
  }
}
```

#### Update User
**PUT** `/api/users/[id]`

Update a user's information.

**Request Body:**
```json
{
  "first_name": "Jonathan",
  "last_name": "Doe",
  "email": "jonathan@example.com",
  "role": "admin",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user_id": 1,
    "username": "john_doe",
    "email": "jonathan@example.com",
    "first_name": "Jonathan",
    "last_name": "Doe",
    "role": "admin",
    "status": "active",
    "updated_at": "2025-12-07T..."
  }
}
```

#### Delete User
**DELETE** `/api/users/[id]`

Soft delete a user (sets status to 'deleted').

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "status": "deleted"
  }
}
```

## Database Configuration

The API uses a centralized database configuration located at:
```
src/lib/db.js
```

### Features:
- **Connection Pooling**: Efficient connection management
- **Automatic Failover**: Switches to fallback database on primary failure
- **Error Handling**: Comprehensive error logging and handling
- **Transaction Support**: Built-in transaction methods

### Environment Variables

Configure database connection in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=xhe
DB_PASSWORD=your_password
DB_NAME=xheton_db
DB_POOL_SIZE=20

DB_FALLBACK_HOST=localhost
DB_FALLBACK_PORT=5432
DB_FALLBACK_USER=xhe
DB_FALLBACK_PASSWORD=your_password
DB_FALLBACK_NAME=xheton_local_db
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error category",
  "message": "Detailed error message",
  "timestamp": "2025-12-07T..."
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (e.g., duplicate entry)
- `500` - Internal Server Error

## Testing

### Using curl

```bash
# Health check
curl http://localhost:3000/api/health

# Database test
curl http://localhost:3000/api/test/db

# Get users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password_hash": "hashed_password",
    "first_name": "Test",
    "last_name": "User"
  }'

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"first_name": "Updated"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

### Using Browser

Simply visit:
- http://localhost:3000/api/health
- http://localhost:3000/api/test/db
- http://localhost:3000/api/users

## Development

### Adding New Endpoints

1. Create a new directory under `src/app/api/`
2. Add a `route.js` file with your handlers:

```javascript
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  // Your code here
  return NextResponse.json({ success: true });
}

export const dynamic = 'force-dynamic';
```

### Database Queries

```javascript
import { query, getClient } from '@/lib/db';

// Simple query
const result = await query('SELECT * FROM users WHERE id = $1', [userId]);

// Transaction
const client = await getClient();
try {
  await client.query('BEGIN');
  // Your queries
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

## Next Steps

1. Install the database schema: `psql -U xhe -d xheton_db -f database/install.sql`
2. Start the dev server: `npm run dev`
3. Test the endpoints using the examples above
4. Build additional API routes as needed

## Support

For setup issues, see:
- `/DATABASE_SETUP.md` - Complete setup guide
- `/database/README.md` - Database documentation
- `/DATABASE_DELIVERY_SUMMARY.md` - Full delivery summary
