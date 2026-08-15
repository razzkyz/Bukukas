# Invoice SaaS - Frontend

Frontend Next.js 14 dengan TypeScript dan Tailwind CSS.

## Setup

### 1. Install Node.js

Download dan install Node.js (versi 18+):
- https://nodejs.org/

Cek apakah sudah terinstall:
```bash
node --version
npm --version
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

## Struktur Folder

```
frontend/
├── src/
│   ├── app/              # Next.js 14 App Router
│   │   ├── login/        # Halaman login
│   │   ├── register/     # Halaman register
│   │   ├── dashboard/    # Halaman dashboard
│   │   └── globals.css   # Global styles
│   ├── components/       # React components (belum ada)
│   ├── lib/              # Utilities
│   │   └── api.ts        # Axios instance
│   └── services/         # API services
│       └── authService.ts
├── public/               # Static files
├── .env.local           # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Fitur yang Sudah Ada

✅ Login page
✅ Register page
✅ Dashboard dengan statistik
✅ Koneksi ke Backend API
✅ Token management
✅ Auto redirect jika belum login

## Fitur yang Belum Ada (Coming Soon)

- [ ] Customer management (CRUD)
- [ ] Product management (CRUD)
- [ ] Invoice management
- [ ] Payment tracking
- [ ] Reports & charts
- [ ] Settings
- [ ] Responsive mobile design

## Testing

### 1. Pastikan Backend Running

Backend harus jalan di `http://localhost:8080`

### 2. Buka Browser

Buka: http://localhost:3000

### 3. Register User Baru

- Klik "Daftar sekarang"
- Isi form
- Otomatis login dan redirect ke dashboard

### 4. Login

- Email: yang Anda daftarkan
- Password: yang Anda set

## Environment Variables

File `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Build untuk Production

```bash
npm run build
npm start
```

## Troubleshooting

### Error: Module not found

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Port 3000 sudah dipakai

Edit `package.json`, ganti port:
```json
"dev": "next dev -p 3001"
```

### API Error / CORS

Pastikan backend jalan dan CORS enabled untuk `http://localhost:3000`

## Next Steps

1. ✅ Backend sudah jalan
2. ✅ Frontend dasar sudah jalan
3. 🚧 Buat halaman Customer management
4. 🚧 Buat halaman Product management
5. 🚧 Buat halaman Invoice
6. 🚧 Polish UI & UX
7. 🚀 Deploy!

## Tips Development

### Hot Reload

Next.js sudah otomatis hot reload. Edit file, langsung keliatan perubahannya.

### Tailwind CSS

Pakai class Tailwind langsung:
```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello
</div>
```

### API Call

```tsx
import api from '@/lib/api'

const data = await api.get('/customers')
```

## Tech Stack

- **Next.js 14** - React framework dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Zustand** - State management (optional, belum dipakai)
- **React Hook Form** - Form handling (belum dipakai)
- **Recharts** - Charts (belum dipakai)

## Resources

- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

Selamat coding! 🚀
