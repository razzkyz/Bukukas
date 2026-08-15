# 🧪 Testing Checklist - Aplikasi Invoice SaaS

## ✅ Panduan Testing Lengkap

Gunakan checklist ini untuk memastikan semua fitur berjalan dengan baik.

---

## 🚀 PERSIAPAN

### 1. Backend Setup
- [ ] PostgreSQL sudah running (cek di pgAdmin 4)
- [ ] Database `invoice_saas` sudah dibuat
- [ ] Backend jalan di port 8080
- [ ] Lihat log: "Server starting on :8080"
- [ ] Lihat log: "All migrations completed"

**Cara test:**
```bash
# Terminal 1 - Run backend
cd C:\Freelance\saas\pembukuan
go run cmd/server/main.go

# Harus muncul:
# INFO: Server starting on :8080
# INFO: CORS enabled for: http://localhost:3000
```

### 2. Frontend Setup
- [ ] Node.js terinstall (versi 18+)
- [ ] Dependencies sudah terinstall
- [ ] Frontend jalan di port 3000
- [ ] Tidak ada error di console

**Cara test:**
```bash
# Terminal 2 - Run frontend
cd C:\Freelance\saas\pembukuan\frontend
npm install
npm run dev

# Harus muncul:
# VITE ready in 500ms
# Local: http://localhost:3000
```

---

## 🔐 AUTHENTICATION TESTING

### Register (Daftar Akun Baru)
- [ ] Buka http://localhost:3000
- [ ] Klik link "Daftar"
- [ ] Isi form register:
  - [ ] Organization Name: "PT Testing Indonesia"
  - [ ] Full Name: "Admin Test"
  - [ ] Email: "admin@testing.com"
  - [ ] Password: "password123"
- [ ] Klik "Daftar"
- [ ] Redirect ke halaman login
- [ ] Muncul alert/message sukses

**Expected Result:** 
✅ Akun berhasil dibuat, redirect ke login

### Login
- [ ] Di halaman login
- [ ] Isi email: "admin@testing.com"
- [ ] Isi password: "password123"
- [ ] Klik "Login"
- [ ] Redirect ke dashboard
- [ ] Token tersimpan di localStorage

**Expected Result:**
✅ Login berhasil, masuk ke dashboard

**Check localStorage:**
- Buka DevTools (F12) → Application → Local Storage
- Ada key `token` dengan value JWT

---

## 📊 DASHBOARD TESTING

### Dashboard View
- [ ] Setelah login, berada di halaman dashboard
- [ ] Ada 4 stat cards: Revenue, Invoices, Customers, Products
- [ ] Awalnya semua = 0 atau "Rp 0"
- [ ] Ada sidebar dengan menu:
  - [ ] Dashboard
  - [ ] Customers
  - [ ] Products
  - [ ] Invoices
  - [ ] Logout

**Expected Result:**
✅ Dashboard tampil dengan layout lengkap

---

## 👥 CUSTOMER TESTING

### Create Customer (Tambah Customer)
- [ ] Klik menu "Customers" di sidebar
- [ ] Klik tombol "Tambah Customer"
- [ ] Isi form:
  - [ ] Nama: "PT ABC Indonesia"
  - [ ] Email: "abc@company.com"
  - [ ] Phone: "081234567890"
  - [ ] Address: "Jl. Sudirman No. 123, Jakarta"
- [ ] Klik "Simpan Customer"
- [ ] Redirect ke list customers
- [ ] Customer baru muncul di list

**Expected Result:**
✅ Customer berhasil dibuat

### Search Customer
- [ ] Di halaman customers
- [ ] Ketik di search box: "ABC"
- [ ] List filtered hanya tampil customer dengan nama "ABC"
- [ ] Clear search, semua customer muncul lagi

**Expected Result:**
✅ Search berfungsi dengan baik

### Edit Customer
- [ ] Di list customers, klik salah satu customer
- [ ] Masuk ke halaman edit
- [ ] Ubah nama menjadi: "PT ABC Indonesia Tbk"
- [ ] Klik "Update Customer"
- [ ] Redirect ke list
- [ ] Nama customer sudah berubah

