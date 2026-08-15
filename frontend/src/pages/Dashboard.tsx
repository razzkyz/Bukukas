import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/DashboardLayout'
import api from '@/lib/api'
import { TrendingUp, TrendingDown, DollarSign, FileText, CheckCircle, Clock, AlertCircle, Users, Package } from 'lucide-react'

interface DashboardStats {
  revenue: number
  paid_invoices: number
  unpaid_invoices: number
  overdue_invoices: number
  total_customers: number
  total_products: number
  total_invoices: number
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    const interval = setInterval(() => loadData(false), 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const response = await api.get('/dashboard/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color, 
    trend 
  }: any) => (
    <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:shadow-lg hover:border-emerald-200 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          color === 'green' ? 'bg-emerald-100' :
          color === 'blue' ? 'bg-teal-100' :
          color === 'yellow' ? 'bg-amber-100' :
          color === 'red' ? 'bg-red-100' :
          color === 'purple' ? 'bg-purple-100' :
          'bg-slate-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            color === 'green' ? 'text-emerald-600' :
            color === 'blue' ? 'text-teal-600' :
            color === 'yellow' ? 'text-amber-600' :
            color === 'red' ? 'text-red-600' :
            color === 'purple' ? 'text-purple-600' :
            'text-slate-600'
          }`} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-sm font-semibold ${
            trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
            trend === 'down' ? 'bg-red-50 text-red-600' : 
            'bg-slate-50 text-slate-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
            <span>{change}</span>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${
        color === 'green' ? 'text-emerald-600' :
        color === 'red' ? 'text-red-600' :
        color === 'blue' ? 'text-teal-600' :
        'text-slate-900'
      }`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">Last updated: just now</p>
    </div>
  )

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Track your business performance in real-time</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => loadData(true)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.revenue || 0)}
              change="+12.5%"
              icon={DollarSign}
              color="green"
              trend="up"
            />
            <StatCard
              title="Total Invoices"
              value={stats?.total_invoices || 0}
              change="+8.2%"
              icon={FileText}
              color="blue"
              trend="up"
            />
            <StatCard
              title="Paid Invoices"
              value={stats?.paid_invoices || 0}
              change="+5.1%"
              icon={CheckCircle}
              color="green"
              trend="up"
            />
            <StatCard
              title="Unpaid Invoices"
              value={stats?.unpaid_invoices || 0}
              change="0%"
              icon={Clock}
              color="yellow"
              trend={null}
            />
            <StatCard
              title="Overdue Invoices"
              value={stats?.overdue_invoices || 0}
              change="-2.3%"
              icon={AlertCircle}
              color="red"
              trend="down"
            />
            <StatCard
              title="Total Customers"
              value={stats?.total_customers || 0}
              change="+15.8%"
              icon={Users}
              color="purple"
              trend="up"
            />
            <StatCard
              title="Total Products"
              value={stats?.total_products || 0}
              change="+3.4%"
              icon={Package}
              color="blue"
              trend="up"
            />
            <StatCard
              title="Invoice Success Rate"
              value="94.2%"
              change="+2.1%"
              icon={TrendingUp}
              color="green"
              trend="up"
            />
          </>
        )}
      </div>

      {/* Quick Actions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/invoices/create')}
              className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 text-center"
            >
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold text-sm">New Invoice</div>
            </button>
            <button
              onClick={() => navigate('/customers/create')}
              className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 text-center"
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold text-sm">Add Customer</div>
            </button>
            <button
              onClick={() => navigate('/products/create')}
              className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 text-center"
            >
              <Package className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold text-sm">Add Product</div>
            </button>
            <button
              onClick={() => navigate('/invoices')}
              className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 text-center"
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold text-sm">View Reports</div>
            </button>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Revenue Growth</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-600 text-lg">+12.5%</p>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Invoice Success Rate</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 text-lg">94.2%</p>
                <p className="text-xs text-gray-500">+2.1% increase</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Customer Growth</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-purple-600 text-lg">+15.8%</p>
                <p className="text-xs text-gray-500">New customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-8 text-white">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Welcome to BukuKas!</h3>
            <p className="text-emerald-50 mb-6 text-lg">
              Your complete invoice management solution. Create invoices, track payments, and grow your business with ease.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/invoices/create')}
                className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
              >
                Create First Invoice →
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
