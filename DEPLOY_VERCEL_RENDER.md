# 🚀 Deploy BukuKas ke Vercel + Render

**Frontend** → Vercel (gratis, unlimited bandwidth)  
**Backend** → Render (gratis, 750 jam/bulan)

---

## 📦 Persiapan Deployment

### **1. Cek File .gitignore**

Pastikan file sensitif **TIDAK** di-push ke GitHub:

```gitignore
# Backend
.env
*.exe
bukukas
bukukas.exe

# Frontend
node_modules/
dist/
.env.local

# Database
*.sql
*.db
```

---

### **2. Update Backend untuk Production**

**File: `cmd/server/main.go`**

Tambahkan support untuk environment variable `PORT` (required oleh Render):

```go
package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"invoice-saas/internal/middleware"
	"invoice-saas/internal/routes"
	"invoice-saas/pkg/database"
	"invoice-saas/pkg/logger"
	"invoice-saas/internal/config"
	
	"golang.org/x/time/rate"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		logger.Errorf("Failed to load configuration: %v", err)
		return
	}

	logger.Infof("Starting BukuKas application in %s mode", cfg.AppEnv)

	// Connect to database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		logger.Errorf("Failed to connect to database: %v", err)
		return
	}
	defer db.Close()

	logger.Info("Connected to database successfully")

	// Run migrations
	if err := database.RunMigrations(db, "migrations"); err != nil {
		logger.Errorf("Failed to run migrations: %v", err)
		return
	}

	// Setup rate limiters
	authLimiter := middleware.NewIPRateLimiter(rate.Every(time.Minute/5), 5)
	apiLimiter := middleware.NewIPRateLimiter(rate.Every(time.Minute/100), 100)
	
	go func() {
		ticker := time.NewTicker(1 * time.Hour)
		defer ticker.Stop()
		for range ticker.C {
			authLimiter.CleanupOldEntries()
			apiLimiter.CleanupOldEntries()
		}
	}()

	// Setup routes with rate limiters
	router := routes.SetupWithRateLimiter(db, cfg.JWTSecret, authLimiter, apiLimiter)

	// Apply global middleware (order matters!)
	handler := middleware.SecurityHeadersMiddleware()(router)
	handler = middleware.LoggerMiddleware(handler)
	handler = middleware.CORSMiddleware(cfg.CORSOrigin)(handler)

	// Get port from environment (Render provides this automatically)
	port := os.Getenv("PORT")
	if port == "" {
		port = cfg.AppPort // Use config port for local development
	}
	
	addr := fmt.Sprintf(":%s", port)
	logger.Infof("Server starting on %s", addr)
	logger.Infof("CORS enabled for: %s", cfg.CORSOrigin)
	logger.Infof("Security features enabled:")
	logger.Info("  ✓ Rate limiting (Auth: 5/min, API: 100/min)")
	logger.Info("  ✓ Security headers")
	logger.Info("  ✓ SQL injection protection (parameterized queries)")
	logger.Info("  ✓ JWT authentication")

	if err := http.ListenAndServe(addr, handler); err != nil {
		logger.Errorf("Server failed to start: %v", err)
	}
}
```

---

### **3. Push ke GitHub**

```bash
# Initialize git (kalau belum)
git init
git add .
git commit -m "Initial commit - BukuKas v1.0"

# Create GitHub repository (buka github.com dan create new repo)

# Push to GitHub
git remote add origin https://github.com/USERNAME/bukukas.git
git branch -M main
git push -u origin main
```

---

## 🔵 Deploy Backend ke Render

### **Step 1: Buat Akun Render**

1. Buka: https://render.com/
2. Sign up (bisa pakai GitHub account)
3. Verify email

---

### **Step 2: Deploy PostgreSQL Database**

1. Klik **"New +"** → **"PostgreSQL"**
2. Isi form:
   - **Name**: `bukukas-db`
   - **Database**: `invoice_saas`
   - **User**: `bukukas_user` (otomatis)
   - **Region**: Singapore (closest to Indonesia)
   - **Plan**: **Free** (90 hari, setelah itu $7/bulan)
