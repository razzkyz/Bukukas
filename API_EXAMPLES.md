# API Examples - Invoice SaaS

Complete examples for testing all API endpoints.

## Setup

```bash
# Set base URL
BASE_URL="http://localhost:8080"

# After login, set your token
TOKEN="your-jwt-token-here"
```

## 1. Authentication

### Register New User and Organization
```bash
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "organization_name": "Acme Corporation"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-08-15T10:00:00Z",
      "updated_at": "2026-08-15T10:00:00Z"
    }
  }
}
```

### Login
```bash
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Logout
```bash
curl -X POST $BASE_URL/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

## 2. Customers

### Create Customer
```bash
curl -X POST $BASE_URL/api/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Company",
    "email": "contact@abc.com",
    "phone": "+1-555-0123",
    "address": "123 Business Street, Suite 100, New York, NY 10001"
  }'
```

### List Customers
```bash
# All customers
curl -X GET "$BASE_URL/api/customers" \
  -H "Authorization: Bearer $TOKEN"

# With search
curl -X GET "$BASE_URL/api/customers?search=ABC" \
  -H "Authorization: Bearer $TOKEN"

# With pagination
curl -X GET "$BASE_URL/api/customers?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Combined
curl -X GET "$BASE_URL/api/customers?search=company&page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Customer by ID
```bash
curl -X GET $BASE_URL/api/customers/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Update Customer
```bash
curl -X PUT $BASE_URL/api/customers/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Company Ltd",
    "email": "info@abc.com",
    "phone": "+1-555-0124",
    "address": "456 New Business Ave, New York, NY 10002"
  }'
```

### Delete Customer
```bash
curl -X DELETE $BASE_URL/api/customers/1 \
  -H "Authorization: Bearer $TOKEN"
```

## 3. Products

### Create Product
```bash
curl -X POST $BASE_URL/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Development",
    "description": "Custom web application development services",
    "price": 100000,
    "unit": "hour"
  }'
```

### List Products
```bash
# All products
curl -X GET "$BASE_URL/api/products" \
  -H "Authorization: Bearer $TOKEN"

# With search and pagination
curl -X GET "$BASE_URL/api/products?search=web&page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Product by ID
```bash
curl -X GET $BASE_URL/api/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Update Product
```bash
curl -X PUT $BASE_URL/api/products/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Development - Senior",
    "description": "Senior developer web application development",
    "price": 150000,
    "unit": "hour"
  }'
```

### Delete Product
```bash
curl -X DELETE $BASE_URL/api/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

## 4. Invoices

### Create Invoice
```bash
curl -X POST $BASE_URL/api/invoices \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "issue_date": "2026-08-15",
    "due_date": "2026-09-15",
    "items": [
      {
        "product_id": 1,
        "description": "Web Development - Initial Setup",
        "quantity": 10,
        "unit_price": 100000
      },
      {
        "product_id": 2,
        "description": "UI/UX Design - Homepage",
        "quantity": 5,
        "unit_price": 80000
      }
    ],
    "tax": 140000,
    "discount": 50000,
    "notes": "Thank you for your business. Payment due within 30 days."
  }'
```

**Calculation:**
- Subtotal: (10 × 100,000) + (5 × 80,000) = 1,400,000
- Discount: 50,000
- Tax: 140,000
- **Total: 1,490,000**

### List Invoices
```bash
# All invoices
curl -X GET "$BASE_URL/api/invoices" \
  -H "Authorization: Bearer $TOKEN"

# Filter by status
curl -X GET "$BASE_URL/api/invoices?status=paid" \
  -H "Authorization: Bearer $TOKEN"

# With pagination
curl -X GET "$BASE_URL/api/invoices?page=1&limit=20&status=draft" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Invoice by ID (with full details)
```bash
curl -X GET $BASE_URL/api/invoices/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Response includes:**
- Invoice details
- Customer information
- Invoice items
- Payments made
- Total paid
- Amount due

### Update Invoice
```bash
curl -X PUT $BASE_URL/api/invoices/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "issue_date": "2026-08-15",
    "due_date": "2026-09-30",
    "items": [
      {
        "product_id": 1,
        "description": "Web Development - Complete Package",
        "quantity": 15,
        "unit_price": 100000
      }
    ],
    "tax": 150000,
    "discount": 0,
    "notes": "Updated invoice. Extended due date."
  }'
```

### Send Invoice
```bash
curl -X POST $BASE_URL/api/invoices/1/send \
  -H "Authorization: Bearer $TOKEN"
```
Changes status from `draft` to `sent`.

### Cancel Invoice
```bash
curl -X POST $BASE_URL/api/invoices/1/cancel \
  -H "Authorization: Bearer $TOKEN"
```
Changes status to `cancelled` (cannot cancel paid invoices).

### Delete Invoice
```bash
curl -X DELETE $BASE_URL/api/invoices/1 \
  -H "Authorization: Bearer $TOKEN"
```

## 5. Payments

### Create Payment
```bash
curl -X POST $BASE_URL/api/invoices/1/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500000,
    "payment_method": "bank_transfer",
    "paid_at": "2026-08-20T14:30:00Z",
    "notes": "Partial payment - Bank transfer confirmation #12345"
  }'
