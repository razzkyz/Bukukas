# 🔒 Status Keamanan BukuKas

**Terakhir Diperbarui:** 2026-08-16  
**Status:** ✅ **PRODUKSI SIAP** (dengan catatan di bawah)

---

## ✅ Fitur Keamanan yang Sudah Diimplementasi

### 1. **Proteksi SQL Injection** ✅
**Status:** **AMAN** - Semua query menggunakan parameterized statements

**Implementasi:**
- Semua repository (`internal/repository/*.go`) menggunakan placeholder `$1, $2, $3`
- TIDAK ada string concatenation dalam SQL queries
- Database driver Go secara otomatis melakukan sanitasi parameter

**Contoh:**
```go
// ✅ AMAN
query := "SELECT * FROM users WHERE email = $1"
db.QueryRow(query, email)

// ❌ TIDAK DIGUNAKAN (vulnerable)
query := fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email)
```

**File yang sudah diverifikasi:**
- ✅ `internal/repository/user_repository.go`
- ✅ `internal/repository/customer_repository.go`
- ✅ `internal/repository/invoice_repository.go`
- ✅ `internal/repository/product_repository.go`
- ✅ `internal/repository/payment_repository.go`
- ✅ `internal/repository/organization_repository.go`

---

### 2. **Rate Limiting (Proteksi Brute Force)** ✅
**Status:** **AKTIF**

**Konfigurasi:**
- **Login/Register:** 5 percobaan per menit per IP
- **API Endpoints:** 100 request per menit per IP
- **Cleanup:** Otomatis setiap 1 jam (mencegah memory leak)

**Implementasi:**
- `internal/middleware/rate_limiter.go` - Rate limiter middleware
- `cmd/server/main.go` - Diterapkan pada routes

**Respons ketika limit terlampaui:**
```json
{
  "error": "Terlalu banyak permintaan. Coba lagi nanti."
}
```
HTTP Status: `429 Too Many Requests`

**Testing:**
```bash
# Test rate limiting (gunakan curl atau Postman)
# Coba login 6x dalam 1 menit - percobaan ke-6 akan ditolak
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
```

---

### 3. **Password Security (Bcrypt)** ✅
**Status:** **KONFIGURASI DINAMIS**

**Development (.env):**
```env
BCRYPT_COST=4   # ~5ms per hash (cepat untuk development)
```

**Production (HARUS DIUBAH!):**
```env
BCRYPT_COST=12  # ~400ms per hash (sangat aman)
```

**Implementasi:**
- `pkg/auth/password.go` - Membaca `BCRYPT_COST` dari environment variable
- Default: `bcrypt.DefaultCost` (10) jika tidak diset
- Range valid: 4-31

**Rekomendasi:**
| Environment | Cost | Hash Time | Keamanan |
|-------------|------|-----------|----------|
| Development | 4    | ~5ms      | Cukup    |
| Staging     | 10   | ~100ms    | Baik     |
| Production  | 12   | ~400ms    | Sangat Baik |

---

### 4. **Security Headers** ✅
**Status:** **AKTIF**

**Implementasi:** `internal/middleware/security_headers.go`

**Headers yang diterapkan:**
```
X-Frame-Options: DENY                          # Proteksi clickjacking
X-Content-Type-Options: nosniff                # Cegah MIME sniffing
X-XSS-Protection: 1; mode=block                # Proteksi XSS (legacy browsers)
Content-Security-Policy: default-src 'self'    # CSP
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Production only:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

### 5. **JWT Authentication** ✅
**Status:** **AKTIF**

**Konfigurasi:**
- Token disimpan di `localStorage` (frontend)
- Auto-redirect ke login jika token expired
- Token dikirim via `Authorization: Bearer <token>` header

**Environment Variables:**
```env
# Development
JWT_SECRET=my-secret-jwt-key-for-development-only

# Production (HARUS DIUBAH!)
JWT_SECRET=<generate with: openssl rand -base64 32>
```

**Generate secret untuk production:**
```bash
openssl rand -base64 32
# Output: dGhpcyBpcyBhIHZlcnkgc3Ryb25nIGFuZCByYW5kb20gc2VjcmV0IGtleQ==
```

---

### 6. **CORS Configuration** ✅
**Status:** **AKTIF**

**Development:**
```env
CORS_ORIGIN=http://localhost:3000
```

**Production (gunakan domain asli):**
```env
CORS_ORIGIN=https://yourdomain.com
```

**Implementasi:** `internal/middleware/cors.go`

---

## 📁 Asset & Logo Setup

### Struktur Folder Frontend:
```
frontend/public/
├── assets/
│   ├── images/
│   │   ├── logo.png          ← Taruh logo di sini
│   │   ├── logo-white.png
│   │   └── favicon.ico
│   └── icons/
```

### Cara Pakai di React:
```tsx
// Langsung reference dari /assets/
<img src="/assets/images/logo.png" alt="BukuKas Logo" />
```

### Update Favicon:
Edit `frontend/index.html`:
```html
<link rel="icon" type="image/png" href="/assets/images/favicon.ico" />
```

---

## 🚀 Deployment Checklist

### Backend (Go Server)

**1. Update Environment Variables:**
```env
APP_ENV=production
APP_PORT=443  # atau 80 untuk HTTP