**Expected Result:**
✅ Customer berhasil diupdate

### Create More Customers (untuk testing)
Buat minimal 3 customers total:
- [ ] "PT ABC Indonesia Tbk"
- [ ] "CV XYZ Technologies"
- [ ] "Toko Makmur Jaya"

---

## 📦 PRODUCT TESTING

### Create Product (Tambah Product)
- [ ] Klik menu "Products" di sidebar
- [ ] Klik tombol "Tambah Product"
- [ ] Isi form:
  - [ ] Nama: "Jasa Konsultasi IT"
  - [ ] Harga: "5000000"
  - [ ] Unit: "jam"
  - [ ] Deskripsi: "Konsultasi teknologi informasi"
- [ ] Klik "Simpan Product"
- [ ] Redirect ke list products
- [ ] Product baru muncul di list

**Expected Result:**
✅ Product berhasil dibuat

### Search Product
- [ ] Di halaman products
- [ ] Ketik di search box: "Konsultasi"
- [ ] List filtered menampilkan product yang relevan
- [ ] Clear search, semua product muncul

**Expected Result:**
✅ Search berfungsi

### Edit Product
- [ ] Klik salah satu product
- [ ] Ubah harga menjadi: "6000000"
- [ ] Klik "Update Product"
- [ ] Redirect ke list
- [ ] Harga sudah berubah

**Expected Result:**
✅ Product berhasil diupdate

### Create More Products (untuk testing)
Buat minimal 3 products total:
- [ ] "Jasa Konsultasi IT" - Rp 6.000.000
- [ ] "Website Development" - Rp 15.000.000
- [ ] "Maintenance Server" - Rp 3.000.000

---

## 📄 INVOICE TESTING (LENGKAP!)

### Create Invoice - Basic
- [ ] Klik menu "Invoices" di sidebar
- [ ] Klik "Buat Invoice Baru"
- [ ] **Section 1: Informasi Invoice**
  - [ ] Pilih Customer: "PT ABC Indonesia Tbk"
  - [ ] Tanggal Invoice: (hari ini)
  - [ ] Jatuh Tempo: (7 hari dari sekarang)
  
- [ ] **Section 2: Item Invoice**
  - [ ] Item #1:
    - [ ] Pilih Product: "Jasa Konsultasi IT"
    - [ ] Deskripsi auto-fill: "Jasa Konsultasi IT"
    - [ ] Quantity: "40" (40 jam)
    - [ ] Harga auto-fill: "6000000"
    - [ ] Subtotal: Rp 240.000.000
  - [ ] Klik "+ Tambah Item"
  - [ ] Item #2:
    - [ ] Pilih Product: "Maintenance Server"
    - [ ] Quantity: "1"
    - [ ] Harga: "3000000"
    - [ ] Subtotal: Rp 3.000.000
  
- [ ] **Section 3: Perhitungan**
  - [ ] Pajak: "24300000" (PPN 10%)
  - [ ] Diskon: "0"
  - [ ] Total dihitung otomatis: Rp 267.300.000
  
- [ ] **Section 4: Catatan**
  - [ ] Notes: "Pembayaran melalui transfer bank"
  
- [ ] Klik "Simpan Invoice"
- [ ] Redirect ke list invoices
- [ ] Invoice baru muncul dengan status **DRAFT**

**Expected Result:**
✅ Invoice berhasil dibuat dengan status Draft

### View Invoice Detail
- [ ] Di list invoices, klik invoice yang baru dibuat
- [ ] Halaman detail invoice terbuka
- [ ] **Cek tampilan:**
  - [ ] Invoice number tampil (contoh: INV-2024-001)
  - [ ] Status badge: **DRAFT** (warna abu-abu)
  - [ ] Info customer lengkap (nama, email, phone, address)
  - [ ] Tanggal invoice & jatuh tempo tampil
  - [ ] Tabel items dengan 2 baris
  - [ ] Perhitungan: Subtotal, Pajak, Total
  - [ ] Catatan tampil
  - [ ] Section "Riwayat Pembayaran" kosong
  - [ ] Tombol aksi:
    - [ ] "📧 Kirim Invoice"
    - [ ] "✏️ Edit"
    - [ ] "❌ Batalkan Invoice"
    - [ ] "🗑️ Hapus Invoice"
    - [ ] "🖨️ Print / PDF"

