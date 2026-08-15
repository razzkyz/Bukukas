# 🏗️ Architecture Diagram - Invoice SaaS

Visual representation dari arsitektur aplikasi.

---

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER (Browser)                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP
                     ↓
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (Next.js 14)                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Pages: Login, Register, Dashboard, Customers     │  │
│  │  Products, Invoices (todo), Payments (todo)       │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Services: authService, customerService,          │  │
│  │  productService, invoiceService (todo)            │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Components: DashboardLayout, Forms, Tables       │  │
│  └───────────────────────────────────────────────────┘  │
│              Port: 3000                                  │
└────────────────────┬────────────────────────────────────┘
                     │ REST API (HTTP/JSON)
                     │ with JWT Token
                     ↓
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Go + Gorilla Mux)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Middleware: Auth, CORS, Logger                   │  │
│  └────────────┬──────────────────────────────────────┘  │
│               ↓                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Handlers: Auth, Customer, Product, Invoice,      │  │
│  │  Payment, Dashboard (HTTP Controllers)            │  │
│  └────────────┬──────────────────────────────────────┘  │
│               ↓                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Services: Business Logic + Validation            │  │
│  └────────────┬──────────────────────────────────────┘  │
│               ↓                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Repositories: Database Queries (SQL)             │  │
│  └────────────┬──────────────────────────────────────┘  │
│              Port: 8080                                  │
└────────────────────┬────────────────────────────────────┘
                     │ SQL Queries
                     ↓
┌─────────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL 15)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Tables: users, organizations, customers,         │  │
│  │  products, invoices, invoice_items, payments,     │  │
│  │  subscriptions, organization_members,             │  │
│  │  activity_logs                                    │  │
│  └───────────────────────────────────────────────────┘  │
│              Port: 5432                                  │
│              GUI: pgAdmin 4                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### 1. User Login Flow
```
User
  │
  │ 1. Enter email & password
  ↓
Login Page (Next.js)
  │
  │ 2. POST /api/auth/login
  ↓
Backend Auth Handler
  │
  │ 3. Validate credentials
  ↓
Auth Service
  │
  │ 4. Check password (bcrypt)
  ↓
User Repository
  │
  │ 5. Query database
  ↓
PostgreSQL
  │
  │ 6. Return user data
  ↓
Auth Service
  │
  │ 7. Generate JWT token
  ↓
Backend Response
  │
  │ 8. Return token + user
  ↓
Frontend
  │
  │ 9. Store token in localStorage
  │ 10. Redirect to Dashboard
  ↓
User sees Dashboard
```

### 2. Create Customer Flow
```
User
  │
  │ 1. Fill customer form
  ↓
Customer Create Page
  │
  │ 2. POST /api/customers
  │    Header: Authorization: Bearer {token}
  ↓
Backend (Middleware)
  │
  │ 3. Validate JWT token
  │ 4. Extract organization_id
  ↓
Customer Handler
  │
  │ 5. Parse request body
  ↓
Customer Service
  │
  │ 6. Validate input
  │ 7. Add organization_id
  ↓
Customer Repository
  │
  │ 8. INSERT INTO customers
  │    WHERE organization_id = X
  ↓
PostgreSQL
  │
  │ 9. Return new customer
  ↓
Frontend
  │
  │ 10. Redirect to customer list
  ↓
Customer List Page
```

### 3. Multi-Tenant Data Isolation
```
Organization A (ID: 1)        Organization B (ID: 2)
       │                              │
       │                              │
       ↓                              ↓
   User A                         User B
   (JWT: org_id=1)                (JWT: org_id=2)
       │                              │
       │                              │
       ↓                              ↓
   GET /api/customers             GET /api/customers
   Token: {..., org_id: 1}        Token: {..., org_id: 2}
       │                              │
       ↓                              ↓
   Backend extracts org_id        Backend extracts org_id
       │                              │
       ↓                              ↓
   SELECT * FROM customers        SELECT * FROM customers
   WHERE organization_id = 1      WHERE organization_id = 2
       │                              │
       ↓                              ↓
   Returns only A's data          Returns only B's data
   
   ✅ Data Isolation Working!
```

