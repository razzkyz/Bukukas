# ✅ Testing Checklist - Invoice SaaS

Gunakan checklist ini untuk memastikan semua fitur berfungsi dengan baik.

---

## 🎯 Pre-Testing Setup

- [ ] PostgreSQL running (cek di pgAdmin 4)
- [ ] Database `invoice_saas` sudah dibuat
- [ ] Backend running di http://localhost:8080
- [ ] Frontend running di http://localhost:3000
- [ ] Browser siap (Chrome/Edge/Firefox)

---

## 1️⃣ Authentication Testing

### Register User Baru
- [ ] Buka http://localhost:3000
- [ ] Klik "Daftar sekarang"
- [ ] Isi form:
  - [ ] Nama: Test User
  - [ ] Email: test@example.com
  - [ ] Password: password123
  - [ ] Nama Perusahaan: PT Test
- [ ] Klik "Daftar"
- [ ] ✅ Otomatis login dan redirect ke dashboard

### Validation Testing
- [ ] Coba register dengan email yang sama → Error "Email already exists"
- [ ] Coba password < 8 karakter → Error validation
- [ ] Coba email invalid → Error validation

### Login
- [ ] Logout dari dashboard
- [ ] Klik "Login di sini"
- [ ] Login dengan email: test@example.com, password: password123
- [ ] ✅ Berhasil login → masuk dashboard

### Login Error
- [ ] Coba login dengan email salah → Error "Invalid email or password"
- [ ] Coba login dengan password salah → Error "Invalid email or password"

---

## 2️⃣ Dashboard Testing

### Dashboard Display
- [ ] Total Revenue: Rp 0 (belum ada invoice)
- [ ] Invoice Lunas: 0
- [ ] Invoice Belum Lunas: 0
- [ ] Invoice Jatuh Tempo: 0
- [ ] Total Customer: 0
- [ ] Quick actions buttons tampil
- [ ] User name tampil di header
- [ ] Logout button ada

### Navigation
- [ ] Klik menu "Customer" → pindah ke halaman customer
- [ ] Klik menu "Produk" → pindah ke halaman produk
- [ ] Klik menu "Dashboard" → kembali ke dashboard
- [ ] Klik logo "Invoice SaaS" → kembali ke dashboard

---

## 3️⃣ Customer Management Testing

### List Customer (Empty State)
- [ ] Klik menu "Customer"
- [ ] Tampil "Belum ada customer"
- [ ] Button "Tambah Customer Pertama" ada

### Create Customer - Valid Data
- [ ] Klik "+ Tambah Customer"
- [ ] Isi form:
  - [ ] Nama: PT ABC Indonesia
  - [ ] Email: abc@example.com
  - [ ] Telepon: 021-12345678
  - [ ] Alamat: Jl. Sudirman No. 123, Jakarta
- [ ] Klik "Simpan Customer"
- [ ] ✅ Redirect ke list customer
- [ ] ✅ Customer baru muncul di list

### Create Customer - Validation
- [ ] Klik "+ Tambah Customer"
- [ ] Kosongkan nama → Error "Name is required"
- [ ] Isi email invalid → Error "Invalid email address"

### Create Multiple Customers
- [ ] Tambah customer 2: PT XYZ, xyz@example.com
- [ ] Tambah customer 3: CV Maju, maju@example.com
- [ ] Tambah customer 4: Toko Sentosa, sentosa@example.com
- [ ] ✅ Semua customer muncul di list

### Search Customer
- [ ] Ketik "ABC" di search box
- [ ] ✅ Hanya PT ABC yang muncul
- [ ] Ketik "xyz" → Hanya PT XYZ yang muncul
- [ ] Kosongkan search → Semua customer muncul
- [ ] Ketik email "maju@" → CV Maju muncul

### Edit Customer
- [ ] Klik "Edit" pada PT ABC
- [ ] Ubah nama jadi "PT ABC Jaya"
- [ ] Ubah telepon jadi "021-99999999"
- [ ] Klik "Update Customer"
- [ ] ✅ Perubahan tersimpan di list