**Expected Result:**
✅ Detail invoice tampil lengkap

### Edit Invoice (Draft only)
- [ ] Di detail invoice, klik "✏️ Edit"
- [ ] Masuk ke halaman edit
- [ ] Form ter-isi dengan data existing
- [ ] Ubah quantity item #1 dari 40 → 50 jam
- [ ] Total otomatis update: Rp 327.300.000
- [ ] Klik "Update Invoice"
- [ ] Redirect ke detail invoice
- [ ] Total sudah berubah

**Expected Result:**
✅ Invoice berhasil diupdate

### Send Invoice (Change status Draft → Sent)
- [ ] Di detail invoice
- [ ] Klik "📧 Kirim Invoice"
- [ ] Muncul confirmation dialog: "Kirim invoice ini ke customer?"
- [ ] Klik OK/Confirm
- [ ] Alert: "Invoice berhasil dikirim!"
- [ ] Page reload otomatis
- [ ] Status berubah dari DRAFT → **SENT** (warna biru)
- [ ] Tombol "Edit" & "Hapus" hilang
- [ ] Muncul tombol "💰 Catat Pembayaran"

**Expected Result:**
✅ Invoice status berubah ke Sent

### Record Payment - Partial Payment
- [ ] Di detail invoice (status: SENT)
- [ ] Klik "💰 Catat Pembayaran" atau tombol "+ Tambah Pembayaran"
- [ ] Modal pembayaran terbuka
- [ ] **Cek info di modal:**
  - [ ] Total Invoice: Rp 327.300.000
  - [ ] Sudah Dibayar: Rp 0
  - [ ] Sisa Tagihan: Rp 327.300.000
  
- [ ] **Isi form pembayaran:**
  - [ ] Jumlah: "100000000" (partial payment)
  - [ ] Metode: "Transfer Bank"
  - [ ] Tanggal: (hari ini)
  - [ ] Catatan: "Pembayaran DP 30%"
  
- [ ] Klik "Simpan Pembayaran"
- [ ] Alert: "Pembayaran berhasil dicatat!"
- [ ] Modal tertutup
- [ ] Page reload
- [ ] **Cek perubahan:**
  - [ ] Status masih **SENT** (belum lunas)
  - [ ] Section pembayaran ada 1 entry:
    - Jumlah: Rp 100.000.000
    - Tanggal & metode tampil
    - Catatan tampil
  - [ ] Summary:
    - Total Invoice: Rp 327.300.000
    - Total Dibayar: Rp 100.000.000 (hijau)
    - Sisa: Rp 227.300.000 (merah)

**Expected Result:**
✅ Pembayaran parsial tercatat, status masih Sent

### Record Payment - Final Payment (Full Paid)
- [ ] Klik "+ Tambah Pembayaran" lagi
- [ ] **Isi form:**
  - [ ] Jumlah: "227300000" (sisa tagihan)
  - [ ] Metode: "Transfer Bank"
  - [ ] Tanggal: (hari ini)
  - [ ] Catatan: "Pelunasan"
  
- [ ] Klik "Simpan Pembayaran"
- [ ] Page reload
- [ ] **Cek perubahan:**
  - [ ] Status otomatis berubah → **PAID** (warna hijau)
  - [ ] Section pembayaran ada 2 entries
  - [ ] Summary:
    - Total Dibayar: Rp 327.300.000
    - Sisa: Rp 0 (hijau)
  - [ ] Tombol "Catat Pembayaran" hilang (sudah lunas)

**Expected Result:**
✅ Status otomatis berubah ke PAID setelah lunas

### Create Invoice with Manual Items (No Product)
- [ ] Buat invoice baru
- [ ] Pilih customer: "CV XYZ Technologies"
- [ ] Set tanggal
- [ ] **Tambah item manual (tanpa pilih product):**
  - [ ] Produk: (kosongkan)
  - [ ] Deskripsi: "Custom Development Project"
  - [ ] Quantity: "1"
  - [ ] Harga: "50000000"