---

## 🗂️ Database Schema

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │───┐
│ name            │   │
│ email (unique)  │   │
│ password_hash   │   │
└─────────────────┘   │
                      │
┌─────────────────┐   │    ┌──────────────────────┐
│ organizations   │   │    │ organization_members │
├─────────────────┤   │    ├──────────────────────┤
│ id (PK)         │───┼───→│ organization_id (FK) │
│ name            │   │    │ user_id (FK)         │←──┘
│ slug (unique)   │   │    │ role                 │
│ email           │   │    └──────────────────────┘
│ phone           │   │
│ address         │   │
└─────────────────┘   │
        │             │
        │ organization_id
        ↓             │
┌─────────────────┐   │
│   customers     │←──┘
├─────────────────┤
│ id (PK)         │
│ organization_id │
│ name            │
│ email           │
│ phone           │
│ address         │
└─────────────────┘
        │
        │ customer_id
        ↓
┌─────────────────┐
│    invoices     │
├─────────────────┤
│ id (PK)         │───┐
│ organization_id │   │
│ customer_id (FK)│   │
│ invoice_number  │   │
│ status          │   │
│ total           │   │
└─────────────────┘   │
        │             │
        │ invoice_id  │
        ↓             │
┌─────────────────┐   │   ┌─────────────────┐
│ invoice_items   │   │   │    payments     │
├─────────────────┤   │   ├─────────────────┤
│ id (PK)         │   └──→│ invoice_id (FK) │
│ invoice_id (FK) │       │ organization_id │
│ product_id (FK) │       │ amount          │
│ quantity        │       │ payment_method  │
│ unit_price      │       │ paid_at         │
│ subtotal        │       └─────────────────┘
└─────────────────┘
        │
        │ product_id
        ↓
┌─────────────────┐
│    products     │
├─────────────────┤
│ id (PK)         │
│ organization_id │
│ name            │
│ description     │
│ price           │
│ unit            │
└─────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                   JWT Authentication                     │
└─────────────────────────────────────────────────────────┘

1. LOGIN
   User → Frontend → Backend
                      │
                      ↓
                  Verify credentials
                      │
                      ↓
                  Generate JWT
                  {
                    user_id: 1,
                    email: "user@example.com",
                    organization_id: 1,
                    role: "owner",
                    exp: 24h
                  }
                      │
                      ↓
   Frontend ← Token ← Backend
      │
      ↓
   Store in localStorage
   
2. PROTECTED REQUEST
   Frontend
      │
      ↓
   Attach token to header
   Authorization: Bearer {token}
      │
      ↓
   Backend Middleware
      │
      ↓
   Validate token signature
      │
      ↓
   Extract claims
      │
      ↓
   Check expiration
      │
      ↓ Valid
   Add to request context
      │
      ↓
   Handler can access:
   - user_id
   - organization_id
   - role
      │
      ↓
   Filter queries by organization_id
      │
      ↓
   Return data
   
3. TOKEN EXPIRED
   Frontend request with expired token
      │
      ↓
   Backend: 401 Unauthorized
      │
      ↓
   Frontend: Clear token
      │
      ↓
   Redirect to login
```

---

## 🏢 Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Single Application                     │
└─────────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ↓               ↓               ↓
    Organization 1  Organization 2  Organization 3
         │               │               │
         ↓               ↓               ↓
    Users: A, B      Users: C, D     Users: E, F
         │               │               │
         ↓               ↓               ↓
    Customers: 10    Customers: 5    Customers: 20
         │               │               │
         ↓               ↓               ↓
    Products: 5      Products: 8     Products: 3
         │               │               │
         ↓               ↓               ↓
    Invoices: 50     Invoices: 30    Invoices: 100

┌─────────────────────────────────────────────────────────┐
│              Shared Database (PostgreSQL)                │
│  ┌───────────────────────────────────────────────────┐  │
│  │  All data in same tables                          │  │
│  │  Filtered by organization_id                      │  │
│  │  Foreign keys ensure data integrity               │  │
│  │  Indexes on organization_id for performance       │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

Security:
✅ JWT contains organization_id
✅ Every query filters by organization_id
✅ Middleware validates token
✅ No cross-organization data access
```

