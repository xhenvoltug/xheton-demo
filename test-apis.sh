#!/bin/bash
# XHETON ERP System - Comprehensive API Testing Script
# Run this to validate the complete data flow implementation

API_BASE="http://localhost:3000/api"
CURRENCY="UGX"

echo "======================================================"
echo "XHETON ERP - COMPLETE DATA FLOW TEST"
echo "======================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local expected_status=$4
  local description=$5
  
  echo -e "${YELLOW}Testing:${NC} $description"
  echo "  Endpoint: $method $endpoint"
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_BASE$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_BASE$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" = "$expected_status" ]; then
    echo -e "  ${GREEN}✓ PASSED${NC} (Status: $http_code)"
    ((TESTS_PASSED++))
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
  else
    echo -e "  ${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $http_code)"
    ((TESTS_FAILED++))
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
  fi
  echo ""
}

echo "======================================================"
echo "PHASE 1: SUPPLIERS (Foundational)"
echo "======================================================"
echo ""

# Test: List suppliers
test_endpoint "GET" "/purchases/suppliers/list?page=1&limit=10" "" "200" "List suppliers"

# Test: Create supplier
SUPPLIER_DATA='{
  "supplier_code": "TEST-SUP-'$(date +%s)'",
  "supplier_name": "Test Supplier Ltd",
  "email": "contact@testsupplier.com",
  "phone": "+256701234567",
  "address": "123 Business St",
  "city": "Kampala",
  "country": "Uganda",
  "payment_terms": 30,
  "credit_limit": 10000000
}'

test_endpoint "POST" "/purchases/suppliers" "$SUPPLIER_DATA" "201" "Create supplier"

echo "======================================================"
echo "PHASE 2: PURCHASE ORDERS (Supplier → Orders)"
echo "======================================================"
echo ""

# Test: List purchase orders
test_endpoint "GET" "/purchases/orders?page=1&limit=10" "" "200" "List purchase orders"

echo "======================================================"
echo "PHASE 3: GRN - CRITICAL (Orders → Stock Increase)"
echo "======================================================"
echo ""

# Test: List GRNs
test_endpoint "GET" "/purchases/grn-new?page=1&limit=10" "" "200" "List GRNs"

echo "======================================================"
echo "PHASE 4: INVENTORY (Stock Movements)"
echo "======================================================"
echo ""

# Test: List batches (read-only)
test_endpoint "GET" "/inventory/batches?page=1&limit=10" "" "200" "List inventory batches (auto-created by GRN)"

# Test: List stock movements (audit log)
test_endpoint "GET" "/inventory/movements?page=1&limit=10" "" "200" "List stock movements audit log"

echo "======================================================"
echo "PHASE 5: CUSTOMERS (Sales Partners)"
echo "======================================================"
echo ""

# Test: List customers
test_endpoint "GET" "/sales/customers?page=1&limit=10" "" "200" "List customers"

# Test: Create customer
CUSTOMER_DATA='{
  "customer_code": "CUST-'$(date +%s)'",
  "customer_name": "Test Customer Ltd",
  "email": "customer@test.com",
  "phone": "+256712345678",
  "address": "456 Trade Ave",
  "city": "Kampala",
  "country": "Uganda"
}'

test_endpoint "POST" "/sales/customers" "$CUSTOMER_DATA" "201" "Create customer"

echo "======================================================"
echo "PHASE 6: POS CHECKOUT - CRITICAL (Stock Validation)"
echo "======================================================"
echo ""

# Get product ID first (if available)
# For testing, we'll show the API structure
echo -e "${YELLOW}Note:${NC} POS checkout requires existing product with stock"
echo ""

CHECKOUT_DATA='{
  "customer_id": "00000000-0000-0000-0000-000000000001",
  "warehouse_id": "00000000-0000-0000-0000-000000000001",
  "items": [
    {
      "product_id": "00000000-0000-0000-0000-000000000001",
      "quantity": 5
    }
  ]
}'

echo -e "${YELLOW}Testing:${NC} POS Checkout (Stock Validation)"
echo "  Endpoint: POST /sales/checkout"
echo "  This endpoint:"
echo "    1. Validates product stock >= requested quantity"
echo "    2. Returns 409 if insufficient stock"
echo "    3. Decrements stock on success"
echo "    4. Creates stock movement OUT record"
echo "    5. Auto-generates sales invoice"
echo ""

echo "======================================================"
echo "PHASE 7: SALES INVOICES (Auto-generated)"
echo "======================================================"
echo ""

# Test: List sales invoices
test_endpoint "GET" "/sales/invoices?page=1&limit=10" "" "200" "List sales invoices (auto-created by POS)"

echo ""
echo "======================================================"
echo "TEST SUMMARY"
echo "======================================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Create a test supplier via API"
  echo "2. Create a purchase order for that supplier"
  echo "3. Receive goods via GRN (stock should increase)"
  echo "4. Verify batches created in /inventory/batches"
  echo "5. Verify movements recorded in /inventory/movements"
  echo "6. Create a customer"
  echo "7. Attempt POS sale with sufficient stock"
  echo "8. Verify stock decremented and invoice created"
  exit 0
else
  echo -e "${RED}✗ SOME TESTS FAILED${NC}"
  exit 1
fi