- [ ] Simpan invoice
- [ ] Invoice tersimpan dengan benar

**Expected Result:**
✅ Invoice dengan item manual (non-product) berhasil dibuat

### Test Invoice with Discount
- [ ] Buat invoice baru
- [ ] Pilih customer: "Toko Makmur Jaya"
- [ ] Tambah item dengan subtotal: Rp 10.000.000
- [ ] Pajak: "1000000" (PPN)
- [ ] **Diskon: "500000"**
- [ ] Total: Rp 10.500.000 (subtotal + pajak - diskon)
- [ ] Simpan
- [ ] Cek detail: diskon tampil dengan tanda minus

**Expected Result:**
✅ Diskon dihitung dengan benar

### Cancel Invoice
- [ ] Buat invoice baru (atau gunakan yang draft/sent)
- [ ] Send invoice (ubah ke status SENT)
- [ ] Di detail, klik "❌ Batalkan Invoice"
- [ ] Confirm dialog: "Batalkan invoice ini?"
- [ ] Klik OK
- [ ] Status berubah → **CANCELLED** (warna abu-abu)
- [ ] Semua tombol aksi hilang
- [ ] Tidak bisa edit/kirim/payment lagi

**Expected Result:**
✅ Invoice berhasil dibatalkan

### Delete Invoice (Draft only)
- [ ] Buat invoice baru, jangan di-send (tetap DRAFT)
- [ ] Di detail, klik "🗑️ Hapus Invoice"
- [ ] Confirm: "Hapus invoice ini?"
- [ ] Klik OK
- [ ] Redirect ke list invoices
- [ ] Invoice hilang dari list

**Expected Result:**
✅ Invoice draft berhasil dihapus

### Invoice List Filters
- [ ] Kembali ke list invoices
- [ ] Klik tab/filter **"Draft"**
  - [ ] Hanya invoice dengan status DRAFT yang tampil
- [ ] Klik tab **"Sent"**
  - [ ] Hanya invoice SENT yang tampil
- [ ] Klik tab **"Paid"**
  - [ ] Hanya invoice PAID yang tampil
- [ ] Klik tab **"Semua"**
  - [ ] Semua invoice tampil (semua status)

**Expected Result:**
✅ Filter status berfungsi dengan baik

---

## 📊 DASHBOARD UPDATE TESTING

### Check Dashboard Stats Update
- [ ] Kembali ke Dashboard
- [ ] **Cek stat cards:**
  - [ ] Total Revenue: (sum dari semua invoice paid)
  - [ ] Total Invoices: (jumlah semua invoice)
  - [ ] Total Customers: (3 customers yang dibuat)
  - [ ] Total Products: (3 products yang dibuat)
- [ ] Angka harus sesuai dengan data yang sudah dibuat

**Expected Result:**
✅ Dashboard menampilkan statistik real-time

---

## 🔒 AUTHORIZATION TESTING

### Multi-Tenant Isolation
- [ ] Logout dari akun pertama
- [ ] Register akun baru:
  - Organization: "PT Testing 2"
  - Email: "admin2@testing.com"
  - Password: "password123"
- [ ] Login dengan akun baru
- [ ] **Cek data:**
  - [ ] Dashboard stats = 0
  - [ ] Customer list = kosong
  - [ ] Product list = kosong
  - [ ] Invoice list = kosong
- [ ] Data dari organization pertama tidak terlihat

**Expected Result:**
✅ Data terisolasi per organization (multi-tenant works!)

### Token Expiration
- [ ] Login dengan akun pertama
- [ ] Tunggu token expire (default: 24 jam, atau edit JWT_EXPIRES di .env menjadi "1m" untuk testing)
- [ ] Setelah expire, akses halaman lain
- [ ] Otomatis redirect ke login (unauthorized)
- [ ] Login ulang untuk dapat token baru

**Expected Result:**
✅ Auth token expire handling berfungsi

---

## 🎨 UI/UX TESTING

### Responsive Design
- [ ] Buka browser DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test di berbagai ukuran:
  - [ ] Mobile (375px)
  - [ ] Tablet (768px)
  - [ ] Desktop (1920px)
