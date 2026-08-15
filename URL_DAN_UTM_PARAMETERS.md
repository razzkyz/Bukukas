# 🌐 URL Structure & UTM Parameters - BukuKas

## 📍 Struktur URL Aplikasi

### **Landing Page (Publik)**
```
http://localhost:3000/          ← Root URL, siapa aja bisa akses
```

**Fitur:**
- ✅ Penjelasan lengkap tentang BukuKas
- ✅ Tombol "Login" di pojok kanan atas
- ✅ Tombol "Coba Gratis" (menuju Register)
- ✅ TIDAK ada sidebar (karena publik)
- ✅ Footer dengan link produk, perusahaan, bantuan

---

### **Halaman Authentication**
```
http://localhost:3000/login     ← Halaman login
http://localhost:3000/register  ← Halaman register (sign up)
```

---

### **Dashboard & Fitur (Setelah Login)**
```
http://localhost:3000/dashboard        ← Dashboard utama
http://localhost:3000/customers        ← Daftar customer
http://localhost:3000/customers/create ← Tambah customer baru
http://localhost:3000/customers/123    ← Detail customer ID 123
http://localhost:3000/products         ← Daftar produk
http://localhost:3000/products/create  ← Tambah produk baru
http://localhost:3000/products/456     ← Detail produk ID 456
http://localhost:3000/invoices         ← Daftar invoice
http://localhost:3000/invoices/create  ← Buat invoice baru
http://localhost:3000/invoices/789     ← Detail invoice ID 789
http://localhost:3000/invoices/789/edit ← Edit invoice ID 789
```

**Ciri khas halaman setelah login:**
- ✅ ADA sidebar di kiri (menu navigasi)
- ✅ Header dengan nama user & logout button
- ✅ Protected (harus login dulu)

---

## 🎯 UTM Parameters: Untuk Apa?

### **Contoh URL dengan UTM:**
```
https://bukukas.id/try-now/invoicing/invoicing-software/
  ?utm_source=GOOGLE
  &utm_medium=cpc
  &utm_campaign=ID+-+NB+-+LF+-+SMB+-+DSA+CA+-+Other+Asia
  &utm_content=Invoicing+Software
  &utm_term=DYNAMIC+SEARCH+ADS
  &ds_kid=2295164687708
  &gclsrc=aw.ds
  &gad_source=1
  &gad_campaignid=21249140815
  &gbraid=0AAAAAD0EBI1o9Ntz_r_4xiOZhedbzJAcn
  &gclid=Cj0KCQjwnIDUBhDrARIsAJDGwSutgJOnEqfD6LhYQT_xCm00V4EgvWCXrzIgMk2EFs5wMe49fmPGtwkaAqKMEALw_wcB
```

---

### **🤔 Apa itu UTM?**

**UTM (Urchin Tracking Module)** adalah parameter di URL yang digunakan untuk **tracking marketing campaign**.

**Tujuan utama:**
1. **Tahu dari mana user datang** (Google Ads, Facebook, Instagram, email, dll)
2. **Ukur efektivitas iklan** (berapa user yang klik iklan A vs iklan B)
3. **Analytics & ROI** (iklan mana yang paling worth it)

---

### **📊 Penjelasan Parameter UTM:**

| Parameter | Contoh Value | Penjelasan |
|-----------|--------------|------------|
| **utm_source** | `GOOGLE` | Dari platform mana? (Google, Facebook, Instagram, Email) |
| **utm_medium** | `cpc` | Jenis trafik: `cpc` (paid ads), `organic` (SEO), `email`, `social` |
| **utm_campaign** | `ID+-+NB+-+LF+-+SMB+-+DSA+CA` | Nama campaign marketing (misal: "Promo Ramadan 2026") |
| **utm_content** | `Invoicing+Software` | Konten iklan yang diklik (untuk A/B testing iklan) |
| **utm_term** | `DYNAMIC+SEARCH+ADS` | Keyword yang dicari user (untuk Google Ads) |

