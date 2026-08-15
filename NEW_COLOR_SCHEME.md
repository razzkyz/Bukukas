# 🎨 New Color Scheme - BukuKas Redesign

## Color Palette

| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **Deep Navy** | `#0F172A` | `slate-900` | Sidebar, Footer, Navbar (dark) |
| **Slate Dark** | `#1E293B` | `slate-800` | Secondary dark surfaces |
| **Emerald Green** | `#10B981` | `emerald-500` | Primary buttons, positive values |
| **Teal** | `#14B8A6` | `teal-500` | Icons, secondary actions |
| **Pure White** | `#FFFFFF` | `white` | Cards, text on dark |
| **Soft Gray** | `#F8FAFC` | `slate-50` | Light backgrounds |
| **Light Border** | `#E2E8F0` | `slate-200` | Card borders |
| **Red** | `#EF4444` | `red-500` | Negative values, expenses |

---

## 1. Landing Page Components

### Hero Section
```tsx
// Background: Deep Navy gradient
className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"

// Text: Pure White
className="text-white"

// Heading accent: Emerald
className="text-emerald-400"

// Primary Button: Emerald with glow
className="bg-emerald-500 hover:bg-emerald-600 shadow-2xl shadow-emerald-500/50"

// Secondary Button: White/transparent
className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white"
```

### Features Section
```tsx
// Background: Soft Gray
className="bg-slate-50"

// Cards: Pure White with border
className="bg-white border-2 border-slate-200 rounded-2xl p-8"

// Icons: Alternating Teal & Emerald
className="text-teal-500" // or "text-emerald-500"
```

### Footer
```tsx
// Background: Deep Navy
className="bg-slate-900 text-slate-300"

// Links hover: Emerald
className="hover:text-emerald-400"
```

---

## 2. Dashboard Layout

### Sidebar
```tsx
// Background: Deep Navy
className="bg-slate-900"

// Menu items: Slate text
className="text-slate-300"

// Active menu: Emerald background
className="bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500"

// Icons: Teal
className="text-teal-400"
```

### Header
```tsx
// Background: Pure White with shadow
className="bg-white shadow-sm border-b border-slate-200"

// Search input: Soft Gray
className="bg-slate-50"
```

### Dashboard Cards (Financial Summary)

#### Total Pemasukan (Revenue)
```tsx
className="bg-white border-2 border-slate-200 rounded-xl p-6"

// Icon background: Emerald
className="bg-emerald-100 text-emerald-600"

// Amount: Emerald Green
className="text-3xl font-bold text-emerald-600"

// Trend up: Green with arrow
<div className="flex items-center text-emerald-600">
  <ArrowUp className="w-4 h-4" />
  <span>+24%</span>
</div>
```

#### Total Pengeluaran (Expenses)
```tsx
className="bg-white border-2 border-slate-200 rounded-xl p-6"

// Icon background: Red
className="bg-red-100 text-red-600"

// Amount: Red
className="text-3xl font-bold text-red-600"

// Trend down: Red with arrow
<div className="flex items-center text-red-600">
  <ArrowDown className="w-4 h-4" />
  <span>-12%</span>
</div>
```

#### Sisa Saldo / Arus Kas (Cash Flow)
```tsx
className="bg-white border-2 border-slate-200 rounded-xl p-6"

// Icon background: Teal
className="bg-teal-100 text-teal-600"

// Amount: Deep Navy
className="text-3xl font-bold text-slate-900"

// Chart: Teal & Emerald gradient
<div className="h-24 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-lg">
  {/* Chart line */}
</div>
```

---

## 3. Component Examples

### Primary Button
```tsx
<button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all">
  Simpan
</button>
```

### Secondary Button
```tsx
<button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all">
  Batal
</button>
```

### Danger Button
```tsx
<button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/50 transition-all">
  Hapus
</button>
```

### Input Field
```tsx
<input className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all" />
```

### Card
```tsx
<div className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all">
  {/* Content */}
</div>
```

### Badge (Status)
```tsx
// Success
<span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
  Lunas
</span>

// Pending
<span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
  Pending
</span>

// Failed
<span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
  Gagal
</span>
```

---

## 4. Typography

### Headings
```tsx
// H1 - Hero
<h1 className="text-5xl lg:text-6xl font-bold text-white">
  Heading
  <span className="text-emerald-400">Accent</span>
</h1>

// H2 - Section
<h2 className="text-4xl font-bold text-slate-900">
  Section Heading
</h2>

// H3 - Card Title
<h3 className="text-2xl font-bold text-slate-900">
  Card Title
</h3>
```

### Body Text
```tsx
// Primary text
<p className="text-slate-700">Regular text</p>

// Secondary text
<p className="text-slate-500">Secondary text</p>

// Text on dark
<p className="text-slate-300">Text on dark background</p>
```

---

## 5. Shadows & Effects

### Glow Effect (Primary Button)
```tsx
className="shadow-2xl shadow-emerald-500/50"
```

### Subtle Shadow (Cards)
```tsx
className="shadow-lg"
```

### Border Glow (Active Input)
```tsx
className="focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500"
```

---

## 6. Complete Component Redesign Needed

### Files to Update:
1. ✅ `frontend/src/pages/Landing.tsx` - Hero section (Deep Navy)
2. ✅ `frontend/src/pages/Dashboard.tsx` - Financial cards with colors
3. ✅ `frontend/src/components/DashboardLayout.tsx` - Sidebar (Deep Navy)
4. `frontend/src/pages/Login.tsx` - Update colors
5. `frontend/src/pages/Register.tsx` - Update colors
6. `frontend/src/pages/Pricing.tsx` - Update colors
7. `frontend/src/app/globals.css` - Update utility classes

---

## 7. Before & After

### Before (Old Colors):
- Primary: Emerald/Teal gradient
- Background: Light emerald/teal
- Cards: White with light borders
- Sidebar: Light with blur

### After (New Colors):
- Primary: Solid Emerald (`#10B981`)
- Background Hero: Deep Navy (`#0F172A`)
- Cards: Pure White with slate borders
- Sidebar: Deep Navy solid
- Accent: Teal for icons

---

## Implementation Priority

**High Priority:**
1. Landing Page Hero (Deep Navy background)
2. Dashboard Sidebar (Deep Navy)
3. Financial Cards (Emerald/Red/Teal)

**Medium Priority:**
4. Login/Register pages
5. Pricing page
6. Footer

**Low Priority:**
7. Global CSS utilities
8. Animation refinements

---

**Status:** In Progress  
**Next:** Apply to Landing Page & Dashboard