```

**Payment Methods:**
- `cash`
- `bank_transfer`
- `qris`
- `other`

### Create Full Payment
```bash
curl -X POST $BASE_URL/api/invoices/1/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1490000,
    "payment_method": "bank_transfer",
    "paid_at": "2026-08-22T10:00:00Z",
    "notes": "Full payment received"
  }'
```
Automatically updates invoice status to `paid`.

### Get Invoice Payments
```bash
curl -X GET $BASE_URL/api/invoices/1/payments \
  -H "Authorization: Bearer $TOKEN"
```

## 6. Dashboard

### Get Statistics
```bash
curl -X GET $BASE_URL/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": 24500000,
    "paid_invoices": 32,
    "unpaid_invoices": 8,
    "overdue_invoices": 3,
    "total_customers": 124
  }
}
```

### Get Revenue Chart
```bash
# Last 7 days
curl -X GET "$BASE_URL/api/dashboard/revenue-chart?days=7" \
  -H "Authorization: Bearer $TOKEN"

# Last 30 days
curl -X GET "$BASE_URL/api/dashboard/revenue-chart?days=30" \
  -H "Authorization: Bearer $TOKEN"

# Last 90 days
curl -X GET "$BASE_URL/api/dashboard/revenue-chart?days=90" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-08-10T00:00:00Z",
      "amount": 500000
    },
    {
      "date": "2026-08-11T00:00:00Z",
      "amount": 750000
    },
    {
      "date": "2026-08-12T00:00:00Z",
      "amount": 1200000
    }
  ]
}
```

## Complete Workflow Example

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=== 1. Register User ==="
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo User",
    "email": "demo@example.com",
    "password": "password123",
    "organization_name": "Demo Company"
  }')
echo $RESPONSE | jq '.'

TOKEN=$(echo $RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"

echo -e "\n=== 2. Create Customer ==="
CUSTOMER=$(curl -s -X POST $BASE_URL/api/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Client ABC",
    "email": "client@abc.com",
    "phone": "+1234567890",
    "address": "123 Client Street"
  }')
echo $CUSTOMER | jq '.'
CUSTOMER_ID=$(echo $CUSTOMER | jq -r '.data.id')

echo -e "\n=== 3. Create Product ==="
PRODUCT=$(curl -s -X POST $BASE_URL/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Consulting",
    "description": "Business consulting services",
    "price": 100000,
    "unit": "hour"
  }')
echo $PRODUCT | jq '.'
PRODUCT_ID=$(echo $PRODUCT | jq -r '.data.id')

echo -e "\n=== 4. Create Invoice ==="
INVOICE=$(curl -s -X POST $BASE_URL/api/invoices \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"customer_id\": $CUSTOMER_ID,
    \"issue_date\": \"2026-08-15\",
    \"due_date\": \"2026-09-15\",
    \"items\": [
      {
        \"product_id\": $PRODUCT_ID,
        \"description\": \"Consulting - Initial Phase\",
        \"quantity\": 10,
        \"unit_price\": 100000
      }
    ],
    \"tax\": 100000,
    \"discount\": 0,
    \"notes\": \"Thank you for your business\"
  }")
echo $INVOICE | jq '.'
INVOICE_ID=$(echo $INVOICE | jq -r '.data.id')

echo -e "\n=== 5. Send Invoice ==="
curl -s -X POST $BASE_URL/api/invoices/$INVOICE_ID/send \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n=== 6. Create Payment ==="
curl -s -X POST $BASE_URL/api/invoices/$INVOICE_ID/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1100000,
    "payment_method": "bank_transfer",
    "paid_at": "2026-08-20T10:00:00Z",
    "notes": "Full payment received"
  }' | jq '.'

echo -e "\n=== 7. Get Dashboard Stats ==="
curl -s -X GET $BASE_URL/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n=== Workflow Complete ==="
```

Save this as `test-workflow.sh`, make it executable (`chmod +x test-workflow.sh`), and run it!

## Testing Multi-Tenancy

Create two organizations and verify data isolation:

```bash
# Register Organization 1
ORG1=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User One",
    "email": "user1@example.com",
    "password": "password123",
    "organization_name": "Company One"
  }')
TOKEN1=$(echo $ORG1 | jq -r '.data.token')

# Register Organization 2
ORG2=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User Two",
    "email": "user2@example.com",
    "password": "password123",
    "organization_name": "Company Two"
  }')
TOKEN2=$(echo $ORG2 | jq -r '.data.token')

# Create customer in Org 1
curl -X POST $BASE_URL/api/customers \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Customer of Org 1", "email": "customer1@example.com"}'

# Try to list customers from Org 2 (should be empty)
curl -X GET $BASE_URL/api/customers \
  -H "Authorization: Bearer $TOKEN2"

# Result: Org 2 cannot see Org 1's customers ✓
```

## Error Examples

### Validation Error
```bash
curl -X POST $BASE_URL/api/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "invalid-email"
  }'
```

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "fields": {
      "name": "Name is required",
      "email": "Invalid email address"
    }
  }
}
```

### Unauthorized
```bash
curl -X GET $BASE_URL/api/customers
```

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authorization header required"
  }
}
```

### Not Found
```bash
curl -X GET $BASE_URL/api/customers/99999 \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "customer not found"
  }
}
```
