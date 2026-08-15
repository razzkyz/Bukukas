# 🚀 Cara Akses Landing Page - BukuKas

## 📍 URL Landing Page

```
http://localhost:3000/
```

**Atau di production:**
```
https://yourdomain.com/
```

---

## 🎯 Cara Mengakses

### **1. Jalankan Frontend**

```bash
cd frontend
npm run dev
```

**Output:**
```
VITE v5.0.12  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### **2. Buka Browser**

**Ketik di address bar:**
```
http://localhost:3000/
```

atau klik link dari terminal.

---

## 🖼️ Tampilan Landing Page

### **Bagian 1: Navigation Bar (Paling Atas)**

```
┌─────────────────────────────────────────────────────┐
│  [Logo] BukuKas              [Masuk] [Coba Gratis]  │
└─────────────────────────────────────────────────────┘
        👆                           👆        👆
     Logo BukuKas            Button Login  Button Register
```

**Fitur:**
- **Logo BukuKas**: Klik untuk kembali ke landing page
- **Button "Masuk"**: Menuju `/login` (halaman login)
- **Button "Coba Gratis"**: Menuju `/register` (halaman register)

---

### **Bagian 2: Hero Section (Banner Utama)**

```
┌───────────────────────────────────────────────────┐
│                                                   │
│  Kelola Keuangan Bisnis Jadi Super Mudah         │
│                                                   │
│  BukuKas adalah aplikasi pembukuan modern         │
│  untuk UMKM, freelancer, dan usaha kecil.        │
│                                                   │
│  [Mulai Gratis Sekarang]  [Lihat Demo]          │
│                                                   │
│  ✓ Gratis selamanya  ✓ Tanpa kartu kredit       │
│                                                   │
└───────────────────────────────────────────────────┘
```

**Fitur:**
- **"Mulai Gratis Sekarang"**: Tombol CTA (Call To Action) menuju `/register`
- **"Lihat Demo"**: Tombol menuju `/login` (untuk coba demo)

---

### **Bagian 3: Features Section (Penjelasan Fitur)**

```
┌──────────────────────────────────────────┐
│  [Icon] Buku Kas Digital                 │
│  Catat semua transaksi bisnis Anda       │
│  secara otomatis dan real-time           │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  [Icon] Invoice Profesional              │
│  Buat invoice cantik dalam hitungan      │
│  detik, kirim langsung ke customer       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  [Icon] Kelola Customer                  │
│  Database customer lengkap dengan        │
│  riwayat transaksi dan pembayaran        │
└──────────────────────────────────────────┘

... dan 3 fitur lainnya
```

---

### **Bagian 4: Benefits Section (Kenapa Harus Pakai BukuKas)**

```
Kenapa Harus Pakai BukuKas?

✓ Hemat waktu hingga 5 jam per minggu
✓ Tidak perlu Excel ribet lagi
✓ Tagihan dibayar lebih cepat
✓ Pantau cashflow real-time
✓ Invoice profesional otomatis
✓ Laporan pajak lebih mudah
```

---

### **Bagian 5: Testimonials (Testimoni Customer)**

```
"BukuKas bikin hidup saya jauh lebih mudah.
 Invoice otomatis, customer happy, saya juga happy!"
 — Budi Santoso, Owner Toko Elektronik

"Dulu pakai Excel capek banget. Sekarang pakai BukuKas,
 semua otomatis dan kelihatan profesional."
 — Sarah Wijaya, Freelance Designer
```

---

### **Bagian 6: CTA Section (Final Call To Action)**

```
┌──────────────────────────────────────────┐
│  Siap untuk Bisnis yang Lebih Tertata?  │
│                                          │
│  Bergabung dengan ribuan pengusaha yang  │
│  sudah merasakan kemudahan BukuKas       │
│                                          │
│  [Coba Gratis 30 Hari]  [Sudah Punya    │
│                          Akun? Masuk]    │
└──────────────────────────────────────────┘
```

---

### **Bagian 7: Footer (Paling Bawah)**

```
┌───────────────────────────────────────────┐
│  BukuKas                                  │
│  Platform pembukuan modern untuk UMKM     │
│                                           │
│  Produk        Perusahaan      Bantuan   │
│  - Fitur       - Tentang Kami  - Support │
│  - Harga       - Blog          - Docs    │
│  - FAQ         - Karir         - Kontak  │
│                                           │
│  © 2026 BukuKas. All rights reserved.    │
└───────────────────────────────────────────┘
```

---

## 🔄 Flow User Journey

### **Scenario 1: User Baru Ingin Coba**

```
1. User buka: http://localhost:3000/
   └─> Tampil: Landing Page (publik, tanpa sidebar)

2. User scroll, baca fitur-fitur BukuKas
   └─> User tertarik!

3. User klik: "Coba Gratis" di navigation bar
   └─> Redirect ke: http://localhost:3000/register

4. User isi form register (nama, email, password)
   └─> Submit

5. Backend create user + organization
   └─> Return JWT token

6. Frontend save token ke localStorage
   └─> Redirect ke: http://localhost:3000/dashboard

7. Dashboard tampil dengan SIDEBAR di kiri
   └─> User sudah login dan bisa pakai semua fitur!
```

---

### **Scenario 2: User Sudah Punya Akun**

```
1. User buka: http://localhost:3000/
   └─> Tampil: Landing Page

2. User klik: "Masuk" di pojok kanan atas
   └─> Redirect ke: http://localhost:3000/login

3. User isi email & password
   └─> Submit

4. Backend verify credentials
   └─> Return JWT token

5. Frontend save token
   └─> Redirect ke: http://localhost:3000/dashboard

