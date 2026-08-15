# 🚀 Panduan Mulai Cepat - Invoice SaaS

## ⚡ 5 Menit Setup & Running

### Prasyarat
- ✅ PostgreSQL sudah terinstall (via pgAdmin 4)
- ✅ Go 1.21+ terinstall
- ✅ Node.js 18+ terinstall

---

## 📝 Step-by-Step

### STEP 1: Setup Database (2 menit)
1. Buka **pgAdmin 4**
2. Klik kanan **Databases** → **Create** → **Database**
3. Nama database: **invoice_saas**
4. Klik **Save**

✅ Database siap!

### STEP 2: Jalankan Backend (1 menit)
```bash
# Buka terminal/cmd
cd C:\Freelance\saas\pembukuan

# Jalankan backend
go run cmd/server/main.go
```

**Tunggu sampai muncul:**
```
INFO: Server starting on :8080
INFO: All migrations completed
```

✅ Backend running di **http://localhost:8080**

### STEP 3: Jalankan Frontend (2 menit)
```bash
# Buka terminal/cmd BARU (jangan tutup terminal backend)
cd C:\Freelance\saas\pembukuan\frontend

# Install dependencies (hanya pertama kali)
npm install

# Jalankan frontend
npm run dev
```

**Tunggu sampai muncul:**
```
VITE ready in 500ms
Local: http://localhost:3000
```

✅ Frontend running di **http://localhost:3000**

---

## 🎯 Mulai Menggunakan

### 1. Buka Browser
Buka: **http://localhost:3000**

### 2. Daftar Akun Baru
- Klik **"Daftar"**
- Isi form:
  - Organization Name: **PT Nama Perusahaan Anda**
  - Full Name: **Nama Anda**
  - Email: **email@anda.com**
  - Password: **password**
- Klik **"Daftar"**

### 3. Login
- Login dengan email & password yang baru dibuat
- Anda akan masuk ke **Dashboard**

### 4. Buat Data Master
**A. Tambah Customer:**
- Menu **Customers** → **Tambah Customer**
- Isi nama, email, phone, address
- **Simpan**

**B. Tambah Product:**
- Menu **Products** → **Tambah Product**
- Isi nama, harga, unit, deskripsi
- **Simpan**

### 5. Buat Invoice Pertama
- Menu **Invoices** → **Buat Invoice Baru**
- Pilih customer
- Set tanggal & jatuh tempo
- Tambah items (pilih dari product atau isi manual)
- Set tax & discount (optional)
- **Simpan Invoice**

### 6. Kirim & Catat Pembayaran
- Buka detail invoice
- Klik **"📧 Kirim Invoice"** (status → Sent)
- Klik **"💰 Catat Pembayaran"**
- Isi jumlah & metode pembayaran
- **Simpan** (status otomatis → Paid jika lunas)

---

## ✅ Selesai!

Sekarang Anda bisa:
- ✅ Manage customers & products
- ✅ Buat & kirim invoice
- ✅ Catat pembayaran
- ✅ Monitor status invoice
- ✅ Lihat statistik di dashboard

---

## 🎓 Panduan Lengkap

Untuk informasi lebih detail, baca:

- **[NEXT_STEPS.md](NEXT_STEPS.md)** - Penjelasan fitur lengkap
- **[TESTING_CHECKLIST_LENGKAP.md](TESTING_CHECKLIST_LENGKAP.md)** - Testing semua fitur
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - Contoh API calls
- **[README.md](README.md)** - Dokumentasi teknis

---

## ❓ Troubleshooting

### Backend tidak jalan?
```bash
# Check PostgreSQL
# Buka pgAdmin 4, pastikan database invoice_saas ada

# Check .env file
# Pastikan DATABASE_URL benar:
DATABASE_URL=postgres://postgres:postgres@localhost:5432/invoice_saas?sslmode=disable
```

### Frontend tidak jalan?
```bash
# Hapus node_modules dan install ulang
cd frontend
rmdir /s node_modules
npm install
npm run dev
```

### Login error?
- Check backend sudah jalan di port 8080
- Check `.env.local` di frontend:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8080
  ```
- Clear browser localStorage (F12 → Application → Local Storage → Clear)

---

## 🎉 Happy Coding!

**Aplikasi Invoice SaaS Anda sudah SIAP PAKAI!**

Selamat mencoba dan semoga sukses! 🚀
