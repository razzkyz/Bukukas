import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '@/services/authService'
import { LayoutDashboard, Users, Package, FileText, Menu, X, Bell, Search, LogOut } from 'lucide-react'
import Swal from 'sweetalert2'

const iconMap = {
  LayoutDashboard,
  Users,
  Package,
  FileText,
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    loadUser()
    setSidebarOpen(false)
  }, [pathname])

  const loadUser = async () => {
    try {
      const userData = await authService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      icon: 'question',
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar?',
      showCancelButton: true,
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
    })

    if (result.isConfirmed) {
      // Call backend logout
      await authService.logout()
      
      // Clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Show success notification
      await Swal.fire({
        icon: 'success',
        title: 'Logout Berhasil',
        text: 'Anda telah berhasil keluar. Terima kasih!',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      })
      
      // Redirect to login
      navigate('/login')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', desc: 'Overview & Stats' },
    { name: 'Customers', href: '/customers', icon: 'Users', desc: 'Manage Customers' },
    { name: 'Products', href: '/products', icon: 'Package', desc: 'Product Catalog' },
    { name: 'Invoices', href: '/invoices', icon: 'FileText', desc: 'Invoice Management' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex items-center space-x-3">
              <img 
                src="/assets/images/logo.jpg" 
                alt="BukuKas Logo" 
                className="w-8 h-8 rounded-lg object-contain bg-white p-0.5"
              />
              <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                BukuKas
              </h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-50 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 rounded-b-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar - REDESIGNED DEEP NAVY */}
      <aside className={`hidden lg:block fixed left-0 top-16 bottom-0 bg-slate-900 border-r border-slate-800 transition-all ${sidebarCollapsed ? 'w-20' : 'w-64'} z-40`}>
        <nav className="p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const IconComponent = iconMap[item.icon as keyof typeof iconMap]
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-teal-400'}`} />
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm">{item.name}</p>
                    {!isActive && <p className="text-xs text-slate-400">{item.desc}</p>}
                  </div>
                )}
              </button>
            )
          })}
        </nav>

        {/* Upgrade Card */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-4 left-3 right-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-xl">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <p className="text-sm font-semibold">Upgrade to Pro</p>
              </div>
              <p className="text-xs opacity-90 mb-3">Unlimited invoices</p>
              <button 
                onClick={() => navigate('/pricing')}
                className="w-full bg-white text-emerald-600 text-xs font-semibold py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar - REDESIGNED */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <img 
                  src="/assets/images/logo.jpg" 
                  alt="BukuKas Logo" 
                  className="w-8 h-8 rounded-lg object-contain bg-white p-0.5"
                />
                <h1 className="font-bold text-white text-lg">
                  BukuKas
                </h1>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const IconComponent = iconMap[item.icon as keyof typeof iconMap]
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-teal-400'}`} />
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </button>
                )
              })}
            </nav>

            <div className="absolute bottom-4 left-3 right-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <p className="text-sm font-semibold">Upgrade</p>
                </div>
                <p className="text-xs opacity-90 mb-3">Unlimited invoices</p>
                <button 
                  onClick={() => {
                    navigate('/pricing')
                    setSidebarOpen(false)
                  }}
                  className="w-full bg-white text-emerald-600 text-xs font-semibold py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={`pt-20 transition-all ${sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-72'} min-h-screen`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