---

### **🔍 Parameter Google Ads (GCLID & Lainnya):**

| Parameter | Penjelasan |
|-----------|------------|
| **gclid** | Google Click ID - unique identifier untuk setiap klik iklan Google |
| **gad_campaignid** | ID campaign di Google Ads |
| **gbraid** | Google Brand Referral Identifier (untuk iOS privacy) |
| **gclsrc** | Google Click Source (aw.ds = Google Ads Display/Search) |
| **ds_kid** | Dynamic Search Keyword ID |

---

## 🛠️ Apakah Perlu Implementasi UTM di BukuKas?

### **✅ Untuk Sekarang: TIDAK WAJIB**

**Alasan:**
- UTM hanya untuk tracking marketing (jika ada budget iklan)
- Aplikasi sudah berfungsi tanpa UTM
- Bisa diabaikan untuk development & testing

### **⚠️ Kapan Perlu Implementasi UTM?**

**Jika sudah ada rencana:**
1. **Pasang iklan Google Ads / Facebook Ads**
2. **Mau ukur conversion rate dari iklan**
3. **Mau tahu channel marketing mana yang paling efektif**

---

## 🚀 Cara Implementasi UTM Tracking (Jika Nanti Dibutuhkan)

### **1. Install Google Analytics (Frontend)**

```bash
npm install react-ga4
```

### **2. Setup Google Analytics di React**

**File: `frontend/src/main.tsx`**
```tsx
import ReactGA from 'react-ga4'

// Initialize Google Analytics
ReactGA.initialize('G-XXXXXXXXXX') // Ganti dengan Google Analytics ID

// Track pageviews
ReactGA.send({ hitType: "pageview", page: window.location.pathname })
```

### **3. Extract UTM Parameters dari URL**

**File: `frontend/src/hooks/useUTMParams.ts`**
```tsx
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useUTMParams() {
  const [searchParams] = useSearchParams()
  
  useEffect(() => {
    const utmParams = {
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_content: searchParams.get('utm_content'),
      utm_term: searchParams.get('utm_term'),
      gclid: searchParams.get('gclid')
    }
    
    // Save to localStorage for later (when user registers)
    if (Object.values(utmParams).some(v => v !== null)) {
      localStorage.setItem('utm_params', JSON.stringify(utmParams))
    }
    
    // Send to Google Analytics
    console.log('UTM Tracking:', utmParams)
  }, [searchParams])
}
```

### **4. Track User Registration dengan UTM**

**File: `frontend/src/pages/Register.tsx`**
```tsx
const handleRegister = async (data) => {
  // Get saved UTM params
  const utmParams = JSON.parse(localStorage.getItem('utm_params') || '{}')
  
  // Send registration + UTM to backend
  await api.post('/api/auth/register', {
    ...data,
    utm_source: utmParams.utm_source,
    utm_medium: utmParams.utm_medium,
    utm_campaign: utmParams.utm_campaign
  })
  
  // Track conversion in Google Analytics
  ReactGA.event({
    category: 'User',
    action: 'Register',
    label: utmParams.utm_source || 'direct'
  })
}
```

---

## 📈 Contoh Analytics Dashboard (Setelah Ada Tracking)

Dengan UTM tracking, Anda bisa tahu:

```
Google Ads Campaign:
├─ Total Clicks: 1,000
├─ Total Registrations: 50 (conversion rate: 5%)
├─ Cost: Rp 2,000,000
└─ Cost per User: Rp 40,000

Facebook Ads Campaign:
├─ Total Clicks: 800
├─ Total Registrations: 80 (conversion rate: 10%)
├─ Cost: Rp 1,500,000
└─ Cost per User: Rp 18,750   ← Lebih efisien!

Instagram Ads Campaign:
├─ Total Clicks: 500
├─ Total Registrations: 20 (conversion rate: 4%)
├─ Cost: Rp 1,000,000
└─ Cost per User: Rp 50,000   ← Kurang efisien

Organic (SEO):
├─ Total Visitors: 2,000
├─ Total Registrations: 100 (conversion rate: 5%)
└─ Cost: Rp 0   ← GRATIS!
```