3. Klik **"Create Database"**
4. **COPY** string koneksi:
   ```
   Internal Database URL: postgresql://user:pass@host/db
   External Database URL: postgresql://user:pass@host/db (untuk connect dari local)
   ```

---

### **Step 3: Deploy Backend (Go API)**

1. Klik **"New +"** → **"Web Service"**
2. Connect GitHub repository `bukukas`
3. Isi form:
   - **Name**: `bukukas-api`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: `.` (root)
   - **Runtime**: **Go**
   - **Build Command**: 
     ```bash
     go build -o bukukas ./cmd/server/main.go
     ```
   - **Start Command**: 
     ```bash
     ./bukukas
     ```
   - **Plan**: **Free** (750 jam/bulan)

4. **Environment Variables** (klik "Advanced"):
   ```
   APP_ENV=production
   DATABASE_URL=<paste Internal Database URL dari Step 2>
   JWT_SECRET=<generate random 32 chars>
   BCRYPT_COST=12
   CORS_ORIGIN=https://bukukas.vercel.app
   ```

   **Generate JWT_SECRET:**
   ```bash
   openssl rand -base64 32
   # Output: dGhpcyBpcyBhIHZlcnkgc3Ryb25nIHNlY3JldA==
   ```

5. Klik **"Create Web Service"**

6. **Tunggu build selesai** (~5 menit)

7. **Copy URL backend:**
   ```
   https://bukukas-api.onrender.com
   ```

---

### **Step 4: Test Backend**

```bash
# Test health check
curl https://bukukas-api.onrender.com/api/auth/login

# Expected response:
# {"error":"Invalid request body"} atau {"error":"Email required"}
# (artinya backend jalan!)
```

---

## 🟢 Deploy Frontend ke Vercel

### **Step 1: Buat Akun Vercel**

1. Buka: https://vercel.com/
2. Sign up dengan GitHub account
3. Authorize Vercel

---

### **Step 2: Deploy Frontend**

1. Klik **"Add New..."** → **"Project"**
2. **Import Git Repository**: Pilih `bukukas`
3. Isi form:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` ← PENTING!
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://bukukas-api.onrender.com
   ```

5. Klik **"Deploy"**

6. **Tunggu build selesai** (~2 menit)

7. **Copy URL frontend:**
   ```
   https://bukukas.vercel.app
   ```

---

### **Step 3: Update Backend CORS**

Backend perlu allow frontend production URL!

1. Buka **Render Dashboard** → `bukukas-api`
2. Klik **"Environment"**
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://bukukas.vercel.app
   ```
4. Klik **"Save Changes"**
5. Render akan auto-restart backend

---

### **Step 4: Test Production**

1. Buka: `https://bukukas.vercel.app`
2. Klik **"Coba Gratis"**
3. Register user baru
4. Login
5. Buka Dashboard → harus muncul data!

---

## ⚙️ Environment Variables Summary

### **Backend (Render)**
```env
APP_ENV=production
PORT=<auto by Render>
DATABASE_URL=<dari Render PostgreSQL>
JWT_SECRET=<random 32 chars>
BCRYPT_COST=12
CORS_ORIGIN=https://bukukas.vercel.app
```

### **Frontend (Vercel)**
```env
VITE_API_URL=https://bukukas-api.onrender.com
```

---

## 🔄 Update Code (Re-deploy)

### **Update Backend:**
```bash
# Edit code
git add .
git commit -m "Update backend"
git push origin main
# Render will auto-deploy! (webhook)
```

### **Update Frontend:**
```bash
# Edit code
git add .
git commit -m "Update frontend"
git push origin main
# Vercel will auto-deploy! (webhook)
```

---

## 💰 Cost Estimation

### **Free Tier (Good for 1-2 bulan testing):**

| Service | Plan | Limit | Cost |
|---------|------|-------|------|
| Render (Backend) | Free | 750 jam/bulan | **$0** |
| Render (Database) | Free | 90 hari trial | **$0** |
| Vercel (Frontend) | Hobby | Unlimited bandwidth | **$0** |
| **TOTAL** | | | **$0** |

