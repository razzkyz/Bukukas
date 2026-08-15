# 📖 Cara Install dan Jalankan Invoice SaaS

## Prerequisites

### 1. Go (Sudah Ada ✅)
Sudah terinstall untuk backend.

### 2. PostgreSQL (Sudah Ada ✅)
Database sudah jalan dengan pgAdmin 4.

### 3. Node.js (Perlu Install)
Download dan install Node.js LTS:
👉 **https://nodejs.org/**

Pilih versi **LTS (Long Term Support)**

Setelah install, test di CMD:
```bash
node --version
npm --version
```

Kalau muncul versi angka, berarti sudah berhasil! ✅

---

## 🚀 Langkah Install

### Backend (Sudah Jalan)

Backend sudah setup dan jalan di `http://localhost:8080` ✅

Kalau perlu restart:
```bash
# Di folder C:\Freelance\saas\pembukuan
go run cmd/server/main.go
```

### Frontend (Install Sekali)

**Cara Otomatis:**
```bash
# Double click file ini:
INSTALL_FRONTEND.bat
```

**Cara Manual:**
```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependencies (2-5 menit)
npm install

# Tunggu sampai selesai download...
```

---

## 🎯 Cara Menjalankan

### Step 1: Jalankan Backend

**Terminal 1 (CMD atau PowerShell):**
```bash
cd C:\Freelance\saas\pembukuan
go run cmd/server/main.go
```

✅ Backend jalan di: `http://localhost:8080`

### Step 2: Jalankan Frontend

**Terminal 2 (CMD atau PowerShell baru):**

**Cara Otomatis:**
```bash
# Double click file ini:
RUN_FRONTEND.bat
```

**Cara Manual:**
```bash
cd C:\Freelance\saas\pembukuan\frontend
npm run dev
```

✅ Frontend jalan di: `http://localhost:3000`

### Step 3: Buka Browser

Buka: **http://localhost:3000**

---

## 🎮 Test Full Stack

### 1. Register Akun Baru

1. Buka http://localhost:3000
2. Klik **"Daftar sekarang"**
3. Isi form:
   - Nama: Admin User
   - Email: admin@test.com
   - Password: password123
   - Nama Perusahaan: PT Saya
4. Klik **"Daftar"**
5. ✅ Otomatis login → masuk dashboard

### 2. Lihat Dashboard

Dashboard menampilkan:
- Total Revenue
- Invoice Lunas / Belum Lunas
- Customer Count
- Quick Actions

### 3. Kelola Customer (SUDAH JADI!)

1. Klik **"📋 Kelola Customer"** atau menu **"Customer"**
2. Klik **"+ Tambah Customer"**
3. Isi data customer:
   - Nama: PT ABC
   - Email: abc@example.com
   - Telepon: 08123456789
   - Alamat: Jl. Sudirman No. 1
4. Klik **"Simpan Customer"**
5. ✅ Customer berhasil ditambahkan!

**Fitur Customer:**
- ✅ List customer dengan search
- ✅ Tambah customer baru
- ✅ Edit customer
- ✅ Hapus customer (dengan konfirmasi)
- ✅ Pagination

### 4. Cek di Database

Buka pgAdmin 4:
```sql
-- Lihat semua customer
SELECT * FROM customers;

-- Lihat dengan join organization
SELECT 
    c.*,
    o.name as organization_name
FROM customers c
JOIN organizations o ON c.organization_id = o.id;
```

---

## 📁 Struktur Project

```
pembukuan/
├── cmd/server/main.go        # Backend entry point
├── internal/                 # Backend code
├── migrations/               # Database migrations
├── pkg/                      # Backend utilities
├── frontend/                 # Frontend Next.js ✨
│   ├── src/
│   │   ├── app/             # Pages
│   │   │   ├── login/       ✅ Sudah jadi
│   │   │   ├── register/    ✅ Sudah jadi
│   │   │   ├── dashboard/   ✅ Sudah jadi
│   │   │   └── customers/   ✅ Sudah jadi (CRUD lengkap!)
│   │   ├── components/      # React components
│   │   │   └── DashboardLayout.tsx  ✅
│   │   ├── lib/             # API client
│   │   │   └── api.ts       ✅
│   │   └── services/        # API services
│   │       ├── authService.ts       ✅
│   │       └── customerService.ts   ✅
│   ├── package.json
│   └── README.md
├── .env                      # Backend config
├── run.bat                   # Run backend
├── INSTALL_FRONTEND.bat      # Install frontend
└── RUN_FRONTEND.bat          # Run frontend
```

---

## ✅ Fitur yang Sudah Jadi