**Kesimpulan:**
- Facebook Ads paling cost-effective
- Organic traffic paling menguntungkan (gratis!)
- Instagram Ads perlu diperbaiki atau dihentikan

---

## 🎨 Cara User Mengakses Landing Page

### **Scenario 1: User Baru (Belum Pernah Buka)**
```
1. User ketik: http://localhost:3000/
2. Tampil: Landing page (tanpa sidebar)
3. User klik: "Login" di pojok kanan atas
4. Redirect ke: http://localhost:3000/login
5. User login
6. Redirect ke: http://localhost:3000/dashboard (dengan sidebar)
```

### **Scenario 2: User Sudah Login (Refresh Browser)**
```
1. User ketik: http://localhost:3000/
2. Landing page terbuka, tapi user sudah punya token di localStorage
3. User bisa langsung klik nama menu di navbar untuk pindah ke dashboard
   ATAU klik logo BukuKas untuk ke landing page lagi
```

### **Scenario 3: User Klik Iklan Google Ads**
```
1. User search Google: "aplikasi invoice gratis"
2. User klik iklan BukuKas
3. Redirect ke: https://bukukas.id/?utm_source=google&utm_medium=cpc&utm_campaign=invoice-gratis
4. Tampil: Landing page
5. User klik: "Coba Gratis"
6. Redirect ke: http://localhost:3000/register
7. UTM params tersimpan di localStorage
8. Setelah register, backend tahu user datang dari Google Ads
```

---

## 🔥 Quick Tips

### **1. Clean URL vs UTM URL**

**Clean URL (user friendly):**
```
https://bukukas.id/
https://bukukas.id/login
```

**UTM URL (untuk iklan & tracking):**
```
https://bukukas.id/?utm_source=google&utm_medium=cpc&utm_campaign=promo-ramadan
```

**Best Practice:**
- Landing page bisa di-akses dengan clean URL
- Iklan gunakan UTM URL untuk tracking
- User tetap lihat clean URL di browser (UTM di-hide atau diabaikan)

### **2. URL untuk Iklan/Marketing (Contoh)**

**Google Ads:**
```
https://bukukas.id/?utm_source=google&utm_medium=cpc&utm_campaign=invoice-software&utm_content=headline-a&utm_term=aplikasi-invoice
```

**Facebook Ads:**
```
https://bukukas.id/?utm_source=facebook&utm_medium=cpc&utm_campaign=umkm-indonesia&utm_content=video-testimonial
```

**Email Newsletter:**
```
https://bukukas.id/?utm_source=newsletter&utm_medium=email&utm_campaign=monthly-update-march
```

**Instagram Bio:**
```
https://bukukas.id/?utm_source=instagram&utm_medium=social&utm_campaign=bio-link
```

---

## ✅ Kesimpulan

### **Untuk Development Sekarang:**
1. ✅ Landing page sudah ada di root URL (`/`)
2. ✅ Tombol Login sudah ada di pojok kanan atas
3. ✅ Sidebar hanya muncul setelah login
4. ✅ UTM parameters TIDAK perlu diimplementasi dulu
5. ✅ Aplikasi sudah siap pakai tanpa UTM

### **Nanti Kalau Mau Pasang Iklan:**
1. Install Google Analytics
2. Buat hook `useUTMParams` untuk capture UTM
3. Save UTM params ke database saat user register
4. Analisis data di Google Analytics dashboard

---

**Dibuat oleh:** BukuKas Development Team  
**Tanggal:** 2026-08-16  
**Status:** Development Ready ✅