6. Dashboard tampil dengan SIDEBAR
   └─> User bisa langsung kerja!
```

---

### **Scenario 3: User Sudah Login (Buka Browser Lagi)**

```
1. User buka: http://localhost:3000/
   └─> Landing page tetap tampil (tapi token sudah ada di localStorage)

2. OPSI A: User klik menu Dashboard di navbar (jika ada)
   └─> Langsung ke: http://localhost:3000/dashboard

2. OPSI B: User ketik manual: http://localhost:3000/dashboard
   └─> Langsung ke: Dashboard (karena token valid)

3. OPSI C: User klik "Masuk" di landing page
   └─> Ke halaman login, tapi auto-redirect ke dashboard (karena sudah login)
```

---

## 🖱️ Tombol dan Link

### **Di Landing Page:**

| Element | Action | Target URL |
|---------|--------|------------|
| Logo "BukuKas" | Click | `/` (refresh landing page) |
| Button "Masuk" (navbar) | Click | `/login` |
| Button "Coba Gratis" (navbar) | Click | `/register` |
| Button "Mulai Gratis Sekarang" (hero) | Click | `/register` |
| Button "Lihat Demo" (hero) | Click | `/login` |
| Button "Coba Gratis 30 Hari" (CTA) | Click | `/register` |
| Button "Sudah Punya Akun? Masuk" (CTA) | Click | `/login` |
| Link Footer (Fitur, Harga, etc.) | Click | `#` (placeholder) |

---

### **Setelah Login (Dashboard):**

| Element | Action | Target URL |
|---------|--------|------------|
| Logo "BukuKas" (sidebar) | Click | `/dashboard` |
| Menu "Dashboard" | Click | `/dashboard` |
| Menu "Customer" | Click | `/customers` |
| Menu "Produk" | Click | `/products` |
| Menu "Invoice" | Click | `/invoices` |
| Button "Logout" (header) | Click | Logout + redirect ke `/login` |

---

## 🎨 Perbedaan Landing Page vs Dashboard

### **Landing Page (Publik)**
```
✅ TIDAK ADA SIDEBAR
✅ Navigation bar sederhana (Logo + Masuk + Coba Gratis)
✅ Penjelasan lengkap tentang BukuKas
✅ Testimonial customer
✅ Footer dengan link
✅ Bisa diakses siapa saja (tanpa login)
```

### **Dashboard (Setelah Login)**
```
✅ ADA SIDEBAR di kiri (menu navigasi)
✅ Header dengan nama user + logout button
✅ Protected route (harus login)
✅ Stat cards (revenue, invoice, customer, dll)
✅ Quick action buttons
✅ Chart & analytics
```

---

## 🔧 Testing

### **Test 1: Landing Page Terbuka**
```bash
1. Jalankan frontend: npm run dev
2. Buka browser: http://localhost:3000/
3. Expected: Landing page tampil dengan hero section, features, testimonials
```

### **Test 2: Tombol Login Berfungsi**
```bash
1. Di landing page, klik "Masuk" (pojok kanan atas)
2. Expected: Redirect ke http://localhost:3000/login
3. Halaman login tampil dengan form email & password
```

### **Test 3: Tombol Register Berfungsi**
```bash
1. Di landing page, klik "Coba Gratis"
2. Expected: Redirect ke http://localhost:3000/register
3. Halaman register tampil dengan form nama, email, password
```

### **Test 4: Login → Dashboard (dengan Sidebar)**
```bash
1. Di halaman login, isi email & password
2. Klik "Masuk"
3. Expected: Redirect ke http://localhost:3000/dashboard
4. Dashboard tampil dengan SIDEBAR di kiri
5. Menu Dashboard, Customer, Produk, Invoice muncul di sidebar
```

---

## 🚨 Troubleshooting

### **Problem: Landing page tidak muncul**
```bash
# Cek apakah frontend sudah jalan
npm run dev

# Expected output:
# ➜  Local:   http://localhost:3000/
```

### **Problem: Klik "Masuk" tidak redirect**
```bash
# Cek App.tsx, pastikan route `/login` ada
# File: frontend/src/App.tsx

<Route path="/login" element={<Login />} />
```

### **Problem: Setelah login, sidebar tidak muncul**
```bash
# Cek DashboardLayout.tsx
# Pastikan component DashboardLayout dipakai di route protected

<Route element={<DashboardLayout />}>
  <Route path="/dashboard" element={<Dashboard />} />
  ...
</Route>
```

---

## 📱 Responsive Design

Landing page sudah responsive untuk berbagai ukuran layar:

| Device | Width | Layout |
|--------|-------|--------|
| Desktop | > 1024px | 2 column grid (text + image) |
| Tablet | 768px - 1024px | 1 column, adjusted spacing |
| Mobile | < 768px | 1 column, stacked layout |

---

## ✅ Checklist

- [x] Landing page accessible di root URL (`/`)
- [x] Tombol "Masuk" di pojok kanan atas navigation bar
- [x] Tombol "Coba Gratis" di navigation bar
- [x] Hero section dengan CTA buttons
- [x] Features section (6 fitur)
- [x] Benefits section (6 manfaat)
- [x] Testimonials section (3 testimoni)
- [x] Final CTA section
- [x] Footer dengan links
- [x] Responsive design
- [x] TIDAK ada sidebar di landing page (karena publik)
- [x] Redirect ke login/register berfungsi
- [x] Setelah login, redirect ke dashboard dengan sidebar

---

**Status:** ✅ Ready to Use  
**Last Updated:** 2026-08-16  
**Developer:** BukuKas Team