### Backend (100%)
- ✅ Authentication (Register, Login, Logout)
- ✅ Multi-tenant security
- ✅ Customer API (CRUD + search + pagination)
- ✅ Product API (CRUD + search + pagination)
- ✅ Invoice API (CRUD + calculation + status)
- ✅ Payment API (record + tracking)
- ✅ Dashboard API (statistics + charts)

### Frontend
- ✅ **Login & Register** - UI lengkap dengan validasi
- ✅ **Dashboard** - Tampilan statistik real-time
- ✅ **Customer Management** - CRUD lengkap dengan:
  - ✅ List dengan search bar
  - ✅ Create form dengan validasi
  - ✅ Edit form
  - ✅ Delete dengan konfirmasi
  - ✅ Pagination
  - ✅ Loading states
  - ✅ Error handling
- ✅ **Layout** - Sidebar navigation + header + footer
- ✅ **API Integration** - Axios client dengan auto token

### Frontend yang Belum (Coming Soon)
- ⏳ Product management UI
- ⏳ Invoice creation wizard
- ⏳ Payment tracking UI
- ⏳ Reports & charts
- ⏳ Settings page

---

## 🎨 Preview Halaman

### Login Page
- Email input
- Password input  
- Link ke register
- Loading state
- Error messages

### Register Page
- Nama lengkap
- Email
- Password (min 8 karakter)
- Nama perusahaan
- Validation errors
- Auto login setelah register

### Dashboard
- 5 stat cards (revenue, invoices, customers)
- Quick action buttons
- Navigation menu
- User info di header
- Logout button

### Customer List
- Search bar dengan real-time search
- Table dengan data customer
- Edit & Delete buttons per row
- Pagination (Prev/Next)
- Empty state (kalau belum ada data)
- Loading spinner
- Delete confirmation modal

### Customer Form (Create/Edit)
- Form fields: nama, email, phone, address
- Validation client + server side
- Loading button states
- Cancel & Save buttons
- Error messages

---

## 🔧 Troubleshooting

### Frontend: Module not found

```bash
cd frontend
rm -rf node_modules
npm install
```

### Port 3000 sudah dipakai

Edit `frontend/package.json`:
```json
"dev": "next dev -p 3001"
```

### CORS Error

Backend sudah di-set untuk `http://localhost:3000` ✅

Kalau frontend pakai port lain, edit `.env`:
```
CORS_ORIGIN=http://localhost:3001
```

Lalu restart backend.

### Cannot find module '@/...'

Ini normal di TypeScript. Pastikan:
1. `npm install` sudah selesai
2. Restart VS Code
3. TypeScript server reload

### Backend tidak konek

Pastikan backend jalan di `http://localhost:8080`

Test di browser: http://localhost:8080/api/auth/login
(Akan error tapi artinya backend jalan)

---

## 📝 Next Steps

### Opsi 1: Lanjut Build Fitur

Buat halaman Product management (mirip Customer):
1. Copy folder `src/app/customers/`
2. Ganti jadi `src/app/products/`
3. Ganti `customerService` jadi `productService`
4. Sesuaikan form fields

### Opsi 2: Polish UI

- Tambah icons (React Icons)
- Improve responsive design
- Tambah animations
- Dark mode (optional)

### Opsi 3: Deploy

- Frontend: Vercel (gratis!)
- Backend: VPS atau Railway
- Database: PostgreSQL managed

---

## 💡 Tips Development

### Hot Reload Otomatis

**Frontend:** Sudah otomatis! Edit file → auto refresh browser

**Backend:** Install Air:
```bash
go install github.com/cosmtrek/air@latest
air
```

### Debug

**Frontend:**
- Browser DevTools (F12)
- Console untuk error
- Network tab untuk API calls

**Backend:**
- Terminal logs
- pgAdmin untuk database

### VS Code Extensions (Recommended)

- ES7+ React/Redux snippets
- Tailwind CSS IntelliSense
- TypeScript extension
- Go extension

---

## 🎊 Selamat!

Full stack aplikasi sudah jalan dengan sempurna!

**Yang Sudah Jadi:**
- ✅ Backend API production-ready
- ✅ Frontend dengan Next.js 14
- ✅ Authentication complete
- ✅ Customer CRUD lengkap
- ✅ Multi-tenant working
- ✅ Database migrations
- ✅ Responsive design

**Langkah Berikutnya:**
1. Test semua fitur customer
2. Buat Product management (copy customer)
3. Buat Invoice creation
4. Polish & improve
5. Deploy & launch! 🚀

---

**Butuh bantuan?** Cek dokumentasi lainnya:
- `README.md` - Overview lengkap
- `API_EXAMPLES.md` - Test API
- `frontend/README.md` - Frontend docs
- `DEPLOYMENT.md` - Deploy guide

Happy coding! 🎉
