# Quick Start Guide

This guide will help you get the Invoice SaaS application running in under 5 minutes.

## Option 1: Docker (Recommended)

### Prerequisites
- Docker
- Docker Compose

### Steps

1. **Start the application**
```bash
docker-compose up -d
```

2. **Check if it's running**
```bash
docker-compose logs -f api
```

You should see:
```
INFO: Server starting on :8080
INFO: Connected to database successfully
INFO: All migrations completed
```

3. **Test the API**
```bash
curl http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "organization_name": "Test Company"
  }'
```

## Option 2: Local Development

### Prerequisites
- Go 1.21+
- PostgreSQL 12+

### Steps

1. **Setup PostgreSQL**
```bash
# Start PostgreSQL (if not running)
# Create database
createdb invoice_saas
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env if needed
```

3. **Install dependencies**
```bash
go mod download
```

4. **Run the application**
```bash
go run cmd/server/main.go
```

## Testing the API

### 1. Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "organization_name": "Acme Inc"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-08-15T10:00:00Z"
    }
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Use the token for authenticated requests

Save the token from the response and use it in subsequent requests:

```bash
TOKEN="your-token-here"

# Create a customer
curl -X POST http://localhost:8080/api/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "address": "123 Main St"
  }'

# Create a product
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Development",
    "description": "Hourly web development service",
    "price": 50000,
    "unit": "hour"
  }'

# Create an invoice
curl -X POST http://localhost:8080/api/invoices \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "issue_date": "2026-08-15",
    "due_date": "2026-09-15",
    "items": [
      {
        "product_id": 1,
        "description": "Web Development - 10 hours",
        "quantity": 10,
        "unit_price": 50000
      }
    ],
    "tax": 50000,
    "discount": 0,
    "notes": "Thank you for your business"
  }'

# Get dashboard stats
curl -X GET http://localhost:8080/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

## Using Postman

1. Import the following environment variables:
   - `BASE_URL`: `http://localhost:8080`
   - `TOKEN`: (will be set after login)

2. Import these requests:
   - **Register**: `POST {{BASE_URL}}/api/auth/register`
   - **Login**: `POST {{BASE_URL}}/api/auth/login`
   - **Get Profile**: `GET {{BASE_URL}}/api/auth/me` (with Bearer Token)

3. After login, copy the token and set it in your environment

## Troubleshooting

### Database connection error
```
Failed to connect to database
```
**Solution**: Check that PostgreSQL is running and the DATABASE_URL in .env is correct

### Port already in use
```
bind: address already in use
```
**Solution**: Change APP_PORT in .env or stop the service using port 8080

### Migration errors
```
Failed to run migrations
```
**Solution**: Check database permissions and that the migrations folder exists

### JWT validation errors
```
Invalid or expired token
```
**Solution**: Login again to get a fresh token (tokens expire after 24 hours)

## Next Steps

1. Explore the full API documentation in README.md
2. Test all endpoints with the examples provided
3. Build the frontend application
4. Deploy to production

## Development Tips

### Run with auto-reload
Install Air for hot reloading:
```bash
go install github.com/cosmtrek/air@latest
air
```

### View database tables
```bash
psql invoice_saas
\dt
SELECT * FROM users;
SELECT * FROM organizations;
SELECT * FROM customers;
```

### Reset database
```bash
dropdb invoice_saas
createdb invoice_saas
# Restart the application to run migrations
```

### View logs
```bash
# Docker
docker-compose logs -f api

# Local
# Logs are printed to stdout
```

## Common Use Cases

### Complete workflow example

```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","organization_name":"Test Co"}'

# 2. Login and save token
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')

# 3. Create customer
curl -X POST http://localhost:8080/api/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Client ABC","email":"client@example.com","phone":"123456","address":"123 Street"}'

# 4. Create product
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Consulting","description":"Business consulting","price":100000,"unit":"hour"}'

# 5. Create invoice
curl -X POST http://localhost:8080/api/invoices \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"customer_id":1,"issue_date":"2026-08-15","due_date":"2026-09-15","items":[{"product_id":1,"description":"Consulting - 5 hours","quantity":5,"unit_price":100000}],"tax":50000,"discount":0}'

# 6. Send invoice
curl -X POST http://localhost:8080/api/invoices/1/send \
  -H "Authorization: Bearer $TOKEN"

# 7. Record payment
curl -X POST http://localhost:8080/api/invoices/1/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":550000,"payment_method":"bank_transfer","paid_at":"2026-08-15T10:00:00Z","notes":"Full payment"}'

# 8. Check dashboard
curl -X GET http://localhost:8080/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

That's it! You now have a fully functional multi-tenant invoice management system running locally.