### Delete Customer
- [ ] Klik "Hapus" pada Toko Sentosa
- [ ] Modal konfirmasi muncul
- [ ] Klik "Batal" → Modal tutup, data tidak dihapus
- [ ] Klik "Hapus" lagi
- [ ] Klik "Hapus" di modal
- [ ] ✅ Customer terhapus dari list

### Pagination
- [ ] Tambah customer sampai lebih dari 20
- [ ] ✅ Pagination muncul
- [ ] Klik "Next" → Halaman 2
- [ ] Klik "Prev" → Kembali halaman 1

---

## 4️⃣ Product Management Testing

### List Product (Empty State)
- [ ] Klik menu "Produk"
- [ ] Tampil "Belum ada produk/jasa"
- [ ] Button "Tambah Produk Pertama" ada

### Create Product - Valid Data
- [ ] Klik "+ Tambah Produk"
- [ ] Isi form:
  - [ ] Nama: Jasa Konsultasi Bisnis
  - [ ] Deskripsi: Konsultasi strategi bisnis per jam
  - [ ] Harga: 500000
  - [ ] Satuan: jam
- [ ] Klik "Simpan Produk"
- [ ] ✅ Redirect ke list produk
- [ ] ✅ Produk baru muncul dalam card
- [ ] ✅ Harga tampil: Rp 500.000

### Create Product - Validation
- [ ] Klik "+ Tambah Produk"
- [ ] Kosongkan nama → Error "Name is required"
- [ ] Harga 0 atau negatif → Error "Price must be greater than zero"

### Create Multiple Products
- [ ] Tambah produk 2: Web Development, Rp 1.000.000, per paket
- [ ] Tambah produk 3: UI/UX Design, Rp 750.000, per hari
- [ ] Tambah produk 4: Digital Marketing, Rp 300.000, per bulan
- [ ] ✅ Semua produk muncul dalam grid

### Search Product
- [ ] Ketik "konsultasi" → Jasa Konsultasi muncul
- [ ] Ketik "web" → Web Development muncul
- [ ] Kosongkan → Semua produk muncul

### Edit Product
- [ ] Klik edit (✏️) pada Jasa Konsultasi
- [ ] Ubah harga jadi 600000
- [ ] Ubah deskripsi
- [ ] Klik "Update Produk"
- [ ] ✅ Perubahan tersimpan
- [ ] ✅ Harga update: Rp 600.000

### Delete Product
- [ ] Klik delete (🗑️) pada Digital Marketing
- [ ] Modal konfirmasi muncul
- [ ] Klik "Hapus"
- [ ] ✅ Produk terhapus dari grid

---

## 5️⃣ Multi-Tenancy Testing

### Register User Kedua
- [ ] Logout dari dashboard
- [ ] Register user baru:
  - [ ] Email: user2@example.com
  - [ ] Password: password123
  - [ ] Organization: PT Lain
- [ ] ✅ Login berhasil

### Test Data Isolation
- [ ] User 2 tidak bisa lihat customer User 1 ✅
- [ ] User 2 tidak bisa lihat produk User 1 ✅
- [ ] Dashboard User 2 menampilkan 0 data ✅

### Create Data User 2
- [ ] User 2 buat customer sendiri
- [ ] User 2 buat produk sendiri
- [ ] ✅ Data tersimpan

### Switch User dan Verify
- [ ] Logout User 2
- [ ] Login User 1 (test@example.com)
- [ ] ✅ Data User 1 masih ada
- [ ] ✅ Data User 2 TIDAK terlihat
- [ ] Multi-tenant working ✅

---

## 6️⃣ Database Verification

