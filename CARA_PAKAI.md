# 🚀 Cara Pakai Invoice SaaS

Aplikasi backend sudah jalan! Sekarang mari test fitur-fiturnya.

## 🎯 Testing Cepat

### Opsi 1: Pakai Postman (Paling Mudah)

1. **Download & Install Postman** (kalau belum punya)
   - https://www.postman.com/downloads/

2. **Import Collection**
   - Buka Postman
   - Klik **Import**
   - Pilih file `Invoice-SaaS.postman_collection.json`

3. **Test Workflow**
   - Klik folder **Auth** → **Register** → Klik **Send**
   - Token otomatis tersimpan
   - Test endpoint lainnya (sudah otomatis pakai token)

### Opsi 2: Pakai Browser (Thunder Client di VS Code)

1. Install extension **Thunder Client** di VS Code
2. Import collection yang sama
3. Test langsung dari VS Code

### Opsi 3: Pakai Curl (Manual)

Buka terminal/cmd baru (biarkan aplikasi tetap jalan):

```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Admin\",\"email\":\"admin@example.com\",\"password\":\"password123\",\"organization_name\":\"PT Saya\"}"

# 2. Login
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"

# Copy token dari response, lalu:
set TOKEN=paste-token-disini

# 3. Buat Customer
curl -X POST http://localhost:8080/api/customers -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"PT ABC\",\"email\":\"abc@example.com\",\"phone\":\"08123456789\",\"address\":\"Jl. Sudirman No. 1\"}"
```

## 📋 Workflow Lengkap

### 1. Register & Login
```
Register → Login → Dapat Token
```

### 2. Setup Data Master
```
Buat Customer → Buat Product
```

### 3. Buat Invoice
```
Pilih Customer → Tambah Items (Product) → Save
```

### 4. Kirim Invoice
```
Send Invoice → Status jadi "sent"
```

### 5. Catat Pembayaran
```
Tambah Payment → Invoice jadi "paid" (kalau lunas)
```

### 6. Lihat Laporan
```
Dashboard → Lihat statistik & chart
```

## 🔍 Cek di Database

Buka **pgAdmin 4**, query tool:

```sql
-- Lihat semua user
SELECT * FROM users;

-- Lihat semua organization
SELECT * FROM organizations;

-- Lihat customer
SELECT * FROM customers;

-- Lihat product
SELECT * FROM products;

-- Lihat invoice dengan customer
SELECT 
    i.invoice_number,
    i.status,
    c.name as customer_name,
    i.total,
    i.created_at
FROM invoices i
JOIN customers c ON i.customer_id = c.id
ORDER BY i.created_at DESC;

-- Lihat statistik
SELECT 
    COUNT(*) FILTER (WHERE status = 'paid') as paid_invoices,
    COUNT(*) FILTER (WHERE status = 'sent') as unpaid_invoices,
    SUM(total) FILTER (WHERE status = 'paid') as total_revenue
FROM invoices;
```

## 🎨 Fitur yang Bisa Dicoba

### ✅ Authentication
- [x] Register user baru
- [x] Login
- [x] Get current user info
- [x] Logout

### ✅ Customer Management
- [x] List customers (dengan search & pagination)
- [x] Create customer
- [x] Update customer
- [x] Delete customer
- [x] Get customer detail

### ✅ Product Management
- [x] List products (dengan search & pagination)
- [x] Create product
- [x] Update product
- [x] Delete product
- [x] Get product detail

### ✅ Invoice Management
- [x] List invoices (filter by status)
- [x] Create invoice dengan multiple items
- [x] Update invoice
- [x] Delete invoice
- [x] Send invoice (draft → sent)
- [x] Cancel invoice
- [x] Auto-generate invoice number (INV-2026-000001)
- [x] Server-side calculation (subtotal, discount, tax, total)

### ✅ Payment Tracking
- [x] Add payment ke invoice
- [x] List payments per invoice
- [x] Partial payment support
- [x] Auto update invoice status jadi "paid"

### ✅ Dashboard & Reports
- [x] Dashboard statistics (revenue, invoices, customers)
- [x] Revenue chart (7/30/90 days)

### ✅ Multi-Tenant
- [x] Data isolation per organization
- [x] Tidak bisa lihat data organization lain

## 📊 Test Multi-Tenancy

Coba buat 2 organization berbeda:

```bash
# Organization 1
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"User1\",\"email\":\"user1@example.com\",\"password\":\"password123\",\"organization_name\":\"Company A\"}"

# Organization 2  
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"User2\",\"email\":\"user2@example.com\",\"password\":\"password123\",\"organization_name\":\"Company B\"}"

# Login sebagai User1, buat customer
# Login sebagai User2, tidak bisa lihat customer User1 ✅
```

## 🎯 Next Steps

### 1. Build Frontend (React)
Aplikasi backend sudah lengkap, tinggal buat UI:
- Login/Register page
- Dashboard dengan chart
- Customer list & form
- Product list & form
- Invoice creation wizard
- Payment tracking

### 2. Tambah Fitur Advanced
- PDF Invoice generation
- Email notification
- WhatsApp notification
- Recurring invoices
- Reports export (Excel, CSV)

### 3. Deploy ke Server
- VPS / Cloud (AWS, GCP, DigitalOcean)
- Setup domain & SSL
- Database production
- Monitoring

## 💡 Tips

### Debug
```bash
# Kalau ada error, cek log di terminal aplikasi
# Atau cek database langsung di pgAdmin
```

### Reset Database
```sql
-- Di pgAdmin Query Tool
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Lalu restart aplikasi (migrations akan jalan lagi)
```

### Development
```bash
# Install Air untuk hot reload
go install github.com/cosmtrek/air@latest

# Jalankan dengan air
air

# Setiap edit code, otomatis restart
```

## 📞 Troubleshooting

### Error: "Invalid or expired token"
**Solusi**: Login lagi untuk dapat token baru (token expire 24 jam)

### Error: "Customer not found"
**Solusi**: Pastikan pakai token yang benar, check organization_id

### Error: "Port 8080 already in use"
**Solusi**: Ganti port di `.env` → `APP_PORT=8081`

### Database error
**Solusi**: 
1. Cek PostgreSQL running di pgAdmin
2. Cek connection string di `.env`
3. Test query di pgAdmin Query Tool

## 🎊 Selamat!

Backend Invoice SaaS sudah jalan sempurna! 

**Langkah selanjutnya:**
1. Test semua endpoint ✅
2. Familiarisasi dengan API
3. Mulai build frontend
4. Deploy & launch! 🚀

---

**Butuh bantuan?** Cek file dokumentasi lainnya:
- `README.md` - Dokumentasi lengkap
- `API_EXAMPLES.md` - Contoh API calls
- `PANDUAN_LOKAL.md` - Setup lokal
- `NEXT_STEPS.md` - Roadmap development
