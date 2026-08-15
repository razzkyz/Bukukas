# Panduan Menjalankan Aplikasi Lokal (Tanpa Docker)

## Prasyarat

1. **Go 1.21+** 
   - Download: https://go.dev/dl/
   - Install dan pastikan `go version` berjalan

2. **PostgreSQL 12+**
   - Download: https://www.postgresql.org/download/windows/
   - Atau pakai installer: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Install dengan password yang mudah diingat (misalnya: `postgres`)

3. **Git** (sudah terinstall)

## Langkah Setup

### 1. Setup Database

Buka Command Prompt atau PowerShell, jalankan:

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database (dalam psql)
CREATE DATABASE invoice_saas;

# Keluar
\q
```

**Atau lebih mudah:**
```bash
createdb -U postgres invoice_saas
```

### 2. Konfigurasi Environment

File `.env` sudah dibuat otomatis. **Edit jika perlu**:

```
DATABASE_URL=postgres://postgres:GANTI_PASSWORD@localhost:5432/invoice_saas?sslmode=disable
```

Ganti `GANTI_PASSWORD` dengan password PostgreSQL Anda.

### 3. Install Dependencies

```bash
go mod download
```

### 4. Jalankan Aplikasi

**Cara 1: Pakai file batch**
```bash
run.bat
```

**Cara 2: Manual**
```bash
go run cmd/server/main.go
```

Anda akan melihat output:
```
INFO: Starting Invoice SaaS application in development mode
INFO: Database connection established
INFO: Migration 001_create_users.sql applied successfully
INFO: Migration 002_create_organizations.sql applied successfully
...
INFO: All migrations completed
INFO: Server starting on :8080
INFO: CORS enabled for: http://localhost:5173
```

**Aplikasi berjalan di: http://localhost:8080**

## Testing

### Test Manual dengan Curl

**1. Register User Baru**
```bash
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"organization_name\":\"Acme Inc\"}"
```

**2. Login**
```bash
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

Copy token dari response, lalu gunakan untuk request berikutnya:

**3. Buat Customer (butuh token)**
```bash
curl -X POST http://localhost:8080/api/customers -H "Authorization: Bearer TOKEN_ANDA" -H "Content-Type: application/json" -d "{\"name\":\"Customer ABC\",\"email\":\"customer@example.com\",\"phone\":\"08123456789\",\"address\":\"Jl. Sudirman No. 1\"}"
```

### Test Otomatis

Jalankan:
```bash
test-api.bat
```

## Struktur Project

```
pembukuan/
├── cmd/server/main.go          # Entry point aplikasi
├── internal/                   # Kode aplikasi
│   ├── config/                 # Konfigurasi
│   ├── handler/                # HTTP handlers
│   ├── middleware/             # Middleware
│   ├── model/                  # Model data
│   ├── repository/             # Database access
│   ├── routes/                 # Route setup
│   └── service/                # Business logic
├── migrations/                 # Database migrations (10 files)
├── pkg/                        # Utilities
├── .env                        # Environment config
├── run.bat                     # Script untuk run app
└── test-api.bat               # Script untuk test API
```

## Endpoint API yang Tersedia

### Authentication
- `POST /api/auth/register` - Daftar user baru
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Info user saat ini
- `POST /api/auth/logout` - Logout

### Customers
- `GET /api/customers` - List semua customer
- `POST /api/customers` - Buat customer baru
- `GET /api/customers/:id` - Detail customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Hapus customer

### Products
- `GET /api/products` - List semua produk
- `POST /api/products` - Buat produk baru
- `GET /api/products/:id` - Detail produk
- `PUT /api/products/:id` - Update produk
- `DELETE /api/products/:id` - Hapus produk

### Invoices
- `GET /api/invoices` - List invoice
- `POST /api/invoices` - Buat invoice
- `GET /api/invoices/:id` - Detail invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Hapus invoice
- `POST /api/invoices/:id/send` - Kirim invoice
- `POST /api/invoices/:id/cancel` - Cancel invoice

### Payments
- `GET /api/invoices/:id/payments` - List payment untuk invoice
- `POST /api/invoices/:id/payments` - Catat pembayaran

### Dashboard
- `GET /api/dashboard/stats` - Statistik dashboard
- `GET /api/dashboard/revenue-chart` - Chart revenue

## Troubleshooting

### Error: "Failed to connect to database"

**Solusi:**
1. Pastikan PostgreSQL berjalan
2. Cek username dan password di `.env`
3. Test koneksi: `psql -U postgres -d invoice_saas`

### Error: "Port 8080 already in use"

**Solusi:**
1. Cari aplikasi yang pakai port 8080
2. Atau ganti port di `.env`: `APP_PORT=8081`

### Error: "go: command not found"

**Solusi:**
1. Install Go dari https://go.dev/dl/
2. Restart terminal/cmd setelah install

### Database Error saat migrasi

**Solusi:**
```bash
# Reset database
dropdb -U postgres invoice_saas
createdb -U postgres invoice_saas

# Jalankan ulang aplikasi
run.bat
```

## Tips Development

### Melihat Isi Database

```bash
# Masuk ke psql
psql -U postgres invoice_saas

# Lihat semua tabel
\dt

# Query data
SELECT * FROM users;
SELECT * FROM organizations;
SELECT * FROM customers;

# Keluar
\q
```

### Auto Reload (Hot Reload)

Install Air untuk auto-reload saat edit kode:

```bash
# Install air
go install github.com/cosmtrek/air@latest

# Jalankan dengan air
air
```

File `.air.toml` sudah tersedia.

### Format Kode

```bash
go fmt ./...
```

### Build Executable

```bash
# Build
go build -o invoice-saas.exe cmd/server/main.go

# Jalankan
.\invoice-saas.exe
```

## Testing dengan Postman

1. Buka Postman
2. Import collection (buat sendiri atau pakai curl)
3. Set environment variable:
   - `base_url`: `http://localhost:8080`
   - `token`: (akan diisi setelah login)

## Next Steps

1. ✅ Backend sudah jalan
2. 📱 Buat frontend (React/Next.js)
3. 📧 Tambah fitur email
4. 📄 Tambah generate PDF
5. 🚀 Deploy ke server

## Resource

- **API Examples**: Lihat `API_EXAMPLES.md`
- **Dokumentasi Lengkap**: Lihat `README.md`
- **Deployment**: Lihat `DEPLOYMENT.md`

## Kesimpulan

Sekarang aplikasi berjalan lokal tanpa Docker! 

**Lebih ringan**, **lebih cepat**, dan **lebih mudah debug**.

Untuk testing:
1. Jalankan `run.bat`
2. Buka browser ke http://localhost:8080
3. Test dengan `test-api.bat` atau Postman

Selamat coding! 🚀
