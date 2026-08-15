# 🔌 Cara Ganti Port Vite Dev Server

## 📍 Port Default: 3000 (NORMAL!)

Port 3000 itu **NORMAL** untuk development, bukan error!

```
➜  Local:   http://localhost:3000/
```

Port 3000 adalah port default Vite (dan banyak framework lain).

---

## 🎯 Kenapa Port 3000?

**Jawaban:** Karena konfigurasi di `vite.config.ts`:

```ts
server: {
  port: 3000,  // ← Port default
}
```

---

## 🔧 Cara Ganti Port

### **Opsi 1: Edit `vite.config.ts` (Port Tetap)**

**File: `frontend/vite.config.ts`**
```ts
export default defineConfig({
  server: {
    port: 5173,  // ← Ganti ke port lain (5173 = default Vite)
    // port: 8000,  // Atau port custom lain
    // port: 4200,  // Atau 4200 (seperti Angular)
  },
})
```

**Restart dev server:**
```bash
npm run dev
```

**Output:**
```
➜  Local:   http://localhost:5173/  # Port berubah!
```

---

### **Opsi 2: Port Random (Auto-increment)**

**File: `frontend/vite.config.ts`**
```ts
export default defineConfig({
  server: {
    port: 3000,
    strictPort: false,  // ← Kalau 3000 udah kepake, cari port lain otomatis
  },
})
```

**Behavior:**
- Port 3000 kosong → Pakai 3000
- Port 3000 kepake → Otomatis pakai 3001
- Port 3001 kepake → Otomatis pakai 3002
- Dan seterusnya...

---

### **Opsi 3: Port via Command Line (Sekali Pakai)**

**Tanpa edit config:**
```bash
npm run dev -- --port 5173
```

**Output:**
```
➜  Local:   http://localhost:5173/
```

**Atau port random:**
```bash
npm run dev -- --port 0  # 0 = random port
```

---

## 🌐 Allow Network Access (Akses dari HP/Device Lain)

**File: `frontend/vite.config.ts`**
```ts
export default defineConfig({
  server: {
    port: 3000,
    host: true,  // ← Allow akses dari network (IP lokal)
  },
})
```

**Output setelah `npm run dev`:**
```
➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.100:3000/  ← Bisa diakses dari HP!
```

**Cara akses dari HP:**
1. HP & laptop harus di WiFi yang sama
2. Buka browser di HP
3. Ketik: `http://192.168.1.100:3000` (IP laptop Anda)

---

## 🚀 Port di Production (Deploy)

### **Vercel (Frontend)**
Port **OTOMATIS diatur** oleh Vercel, tidak perlu config manual.

**URL production:**
```
https://bukukas.vercel.app/  ← Port 443 (HTTPS default)
```

### **Render (Backend)**
Port **dari environment variable** `PORT` (diatur otomatis oleh Render).

**Perlu update `cmd/server/main.go`:**
```go
import "os"

func main() {
  // Get port from environment (Render provides this)
  port := os.Getenv("PORT")
  if port == "" {
    port = "8080" // Default for local
  }
  
  addr := fmt.Sprintf(":%s", port)
  log.Fatal(http.ListenAndServe(addr, handler))
}
```

---

## 📊 Rekomendasi Port

| Environment | Frontend | Backend | Alasan |
|-------------|----------|---------|--------|
| **Development** | 3000 | 8080 | Standard convention |
| **Alternative** | 5173 | 8000 | Vite default / Django-like |
| **Production** | Auto (443) | Auto | Handled by hosting |

---

## 🐛 Troubleshooting

### **Port 3000 sudah dipakai?**

**Error:**
```
Port 3000 is in use, trying another one...
```

**Solusi 1: Matikan aplikasi yang pakai port 3000**
```bash
# Windows - cari process yang pakai port 3000
netstat -ano | findstr :3000

# Output contoh:
# TCP  0.0.0.0:3000  0.0.0.0:0  LISTENING  12345
#                                           ↑ PID

# Kill process
taskkill /PID 12345 /F
```

**Solusi 2: Ganti port di config**
Edit `vite.config.ts` → ganti `port: 3000` jadi `port: 5173`

**Solusi 3: Allow auto-increment**
```ts
server: {
  strictPort: false,  // Auto cari port lain
}
```

---

### **Koneksi lambat?**

**Ganti port 3000 ke 5173 (kadang lebih cepat):**
```ts
server: {
  port: 5173,
}
```

---

### **Akses dari HP tidak bisa?**

**Cek firewall Windows:**
1. Buka Windows Defender Firewall
2. Allow port 3000 untuk **Private Network**
3. Atau tambahkan inbound rule untuk port 3000

**Atau pakai command:**
```powershell
# Allow port 3000
netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=3000
```

---

## ✅ Kesimpulan

- ✅ **Port 3000 = NORMAL** (bukan error!)
- ✅ Port hanya **random kalau 3000 udah kepake**
- ✅ Di **production (Vercel/Render)** port diatur otomatis
- ✅ Ganti port dengan edit `vite.config.ts` atau `--port` flag

**Tidak perlu deploy dulu untuk ganti port** - semua bisa diatur di local!

---

**Dibuat oleh:** BukuKas Development Team  
**Tanggal:** 2026-08-16