- [ ] Sidebar mobile: hamburger menu
- [ ] Form responsive: stacking di mobile
- [ ] Table scrollable di mobile

**Expected Result:**
✅ Aplikasi responsive di semua device

### Loading States
- [ ] Perhatikan saat load data
- [ ] Muncul spinner/loading indicator
- [ ] Setelah data load, spinner hilang
- [ ] Button "Simpan" → "Menyimpan..." saat submit

**Expected Result:**
✅ Loading states tampil dengan baik

### Error Handling
- [ ] Coba buat customer tanpa isi nama (required)
- [ ] Browser validation: "Please fill out this field"
- [ ] Coba login dengan password salah
- [ ] Muncul error message: "Invalid credentials"
- [ ] Coba buat invoice tanpa item
- [ ] Validation error tampil

**Expected Result:**
✅ Error handling & validation berfungsi

---

## 🧪 EDGE CASES TESTING

### Overpayment Test
- [ ] Buat invoice: Rp 1.000.000
- [ ] Send invoice
- [ ] Catat payment: Rp 1.500.000 (lebih dari total)
- [ ] Muncul confirm: "Pembayaran melebihi sisa tagihan. Lanjutkan?"
- [ ] Klik OK
- [ ] Payment tercatat
- [ ] Status → PAID
- [ ] Total dibayar: Rp 1.500.000
- [ ] Sisa: Rp -500.000 (overpayment/kelebihan)

**Expected Result:**
✅ Overpayment di-handle, ada confirmation

### Large Numbers Test
- [ ] Buat invoice dengan amount sangat besar:
  - Item price: 999999999999
  - Quantity: 100
- [ ] Total dihitung: Rp 99.999.999.999.900
- [ ] Format currency tampil dengan benar
- [ ] Save berhasil
- [ ] Detail tampil dengan benar

**Expected Result:**
✅ Large numbers di-handle dengan baik

### Special Characters in Input
- [ ] Buat customer dengan nama: "PT. ABC & Co. (Indonesia)"
- [ ] Notes invoice: "Bayar via BCA a/n PT. ABC - No: 1234567890"
- [ ] Save berhasil
- [ ] Special characters tidak menyebabkan error
- [ ] Display dengan benar

**Expected Result:**
✅ Special characters di-handle dengan aman

---

## ✅ FINAL CHECKLIST

### Core Functionality
- [ ] Register & Login berfungsi
- [ ] Multi-tenant isolation berfungsi
- [ ] Dashboard menampilkan stats real-time
- [ ] Customer CRUD lengkap (Create, Read, Update, Delete via DB)
- [ ] Product CRUD lengkap
- [ ] Invoice CRUD lengkap + special actions:
  - [ ] Create invoice dengan wizard
  - [ ] View invoice detail
  - [ ] Edit invoice (draft only)
  - [ ] Send invoice (draft → sent)
  - [ ] Cancel invoice
  - [ ] Delete invoice (draft only)
- [ ] Payment recording:
  - [ ] Partial payment
  - [ ] Full payment
  - [ ] Auto-update status
  - [ ] Payment history
- [ ] Search & filter berfungsi
- [ ] Pagination berfungsi

### UI/UX
- [ ] Responsive di mobile, tablet, desktop
- [ ] Loading states tampil
- [ ] Error messages jelas
- [ ] Success feedback (alerts/toast)
- [ ] Navigation lancar (routing)
- [ ] Logout berfungsi

### Security
- [ ] JWT authentication berfungsi
- [ ] Token stored di localStorage
- [ ] Unauthorized redirect ke login
- [ ] Multi-tenant data isolation
- [ ] Input validation (frontend & backend)

---

## 🎉 SELESAI!

Jika semua checklist ✅, maka aplikasi Anda:

**100% FUNCTIONAL & SIAP DIGUNAKAN!** 🚀

### Next Steps:
1. **Customize**: Sesuaikan warna, logo, branding
2. **Enhance**: Tambah fitur PDF, email, reports
3. **Deploy**: Deploy ke cloud (AWS, GCP, DigitalOcean)
4. **Launch**: Cari user pertama dan mulai bisnis!

---

**Good luck! 🎊**