# Database (gunakan SSL!)
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# JWT Secret (WAJIB GANTI!)
JWT_SECRET=<generate-random-32-chars>

# Bcrypt (WAJIB UBAH!)
BCRYPT_COST=12

# CORS (domain production)
CORS_ORIGIN=https://yourdomain.com
```

**2. Build Production Binary:**
```bash
# Windows
go build -o bukukas.exe .\cmd\server\main.go

# Linux/Mac
GOOS=linux GOARCH=amd64 go build -o bukukas ./cmd/server/main.go
```

**3. Jalankan Server:**
```bash
# Windows
.\bukukas.exe

# Linux/Mac
./bukukas
```

**Output yang diharapkan:**
```
[INFO] Starting BukuKas application in production mode
[INFO] Connected to database successfully
[INFO] Server starting on :8080
[INFO] CORS enabled for: https://yourdomain.com
[INFO] Security features enabled:
[INFO]   ✓ Rate limiting (Auth: 5/min, API: 100/min)
[INFO]   ✓ Security headers
[INFO]   ✓ SQL injection protection (parameterized queries)
[INFO]   ✓ JWT authentication
```

---

### Frontend (Vite + React)

**1. Update `.env.local`:**
```env
# Production API URL
VITE_API_URL=https://api.yourdomain.com
```

**2. Build Frontend:**
```bash
cd frontend
npm run build
```

**3. Deploy `dist/` folder** ke:
- **Vercel** (recommended for Vite)
- **Netlify**
- **Cloudflare Pages**
- **AWS S3 + CloudFront**
- Atau static hosting lainnya

---

## 🔐 Security Testing

### 1. Test SQL Injection Protection:
```bash
# Coba inject SQL via email field
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin'\'' OR 1=1--","password":"test"}'

# Expected: Login gagal (SQL injection TIDAK berhasil)
```

### 2. Test Rate Limiting:
```bash
# Bash script untuk test 10x login dalam 10 detik
for i in {1..10}; do
  curl -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' &
done

# Expected: Request ke-6 dan seterusnya ditolak dengan 429 error
```

### 3. Test Security Headers:
```bash
curl -I http://localhost:8080/api/dashboard/stats

# Expected headers:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

### 4. Test Password Hashing:
```bash
# Register user baru dan cek di database
# Password TIDAK boleh terlihat plain text di database

psql -U postgres -d invoice_saas
SELECT email, password_hash FROM users;

# Expected: password_hash dimulai dengan $2a$ (bcrypt format)
```

---

## 📊 Security Scorecard

| Fitur Keamanan | Status | Level |
|----------------|--------|-------|
| SQL Injection Protection | ✅ | **AMAN** |
| Rate Limiting (Auth) | ✅ | **AKTIF** |
| Rate Limiting (API) | ✅ | **AKTIF** |
| Password Hashing (Bcrypt) | ✅ | **KONFIGURASI** |
| JWT Authentication | ✅ | **AKTIF** |
| Security Headers | ✅ | **AKTIF** |
| CORS Configuration | ✅ | **AKTIF** |
| HTTPS (Production) | ⚠️ | **MANUAL** |
| Input Validation | ⚠️ | **PARTIAL** |
| Logging & Monitoring | ⚠️ | **BASIC** |

**Legend:**
- ✅ **Sudah diimplementasi**
- ⚠️ **Perlu konfigurasi manual**
- ❌ **Belum diimplementasi**

---

## ⚠️ Catatan Penting untuk Production

### WAJIB DIUBAH sebelum production:

1. **JWT_SECRET** - Generate random secret baru:
   ```bash
   openssl rand -base64 32
   ```

2. **BCRYPT_COST** - Ubah dari 4 ke 12:
   ```env
   BCRYPT_COST=12
   ```

3. **CORS_ORIGIN** - Ubah ke domain production:
   ```env
   CORS_ORIGIN=https://yourdomain.com
   ```

4. **DATABASE_URL** - Gunakan SSL:
   ```env
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
   ```

5. **HTTPS** - Setup SSL certificate (Let's Encrypt, Cloudflare, dll)

---

## 📚 Referensi

- [OWASP Top 10 Security Risks](https://owasp.org/www-project-top-ten/)
- [Go Security Best Practices](https://github.com/Checkmarx/Go-SCP)
- [Bcrypt Cost Calculator](https://www.bcrypt-calculator.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🆘 Troubleshooting

### Rate limiting tidak berfungsi:
```bash
# Cek apakah middleware sudah diterapkan
# Lihat log server, harus ada: "Security features enabled"
```

### Password hashing terlalu lambat:
```bash
# Kurangi BCRYPT_COST untuk development
BCRYPT_COST=4  # Development only!
```

### CORS error di production:
```bash
# Pastikan CORS_ORIGIN sesuai dengan domain frontend
CORS_ORIGIN=https://yourdomain.com  # TANPA trailing slash!
```

---

**Dibuat oleh:** BukuKas Development Team  
**Kontak:** [your-email@domain.com]  
**Repository:** [github.com/yourorg/bukukas]

