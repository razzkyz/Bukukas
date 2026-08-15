# 📘 BukuKas - Aplikasi Pembukuan & Invoice Digital UMKM

[![Status](https://img.shields.io/badge/Status-Production_Ready-success)]()
[![Go](https://img.shields.io/badge/Go-1.25-blue)]()
[![React](https://img.shields.io/badge/React-18.3-blue)]()
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

---

## 🚀 Quick Start

### **1. Jalankan Backend (Go Server)**
```bash
# Di root folder
go run cmd/server/main.go
```
**Output:**
```
[INFO] Starting BukuKas application in development mode
[INFO] Connected to database successfully
[INFO] Server starting on :8080
[INFO] Security features enabled:
[INFO]   ✓ Rate limiting (Auth: 5/min, API: 100/min)
[INFO]   ✓ Security headers
[INFO]   ✓ SQL injection protection
[INFO]   ✓ JWT authentication
```

### **2. Jalankan Frontend (Vite + React)**
```bash
cd frontend
npm run dev
```
**Output:**
```
VITE v5.0.12  ready in 500 ms
➜  Local:   http://localhost:3000/
```

### **3. Buka Browser**
```
http://localhost:3000/
```

**Selesai! Landing page akan terbuka** 🎉

---

## 📍 Cara Akses Fitur

### **Landing Page (Publik - Tanpa Login)**
```
URL: http://localhost:3000/

Fitur:
✓ Penjelasan lengkap tentang BukuKas
✓ Tombol "Login" di pojok kanan atas
✓ Tombol "Coba Gratis" (menuju register)
✓ Hero section dengan CTA
✓ 6 fitur utama
✓ Testimonial customer
✓ Footer dengan links
✓ TIDAK ada sidebar (karena halaman publik)
```

**Cara Akses Login:**
1. Klik tombol **"Masuk"** di pojok kanan atas navbar
2. Atau klik tombol **"Lihat Demo"** di hero section
3. Atau ketik manual: `http://localhost:3000/login`

---

### **Dashboard (Setelah Login)**
```
URL: http://localhost:3000/dashboard

Fitur:
✓ Sidebar di kiri (menu navigasi)
✓ Header dengan nama user & logout button
✓ 8 stat cards (Revenue, Invoice, Customer, dll)
✓ Quick action buttons
✓ Chart & analytics
✓ Protected route (harus login dulu)
```

**Menu Sidebar:**
- 📊 **Dashboard**: Statistik & analytics
- 👥 **Customer**: Kelola customer & database
- 📦 **Produk**: Kelola produk/jasa
- 📄 **Invoice**: Buat & kelola invoice

---

## 🔐 Security Features (SUDAH AKTIF!)

| Fitur | Status | Keterangan |
|-------|--------|------------|
| **SQL Injection Protection** | ✅ | Semua query menggunakan parameterized statements |
| **Rate Limiting (Auth)** | ✅ | 5 login attempts per menit per IP |
| **Rate Limiting (API)** | ✅ | 100 requests per menit per IP |
| **Password Hashing** | ✅ | Bcrypt with configurable cost (dev: 4, prod: 12) |
| **JWT Authentication** | ✅ | Token-based authentication |
| **Security Headers** | ✅ | X-Frame-Options, CSP, HSTS, dll |
| **CORS Configuration** | ✅ | Whitelist allowed origins |

**Testing Security:**
```bash
# Test rate limiting
.\TEST_SECURITY.bat

# Atau manual test:
# Coba login 6x dalam 1 menit - percobaan ke-6 akan ditolak
```

---

## 📁 Struktur Project

```
bukukas/
├── cmd/
│   └── server/
│       └── main.go                 ← Entry point backend
├── internal/
│   ├── handler/                    ← HTTP handlers
│   ├── middleware/
│   │   ├── rate_limiter.go        ← Rate limiting (NEW!)
│   │   ├── security_headers.go    ← Security headers (NEW!)
│   │   ├── cors.go
│   │   ├── auth.go
│   │   └── logger.go
│   ├── repository/                 ← Database access (SQL injection safe!)
│   ├── service/                    ← Business logic
│   └── routes/                     ← Route definitions
├── pkg/
│   └── auth/
│       └── password.go             ← Bcrypt with env config (NEW!)
├── frontend/
│   ├── src/
│   │   ├── app/                    ← Next.js pages (legacy)
│   │   ├── pages/
│   │   │   ├── Landing.tsx         ← Landing page dengan Login button
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Products.tsx
│   │   │   └── Invoices.tsx
│   │   ├── components/
│   │   │   └── DashboardLayout.tsx ← Sidebar layout (modern design)
│   │   ├── services/               ← API calls
│   │   ├── lib/
│   │   │   └── api.ts              ← Axios config
│   │   ├── main.tsx                ← Entry point
│   │   └── App.tsx                 ← React Router config
│   ├── public/
│   │   └── assets/
│   │       └── images/             ← Taruh logo di sini!
│   ├── vite.config.ts
│   ├── package.json
│   └── .env.local                  ← Frontend config
├── .env                            ← Backend config
├── go.mod
├── go.sum
├── SECURITY_STATUS.md              ← Security documentation (NEW!)
├── SECURITY_IMPROVEMENTS.md        ← Security guide
├── CARA_AKSES_LANDING_PAGE.md     ← Landing page guide (NEW!)
├── URL_DAN_UTM_PARAMETERS.md      ← UTM tracking guide (NEW!)
└── README_LENGKAP.md              ← This file
```

---

## ⚙️ Environment Variables

### **Backend (.env)**
```env
# Application
APP_ENV=development
APP_PORT=8080

# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/invoice_saas?sslmode=disable

# JWT (GANTI di production!)
JWT_SECRET=my-secret-jwt-key-for-development-only

# Bcrypt (4 = dev, 12 = production)
BCRYPT_COST=4

# CORS
CORS_ORIGIN=http://localhost:3000
```

### **Frontend (.env.local)**
```env
VITE_API_URL=http://localhost:8080
```

---

## 🎨 Design & Branding

### **Color Palette**
- **Primary**: Emerald/Teal (hijau segar, cocok untuk UMKM Indonesia)
- **Gradient**: `from-emerald-500 to-teal-600`
- **Background**: Gray-50 (abu-abu muda)

### **Icons**
- **Library**: Lucide React (modern, SVG-based)
- **No Emoji**: Semua sudah diganti dengan professional icons

### **Typography**
- **Font**: System fonts (default)
- **Heading**: Bold, gradient text
- **Body**: Regular, gray-700

### **Logo Placement**
```
frontend/public/assets/images/
├── logo.png           ← Logo utama (taruh di sini!)
├── logo-white.png     ← Logo versi putih
└── favicon.ico        ← Icon browser

Usage di React:
<img src="/assets/images/logo.png" alt="BukuKas" />
```

---

## 🌐 URL Structure

### **Publik (Tanpa Login)**
```
/              ← Landing page
/login         ← Halaman login
/register      ← Halaman register
```

### **Protected (Setelah Login)**
```
/dashboard                ← Dashboard utama
/customers               ← Daftar customer
/customers/create        ← Tambah customer
/customers/:id           ← Detail customer
/products                ← Daftar produk
/products/create         ← Tambah produk
/products/:id            ← Detail produk
/invoices                ← Daftar invoice
/invoices/create         ← Buat invoice
/invoices/:id            ← Detail invoice
/invoices/:id/edit       ← Edit invoice
```

---

## 📊 API Endpoints

### **Authentication**
```
POST   /api/auth/register    ← Register user baru (rate limited: 5/min)
POST   /api/auth/login       ← Login (rate limited: 5/min)
GET    /api/auth/me          ← Get current user (protected)
POST   /api/auth/logout      ← Logout (protected)
```

### **Customers (Protected)**
```
GET    /api/customers        ← List customers (rate limited: 100/min)
POST   /api/customers        ← Create customer
GET    /api/customers/:id    ← Get customer by ID
PUT    /api/customers/:id    ← Update customer
DELETE /api/customers/:id    ← Delete customer
```

### **Products (Protected)**
```
GET    /api/products         ← List products
POST   /api/products         ← Create product
GET    /api/products/:id     ← Get product
PUT    /api/products/:id     ← Update product
DELETE /api/products/:id     ← Delete product
```

### **Invoices (Protected)**
```
GET    /api/invoices         ← List invoices
POST   /api/invoices         ← Create invoice
GET    /api/invoices/:id     ← Get invoice
PUT    /api/invoices/:id     ← Update invoice
DELETE /api/invoices/:id     ← Delete invoice
POST   /api/invoices/:id/send     ← Send invoice to customer
POST   /api/invoices/:id/cancel   ← Cancel invoice
```

### **Payments (Protected)**
```
GET    /api/invoices/:id/payments    ← Get payments for invoice
POST   /api/invoices/:id/payments    ← Record payment
```

### **Dashboard (Protected)**
```
GET    /api/dashboard/stats           ← Get dashboard statistics
GET    /api/dashboard/revenue-chart   ← Get revenue chart data
```

---

## 🧪 Testing

### **Test Backend**
```bash
# Build backend
go build -o bukukas.exe .\cmd\server\main.go

# Run
.\bukukas.exe
```

### **Test Frontend**
```bash
cd frontend

# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### **Test Security**
```bash
# Run security test script
.\TEST_SECURITY.bat
```

---

## 🚀 Production Deployment

### **Checklist Before Production:**

- [ ] **Change JWT_SECRET**
  ```bash
  openssl rand -base64 32
  # Copy output ke .env: JWT_SECRET=<output>
  ```

- [ ] **Change BCRYPT_COST to 12**
  ```env
  BCRYPT_COST=12
  ```

- [ ] **Update CORS_ORIGIN**
  ```env
  CORS_ORIGIN=https://yourdomain.com
  ```

- [ ] **Enable SSL for Database**
  ```env
  DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
  ```

- [ ] **Setup HTTPS Certificate**
  - Let's Encrypt (gratis)
  - Cloudflare SSL
  - AWS Certificate Manager

- [ ] **Build Production Backend**
  ```bash
  # Windows
  go build -o bukukas.exe .\cmd\server\main.go
  
  # Linux
  GOOS=linux GOARCH=amd64 go build -o bukukas ./cmd/server/main.go
  ```

- [ ] **Build Production Frontend**
  ```bash
  cd frontend
  npm run build
  # Deploy folder dist/ ke hosting (Vercel, Netlify, Cloudflare Pages)
  ```

---

## 📚 Dokumentasi Lengkap

| File | Keterangan |
|------|------------|
| `CARA_INSTALL_DAN_JALANKAN.md` | Panduan instalasi & setup |
| `CARA_PAKAI.md` | Panduan penggunaan aplikasi |
| `CARA_AKSES_LANDING_PAGE.md` | Cara akses landing page & flow user |
| `URL_DAN_UTM_PARAMETERS.md` | Penjelasan URL structure & UTM tracking |
| `SECURITY_STATUS.md` | Status & checklist keamanan |
| `SECURITY_IMPROVEMENTS.md` | Panduan implementasi security |
| `API_EXAMPLES.md` | Contoh API calls dengan curl |
| `ARCHITECTURE_DIAGRAM.md` | Diagram arsitektur aplikasi |
| `DEPLOYMENT.md` | Panduan deployment production |

---

## 🆘 Troubleshooting

### **Backend tidak jalan**
```bash
# Cek apakah PostgreSQL sudah jalan
psql -U postgres -d invoice_saas

# Cek environment variables
cat .env

# Cek port 8080 sudah dipakai atau belum
netstat -ano | findstr :8080
```

### **Frontend tidak jalan**
```bash
# Clear cache & reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Login gagal terus**
```bash
# Cek apakah backend jalan
curl http://localhost:8080/api/auth/login

# Cek di browser console (F12)
# Lihat error message di Network tab
```

### **Rate limiting terlalu ketat**
```bash
# Edit main.go, ubah angka:
authLimiter := middleware.NewIPRateLimiter(rate.Every(time.Minute/5), 5)
# Ubah jadi:
authLimiter := middleware.NewIPRateLimiter(rate.Every(time.Minute/10), 10)
# (10 attempts per menit)
```

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👥 Team

- **Developer**: BukuKas Development Team
- **Contact**: [your-email@domain.com]
- **Website**: https://bukukas.id
- **Support**: support@bukukas.id

---

## 🎉 Features Completed

- [x] Backend API with Go (Clean Architecture)
- [x] Frontend with Vite + React + React Router
- [x] JWT Authentication
- [x] Multi-tenant with Organization
- [x] Customer Management (CRUD)
- [x] Product Management (CRUD)
- [x] Invoice Management (Create, Edit, Send, Cancel)
- [x] Payment Tracking
- [x] Dashboard with Analytics
- [x] Landing Page (Modern Design)
- [x] Login/Register Pages
- [x] Modern Sidebar (Collapsible)
- [x] Rate Limiting (Auth: 5/min, API: 100/min)
- [x] SQL Injection Protection
- [x] Security Headers
- [x] Bcrypt Password Hashing (Configurable Cost)
- [x] CORS Configuration
- [x] Professional Icons (Lucide React)
- [x] Responsive Design
- [x] Color Rebrand (Emerald/Teal)

---

## 🔮 Future Roadmap

- [ ] Email notifications (invoice sent, payment received)
- [ ] PDF export for invoices
- [ ] WhatsApp integration (send invoice via WA)
- [ ] Multi-language support (Indonesia & English)
- [ ] Mobile app (React Native)
- [ ] Reporting & analytics enhancements
- [ ] Recurring invoices
- [ ] Payment gateway integration (Midtrans, Xendit)
- [ ] Tax calculation (PPN)
- [ ] Bank account reconciliation

---

**Version:** 1.0.0  
**Last Updated:** 2026-08-16  
**Status:** ✅ Production Ready