### Check di pgAdmin 4
```sql
-- Buka pgAdmin → Query Tool

-- 1. Check users table
SELECT * FROM users;
-- ✅ Harus ada 2 user (User 1 & User 2)

-- 2. Check organizations
SELECT * FROM organizations;
-- ✅ Harus ada 2 organization

-- 3. Check organization_members
SELECT 
    u.name as user_name,
    o.name as organization_name,
    om.role
FROM organization_members om
JOIN users u ON om.user_id = u.id
JOIN organizations o ON om.organization_id = o.id;
-- ✅ Setiap user punya organization dengan role 'owner'

-- 4. Check customers dengan organization
SELECT 
    c.name as customer_name,
    o.name as organization_name
FROM customers c
JOIN organizations o ON c.organization_id = o.id
ORDER BY c.created_at DESC;
-- ✅ Customer terisolasi per organization

-- 5. Check products dengan organization
SELECT 
    p.name as product_name,
    p.price,
    o.name as organization_name
FROM products p
JOIN organizations o ON p.organization_id = o.id
ORDER BY p.created_at DESC;
-- ✅ Product terisolasi per organization

-- 6. Count per organization
SELECT 
    o.name as organization,
    COUNT(DISTINCT c.id) as customers,
    COUNT(DISTINCT p.id) as products
FROM organizations o
LEFT JOIN customers c ON o.id = c.organization_id
LEFT JOIN products p ON o.id = p.organization_id
GROUP BY o.id, o.name;
-- ✅ Data count sesuai
```

---

## 7️⃣ UI/UX Testing

### Responsive Design
- [ ] Buka di layar desktop → Layout bagus
- [ ] Resize browser jadi kecil → Responsive
- [ ] Test di mobile (F12 → Toggle device toolbar)
- [ ] Navigation menu collapse di mobile
- [ ] Table/grid responsive

### Loading States
- [ ] Saat pertama buka halaman → Loading spinner
- [ ] Saat submit form → Button jadi "Menyimpan..."
- [ ] Saat delete → Loading state

### Error Handling
- [ ] Matikan backend → Error message muncul
- [ ] Input invalid → Validation error muncul
- [ ] Network error → Error message clear

### User Experience
- [ ] Back button bekerja
- [ ] Logout redirect ke login
- [ ] Auto redirect kalau belum login
- [ ] Success feedback setelah action
- [ ] Cancel button works

---

## 8️⃣ Performance Testing

### Page Load Time
- [ ] Dashboard load < 1 detik
- [ ] Customer list load < 1 detik
- [ ] Product list load < 1 detik
- [ ] Form submission < 500ms

### Search Performance
- [ ] Real-time search responsive
- [ ] No lag saat typing

### Pagination
- [ ] Pagination smooth
- [ ] Data load cepat saat ganti page

---

## 9️⃣ Security Testing

### Authentication
- [ ] Tidak bisa akses /dashboard tanpa login
- [ ] Token expire setelah 24 jam
- [ ] Logout menghapus token
- [ ] Refresh page tetap login (selama token valid)

### Authorization
- [ ] User A tidak bisa lihat data User B ✅
- [ ] API endpoint protected dengan JWT
- [ ] Invalid token → Redirect ke login

### Input Validation
- [ ] XSS protection (coba input `<script>alert('xss')</script>`)
- [ ] SQL injection protection
- [ ] Email validation
- [ ] Required fields validation

---

## 🎯 Summary Checklist

### Critical Tests
- [ ] ✅ Register & Login works
- [ ] ✅ Dashboard displays correctly
- [ ] ✅ Customer CRUD complete
- [ ] ✅ Product CRUD complete
- [ ] ✅ Multi-tenancy isolation works
- [ ] ✅ Search & pagination works
- [ ] ✅ Data persists in database

### Optional Tests
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Performance acceptable
- [ ] Security basics covered

---

## 📊 Test Results

**Date Tested:** _______________
**Tested By:** _______________

**Results:**
- Total Tests: _____ / _____
- Passed: _____ ✅
- Failed: _____ ❌
- Skipped: _____ ⏭️

**Issues Found:**
1. ___________________________
2. ___________________________
3. ___________________________

**Notes:**
_________________________________
_________________________________
_________________________________

---

## 🎊 Testing Complete!

Kalau semua checklist ✅ berarti aplikasi siap untuk:
- ✅ Development lanjutan
- ✅ Demo ke client
- ✅ Deploy ke testing environment
- ✅ User acceptance testing

**Next:** Lanjut buat fitur Invoice & Payment! 🚀