### **After Free Trial:**

| Service | Plan | Limit | Cost |
|---------|------|-------|------|
| Render (Backend) | Starter | Always on | **$7/bulan** |
| Render (Database) | Starter | 1GB storage | **$7/bulan** |
| Vercel (Frontend) | Hobby | Unlimited | **$0** |
| **TOTAL** | | | **$14/bulan** |

### **Alternative (Lebih Murah):**

- **Backend + Database**: VPS (Contabo, DigitalOcean) = **$4-6/bulan**
- **Frontend**: Vercel (gratis) = **$0**
- **TOTAL**: **$4-6/bulan**

---

## 🛡️ Security Checklist (Production)

- [x] ✅ JWT_SECRET changed (random 32+ chars)
- [x] ✅ BCRYPT_COST = 12 (production)
- [x] ✅ CORS_ORIGIN = production frontend URL only
- [x] ✅ DATABASE_URL uses SSL (sslmode=require)
- [x] ✅ HTTPS enabled (automatic on Vercel/Render)
- [x] ✅ Rate limiting active (5/min auth, 100/min API)
- [x] ✅ Security headers active
- [x] ✅ SQL injection protection (parameterized queries)

---

## 🐛 Troubleshooting

### **Backend error: "failed to connect to database"**

**Solusi:**
1. Cek `DATABASE_URL` di Render environment
2. Pastikan pakai **Internal Database URL** (bukan External)
3. Cek database status di Render dashboard

### **Frontend error: "Network Error"**

**Solusi:**
1. Cek `VITE_API_URL` di Vercel environment
2. Pastikan backend jalan (buka `https://bukukas-api.onrender.com`)
3. Cek CORS di backend (`CORS_ORIGIN` harus sama dengan frontend URL)

### **Backend cold start lambat (15-30 detik)**

**Ini NORMAL di Render Free Tier!**

Render Free server "sleep" setelah 15 menit tidak dipakai.  
Request pertama butuh 15-30 detik untuk "wake up" server.

**Solusi:**
- Upgrade ke Render Starter ($7/bulan) = Always on
- Atau pakai cron job untuk ping server tiap 10 menit (keep alive)

### **Database hilang setelah 90 hari**

**Render Free Database = Trial 90 hari!**

**Solusi:**
- Upgrade ke Starter ($7/bulan) = Permanent
- Atau backup data dan pindah ke Supabase (gratis 500MB)

---

## 📊 Domain Custom (Optional)

### **Pakai Domain Sendiri (yourdomain.com):**

**Frontend (Vercel):**
1. Beli domain di Namecheap/Cloudflare ($10/tahun)
2. Di Vercel → Project Settings → Domains → Add domain
3. Update DNS records (A/CNAME) di domain provider
4. Tunggu propagasi (~15 menit)
5. Frontend jadi: `https://bukukas.com`

**Backend (Render):**
1. Di Render → Service Settings → Custom Domain
2. Add domain: `api.bukukas.com`
3. Update DNS (CNAME) di domain provider
4. Backend jadi: `https://api.bukukas.com`

**Update Environment:**
- Backend `CORS_ORIGIN=https://bukukas.com`
- Frontend `VITE_API_URL=https://api.bukukas.com`

---

## ✅ Success Checklist

- [ ] Backend deployed ke Render
- [ ] Database PostgreSQL created
- [ ] Environment variables configured
- [ ] Frontend deployed ke Vercel
- [ ] CORS configured correctly
- [ ] Register & login works
- [ ] Dashboard loads data
- [ ] Security features active (rate limiting, JWT, etc.)
- [ ] Domain custom (optional)

---

**Selamat! BukuKas sudah LIVE di production! 🎉**

**URL:**
- Frontend: https://bukukas.vercel.app
- Backend: https://bukukas-api.onrender.com

---

**Dibuat oleh:** BukuKas Development Team  
**Tanggal:** 2026-08-16

