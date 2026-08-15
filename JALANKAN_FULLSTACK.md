# 🚀 Cara Jalankan Full Stack Invoice SaaS

## Prasyarat

✅ **Go 1.21+** - Sudah terinstall
✅ **PostgreSQL** - Sudah terinstall (pgAdmin 4)
✅ **Node.js 18+** - Perlu install

Download Node.js: https://nodejs.org/

## Setup Pertama Kali

### Step 1: Backend (Sudah Jalan)

Backend sudah running di port 8080 ✅

Kalau perlu restart:
```bash
# Di root folder
go run cmd/server/main.go
```

### Step 2: Frontend (Setup Baru)

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies (pertama kali saja, ~2-5 menit)
npm install

# Jalankan development server
npm run dev
```

Frontend akan jalan di: **http://localhost:3000**

## Workflow Development

### Terminal 1: Backend
```bash
C:\Freelance\saas\pembukuan> go run cmd/server/main.go
```
Jalan di: `http://localhost:8080`

### Terminal 2: Frontend
```bash
C:\Freelance\saas\pembukuan\frontend> npm run dev
```
Jalan di: `http://localhost:3000`

### Buka Browser
```
http://localhost:3000
```

## Test Full Stack

### 1. Register User Baru

1. Buka http://localhost:3000
2. Klik "Daftar sekarang"
3. Isi form:
   - Nama: Admin User
   - Email: admin@example.com
   - Password: password123
   - Nama Perusahaan: PT Maju Jaya
4. Klik "Daftar"
5. Otomatis login → redirect ke dashboard

### 2. Lihat Dashboard

Dashboard akan menampilkan:
- Total Revenue: Rp 0 (belum ada invoice)
- Invoice Lunas: 0
- Invoice Belum Lunas: 0
- Invoice Jatuh Tempo: 0
- Total Customer: 0

### 3. Cek di Database (pgAdmin 4)

```sql
-- Lihat user yang baru register
SELECT * FROM users;

-- Lihat organization
SELECT * FROM organizations;

-- Lihat membership
SELECT * FROM organization_members;
```

### 4. Test Multi-Tenancy

1. Logout
2. Register user lain dengan email berbeda
3. Login dengan user pertama → hanya lihat data sendiri ✅
4. Login dengan user kedua → hanya lihat data sendiri ✅

## Struktur Project

```
pembukuan/
├── cmd/server/main.go         # Backend entry point
├── internal/                  # Backend code
├── migrations/                # Database migrations
├── pkg/                       # Backend utilities
├── frontend/                  # Frontend Next.js
│   ├── src/
│   │   ├── app/              # Pages
│   │   ├── lib/              # API client
│   │   └── services/         # API services
│   ├── package.json
│   └── README.md
├── .env                       # Backend config
├── run.bat                    # Run backend
└── JALANKAN_FULLSTACK.md     # Ini file ini
```

## Fitur yang Sudah Jalan

### Backend ✅
- Authentication (Register, Login)
- Multi-tenant security
- Customer API
- Product API
- Invoice API
- Payment API
- Dashboard statistics
- 25+ endpoints

### Frontend ✅
- Login page
- Register page
- Dashboard dengan real data
- Token management
- Auto redirect
- Loading states
- Error handling

### Frontend yang Belum ⏳
- Customer management UI
- Product management UI
- Invoice creation UI
- Payment tracking UI
- Reports & charts
- Settings

## Development Tips

### Hot Reload

**Backend (dengan Air)**:
```bash
# Install air
go install github.com/cosmtrek/air@latest

# Jalankan
air

# Edit code → auto restart
```

**Frontend (otomatis)**:
- Edit file di `frontend/src/`
- Otomatis reload di browser

### Debug

**Backend logs**:
Lihat di terminal yang jalankan `go run cmd/server/main.go`

**Frontend logs**:
- Browser console (F12)
- Terminal yang jalankan `npm run dev`

**Database**:
Cek langsung di pgAdmin 4

### Port yang Dipakai

- **8080**: Backend API
- **3000**: Frontend Next.js
- **5432**: PostgreSQL

## Troubleshooting

### Frontend: Module not found

```bash
cd frontend
rm -rf node_modules
npm install
```

### Backend: Database error

```bash
# Cek PostgreSQL running di pgAdmin
# Cek connection string di .env
```

### Port sudah dipakai

**Backend**: Edit `.env` → `APP_PORT=8081`
**Frontend**: Edit `package.json` → `"dev": "next dev -p 3001"`

### CORS Error

Backend sudah setup CORS untuk `http://localhost:3000` ✅

Kalau frontend pakai port lain, edit `.env`:
```
CORS_ORIGIN=http://localhost:3001
```

## Next Development Steps

### Option A: Lanjut Build Frontend

Buat halaman-halaman ini:

1. **Customer Management**
   - List customers dengan search
   - Create/Edit customer form
   - Delete confirmation

2. **Product Management**
   - List products dengan search
   - Create/Edit product form
   - Delete confirmation

3. **Invoice Management**
   - List invoices dengan filter
   - Create invoice wizard
   - Invoice detail view
   - Print/Download PDF

4. **Payment Tracking**
   - Record payment form
   - Payment history
   - Invoice status updates

5. **Reports**
   - Revenue chart (Recharts)
   - Customer reports
   - Export to Excel/CSV

### Option B: Deploy & Test

1. Deploy backend ke VPS
2. Deploy frontend ke Vercel (gratis)
3. Test di production
4. Collect feedback

### Option C: Polish Backend

1. Add PDF invoice generation
2. Add email notifications
3. Add WhatsApp integration
4. Add more reports

## Quick Commands

```bash
# Run backend
go run cmd/server/main.go

# Run frontend
cd frontend && npm run dev

# Install frontend deps (first time)
cd frontend && npm install

# Build frontend for production
cd frontend && npm run build

# Test backend API
curl http://localhost:8080/api/auth/register -X POST -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"test@example.com\",\"password\":\"password123\",\"organization_name\":\"Test Co\"}"
```

## Resources

- Backend API Docs: `README.md`
- API Examples: `API_EXAMPLES.md`
- Frontend Docs: `frontend/README.md`
- Deployment: `DEPLOYMENT.md`

## 🎉 Selamat!

Full stack aplikasi sudah jalan! 

**Backend** → ✅ Production-ready
**Frontend** → ✅ Basic UI jalan
**Database** → ✅ Connected

Tinggal lanjutkan develop fitur-fitur lengkapnya! 🚀

---

**Catatan**: Jangan lupa commit & push ke Git secara berkala! 

```bash
git add .
git commit -m "Add frontend basic pages"
git push
```
