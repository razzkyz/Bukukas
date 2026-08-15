# 🚀 MIGRATION TO VITE - QUICK GUIDE

## ⚡ FAST MIGRATION STEPS

### Step 1: Backup & Prepare (DONE!)
Current code backed up in git/folder

### Step 2: Install New Dependencies
```bash
cd frontend

# Remove Next.js
npm uninstall next @types/react @types/react-dom eslint-config-next

# Install Vite
npm install -D vite @vitejs/plugin-react

# Install React Router
npm install react-router-dom

# Install TanStack Query
npm install @tanstack/react-query

# Keep existing
# - react, react-dom
# - typescript
# - tailwindcss
# - axios
```

### Step 3: Update package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  }
}
```

### Step 4: Create Vite Config
File: `vite.config.ts`

### Step 5: Create index.html (Vite entry)
File: `index.html`

### Step 6: Restructure src/
```
src/
├── main.tsx          # Entry point
├── App.tsx           # Router setup
├── components/       # Reusable components
├── pages/            # Page components
├── layouts/          # Layouts
├── services/         # API services (keep existing!)
├── hooks/            # Custom hooks
├── lib/              # Utils
└── types/            # TypeScript types
```

### Step 7: Migrate Pages
- app/login/page.tsx → pages/Login.tsx
- app/dashboard/page.tsx → pages/Dashboard.tsx
- etc.

### Step 8: Setup React Router
In App.tsx with routes

### Step 9: Add TanStack Query
Wrap app with QueryClientProvider

### Step 10: Update Imports
- Remove Next.js imports
- Add React Router imports
- Update navigation hooks

### Step 11: Test & Run
```bash
npm run dev
```

## 🎯 COMMANDS TO RUN

Execute these in order:

```bash
cd frontend

# 1. Install dependencies
npm uninstall next @types/react @types/react-dom eslint-config-next
npm install -D vite @vitejs/plugin-react
npm install react-router-dom @tanstack/react-query

# 2. After I create config files, run:
npm run dev

# Should open: http://localhost:5173
```

---

## ⚡ MIGRATION STATUS

- [ ] Step 1: Dependencies
- [ ] Step 2: Vite config
- [ ] Step 3: index.html
- [ ] Step 4: main.tsx
- [ ] Step 5: App.tsx with Router
- [ ] Step 6: Migrate pages
- [ ] Step 7: TanStack Query setup
- [ ] Step 8: Test

**READY! I'll create files now!** 🚀