---

## 📦 Component Architecture (Frontend)

```
App
 │
 ├── /login
 │   └── LoginPage
 │       ├── Form
 │       ├── Validation
 │       └── authService.login()
 │
 ├── /register
 │   └── RegisterPage
 │       ├── Form
 │       ├── Validation
 │       └── authService.register()
 │
 └── /dashboard (protected)
     │
     ├── DashboardLayout (HOC)
     │   ├── Header
     │   │   ├── Logo
     │   │   ├── Navigation
     │   │   └── User Menu
     │   ├── Sidebar (mobile)
     │   └── Footer
     │
     ├── /dashboard
     │   └── DashboardPage
     │       ├── Stats Cards
     │       ├── Quick Actions
     │       └── dashboardService.getStats()
     │
     ├── /customers
     │   ├── List Page
     │   │   ├── Search Bar
     │   │   ├── Table
     │   │   ├── Pagination
     │   │   └── customerService.list()
     │   ├── Create Page
     │   │   ├── Form
     │   │   └── customerService.create()
     │   └── Edit Page
     │       ├── Form
     │       └── customerService.update()
     │
     └── /products
         ├── List Page
         │   ├── Search Bar
         │   ├── Card Grid
         │   ├── Pagination
         │   └── productService.list()
         ├── Create Page
         │   ├── Form
         │   └── productService.create()
         └── Edit Page
             ├── Form
             └── productService.update()
```

---

## 🔄 Data Flow Pattern

```
User Action
    ↓
Component/Page
    ↓
Service Layer (API call)
    │
    ├── axios.get()
    ├── axios.post()
    ├── axios.put()
    └── axios.delete()
    ↓
Axios Interceptor
    │
    ├── Add JWT token
    ├── Handle 401 errors
    └── Auto logout on expire
    ↓
HTTP Request to Backend
    ↓
Backend Middleware
    │
    ├── Validate JWT
    ├── Extract claims
    └── Add to context
    ↓
Handler
    │
    ├── Parse request
    ├── Validate input
    └── Call service
    ↓
Service
    │
    ├── Business logic
    ├── Validation
    └── Call repository
    ↓
Repository
    │
    ├── Build SQL query
    ├── Add organization_id filter
    └── Execute query
    ↓
PostgreSQL Database
    ↓
Return data up the chain
    ↓
Format response
    ↓
Send to Frontend
    ↓
Update UI
```

---

## 🎯 Summary

### Architecture Style
- **Backend:** Clean Architecture (Layered)
- **Frontend:** Component-Based (Next.js App Router)
- **Database:** Relational (PostgreSQL)
- **API:** RESTful
- **Auth:** JWT (Stateless)

### Key Patterns
- ✅ Separation of Concerns
- ✅ Dependency Injection
- ✅ Repository Pattern
- ✅ Service Layer Pattern
- ✅ Middleware Pattern
- ✅ Multi-Tenancy Pattern

### Data Flow
```
UI → Service → API → Handler → Service → Repository → DB
```

### Security Layers
```
1. JWT Authentication
2. Multi-tenant Isolation
3. Input Validation
4. SQL Parameter Binding
5. Password Hashing
6. CORS Configuration
```

---

**Architecture ini mendukung:**
- ✅ Scalability (horizontal & vertical)
- ✅ Maintainability (clean code)
- ✅ Testability (layered design)
- ✅ Security (multi-layer protection)
- ✅ Performance (indexed queries)
- ✅ Extensibility (easy to add features)
