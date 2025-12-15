#!/bin/bash

# Database refresh script
# Exports the current database, drops it, and reimports to make it fresh

set -e

# Database credentials (Local/Fallback)
DB_HOST=${DB_FALLBACK_HOST:-localhost}
DB_PORT=${DB_FALLBACK_PORT:-5432}
DB_USER=${DB_FALLBACK_USER:-xhenvolt}
DB_PASSWORD=${DB_FALLBACK_PASSWORD:-xhenvolt123}
DB_NAME=${DB_FALLBACK_NAME:-xheton_db}

# Export filename with timestamp
EXPORT_DIR="database/backups"
EXPORT_FILE="$EXPORT_DIR/xheton_db_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "=========================================="
echo "Database Refresh Script"
echo "=========================================="
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$EXPORT_DIR"

# Step 1: Export current database
echo "📤 Step 1: Exporting current database..."
echo "   Host: $DB_HOST"
echo "   Database: $DB_NAME"
echo "   Output: $EXPORT_FILE"
echo ""

PGPASSWORD=$DB_PASSWORD pg_dump \
  -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d $DB_NAME \
  --no-password \
  > "$EXPORT_FILE"

echo "✓ Database exported successfully to $EXPORT_FILE"
echo ""

# Step 2: Drop database
echo "🗑️  Step 2: Dropping database..."
echo "   Database: $DB_NAME"
echo ""

PGPASSWORD=$DB_PASSWORD psql \
  -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d postgres \
  --no-password \
  -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo "✓ Database dropped successfully"
echo ""

# Step 3: Create new database
echo "🆕 Step 3: Creating new database..."
echo "   Database: $DB_NAME"
echo ""

PGPASSWORD=$DB_PASSWORD psql \
  -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d postgres \
  --no-password \
  -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

echo "✓ New database created successfully"
echo ""

# Step 4: Import schema from schema files
echo "📥 Step 4: Importing schema from SQL files..."
echo ""

# Apply core schema
echo "   Applying schema_core.sql..."
PGPASSWORD=$DB_PASSWORD psql \
  -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d $DB_NAME \
  --no-password \
  < database/schema_core.sql

echo "   ✓ Core schema applied"

# Apply additional schemas if they exist
if [ -f "database/schema_additional.sql" ]; then
  echo "   Applying schema_additional.sql..."
  PGPASSWORD=$DB_PASSWORD psql \
    -h $DB_HOST \
    -p $DB_PORT \
    -U $DB_USER \
    -d $DB_NAME \
    --no-password \
    < database/schema_additional.sql
  echo "   ✓ Additional schema applied"
fi

if [ -f "database/schema_future_landing.sql" ]; then
  echo "   Applying schema_future_landing.sql..."
  PGPASSWORD=$DB_PASSWORD psql \
    -h $DB_HOST \
    -p $DB_PORT \
    -U $DB_USER \
    -d $DB_NAME \
    --no-password \
    < database/schema_future_landing.sql
  echo "   ✓ Future landing schema applied"
fi

echo ""
echo "✓ All schemas imported successfully"
echo ""

# Step 5: Run seed script
echo "🌱 Step 5: Seeding database with initial data..."
echo ""

NODE_ENV=development node scripts/seed-db.js

echo ""
echo "=========================================="
echo "✓ Database refresh completed successfully!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  • Original database exported to: $EXPORT_FILE"
echo "  • Database dropped and recreated: $DB_NAME"
echo "  • Schema imported from SQL files"
echo "  • Database seeded with initial data"
echo ""
echo "The database is now fresh and ready to use!"
echo ""
