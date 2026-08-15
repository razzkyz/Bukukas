# 🧾 Invoice SaaS - Multi-Tenant Business Management System

A production-ready multi-tenant SaaS web application for small businesses, freelancers, and agencies to manage customers, products/services, invoices, payments, and financial reports.

> **🚀 Quick Start:** Baca `START_HERE.md` untuk mulai dalam 3 langkah!

## Features

### Current Features (MVP)
- ✅ **Multi-tenant architecture** - Complete data isolation between organizations
- ✅ **Authentication & Authorization** - JWT-based auth with bcrypt password hashing
- ✅ **Customer Management** - CRUD operations with search and pagination
- ✅ **Product/Service Management** - Manage products/services with pricing
- ✅ **Invoice Management** - Create, update, send, and cancel invoices
- ✅ **Payment Tracking** - Record and track payments with multiple methods
- ✅ **Dashboard** - Real-time statistics and revenue charts
- ✅ **RESTful API** - Clean, consistent API design
- ✅ **Database Migrations** - Automated schema management

### Tech Stack

**Backend:**
- Go 1.21
- PostgreSQL
- Gorilla Mux (routing)
- JWT authentication
- Bcrypt password hashing
- Clean architecture (handler → service → repository)

**Frontend (Coming Soon):**
- React
- TypeScript
- Vite
- Tailwind CSS

## Getting Started

### Prerequisites
- Go 1.21 or higher
- PostgreSQL 12 or higher
- Docker and Docker Compose (optional)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd invoice-saas
```

2. **Install dependencies**
```bash
go mod download
```

3. **Setup database**
```bash
# Create database
createdb invoice_saas

# Or using psql
psql -U postgres
CREATE DATABASE invoice_saas;
\q
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env and set your configuration
```

5. **Run the application**
```bash
go run cmd/server/main.go
```

The API will be available at `http://localhost:8080`

### Docker Development Setup

1. **Start all services**
```bash
docker-compose up -d
```

2. **View logs**
```bash
docker-compose logs -f api
```

3. **Stop services**
```bash
docker-compose down
```

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "organization_name": "Acme Inc"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Customers

#### List Customers
```http
GET /api/customers?search=john&page=1&limit=20
Authorization: Bearer <token>
```

#### Create Customer
```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, State"
}
```

#### Get Customer
```http
GET /api/customers/{id}
Authorization: Bearer <token>
```

#### Update Customer
```http
PUT /api/customers/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, State"
}
```

#### Delete Customer
```http
DELETE /api/customers/{id}
Authorization: Bearer <token>
```

### Products

Endpoints follow the same pattern as customers:
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Invoices

#### Create Invoice
```http
POST /api/invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer_id": 1,
  "issue_date": "2026-08-15",
  "due_date": "2026-09-15",
  "items": [
    {
      "product_id": 1,
      "description": "Web Development",
      "quantity": 10,
      "unit_price": 50000
    }
  ],
  "tax": 50000,
  "discount": 25000,
  "notes": "Thank you for your business"
}
```

#### Send Invoice
```http
POST /api/invoices/{id}/send
Authorization: Bearer <token>
```

#### Cancel Invoice
```http
POST /api/invoices/{id}/cancel
Authorization: Bearer <token>
```

### Payments

#### Create Payment
```http
POST /api/invoices/{id}/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500000,
  "payment_method": "bank_transfer",
  "paid_at": "2026-08-15T10:00:00Z",
  "notes": "Payment received"
}
```

#### Get Invoice Payments
```http
GET /api/invoices/{id}/payments
Authorization: Bearer <token>
```

### Dashboard

#### Get Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

Response:
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

#### Get Revenue Chart
```http
GET /api/dashboard/revenue-chart?days=30
Authorization: Bearer <token>
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

### Success with Pagination
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "fields": {
      "email": "Invalid email address",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

## Database Schema

### Users
- User accounts

### Organizations
- Business entities using the SaaS

### Organization Members
- Relationship between users and organizations with roles (owner, admin, staff)

### Customers
- Customer records (scoped to organization)

### Products
- Products/services (scoped to organization)

### Invoices
- Invoice records with status tracking

### Invoice Items
- Line items for each invoice

### Payments
- Payment records linked to invoices

### Subscriptions
- Organization subscription plans

### Activity Logs
- Audit trail of user actions

## Security Features

- **Password Security**: Bcrypt hashing with automatic salt generation
- **JWT Authentication**: Stateless authentication with expiring tokens
- **Multi-Tenant Isolation**: All queries filtered by organization_id
- **SQL Injection Protection**: Parameterized queries throughout
- **CORS Configuration**: Configurable allowed origins
- **Input Validation**: Server-side validation of all inputs
- **Authorization**: Role-based access control ready

## Project Structure

```
invoice-saas/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── config/
│   ├── handler/
│   ├── middleware/
│   ├── model/
│   ├── repository/
│   ├── routes/
│   └── service/
├── migrations/
├── pkg/
│   ├── auth/
│   ├── database/
│   ├── logger/
│   ├── response/
│   └── validator/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── go.mod
├── go.sum
└── README.md
```

## Roadmap

### Phase 2 - Frontend
- [ ] React application setup
- [ ] Authentication pages
- [ ] Dashboard with charts
- [ ] Customer management UI
- [ ] Product management UI
- [ ] Invoice creation and management
- [ ] Payment tracking UI
- [ ] Responsive design

### Phase 3 - Advanced Features
- [ ] PDF invoice generation
- [ ] Email notifications
- [ ] Recurring invoices
- [ ] Advanced reports
- [ ] Multi-currency support
- [ ] Tax calculations
- [ ] Payment gateway integration
- [ ] Team management
- [ ] Audit logs
- [ ] API rate limiting

### Phase 4 - Deployment
- [ ] Production deployment guide
- [ ] Monitoring and logging
- [ ] Automated backups
- [ ] Performance optimization
- [ ] Load testing
- [ ] Security audit

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the repository.
