'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import api from '@/lib/api'

interface DashboardStats {
  revenue: number
  paid_invoices: number
  unpaid_invoices: number
  overdue_invoices: number
  total_customers: number
  total_products: number
  total_invoices: number
}

// Skeleton Loader Component
function StatCardSkeleton() {
  return (
    <div className="stat-card animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-8 bg-gray-300 rounded w-32 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-20"></div>
    </div>
  )
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  trend 
}: { 
  title: string
  value: string
  change: string
  icon: string
  color: string
  trend: 'up' | 'down' | 'neutral'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
  }

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {trend === 'up' && (
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>{change}</span>
          </div>
        )}
        {trend === 'down' && (
          <div className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{change}</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-400">Last updated: just now</p>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    loadData()
    
    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadData(false) // Silent refresh (no loading state)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      
      const response = await api.get('/dashboard/stats')
      setStats(response.data.data)
      setLastUpdate(new Date())
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Track your business performance in real-time</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => loadData(true)}
              className="p-2.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all hover:shadow-md"
              title="Refresh data"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className="bg-white px-4 py-2.5 rounded-xl border border-gray-200 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.revenue || 0)}
              change="+12.5%"
              icon="💰"
              color="green"
              trend="up"
            />
            <StatCard
              title="Total Invoices"
              value={formatNumber(stats?.total_invoices || 0)}
              change="+8.2%"
              icon="🧾"
              color="blue"
              trend="up"
            />
            <StatCard
              title="Paid Invoices"
              value={formatNumber(stats?.paid_invoices || 0)}
              change="+5.1%"
              icon="✅"
              color="green"
              trend="up"
            />
            <StatCard
              title="Unpaid Invoices"
              value={formatNumber(stats?.unpaid_invoices || 0)}
              change="0%"
              icon="⏳"
              color="yellow"
              trend="neutral"
            />
            <StatCard
              title="Overdue Invoices"
              value={formatNumber(stats?.overdue_invoices || 0)}
              change="-2.3%"
              icon="⚠️"
              color="red"
              trend="down"
            />
            <StatCard
              title="Total Customers"
              value={formatNumber(stats?.total_customers || 0)}
              change="+15.8%"
              icon="👥"
              color="purple"
              trend="up"
            />
            <StatCard
              title="Total Products"
              value={formatNumber(stats?.total_products || 0)}
              change="+3.4%"
              icon="📦"
              color="indigo"
              trend="up"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Create New */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/invoices/create')}
              className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 group"
            >
              <div className="text-3xl mb-2">🧾</div>
              <div className="font-semibold text-sm">New Invoice</div>
            </button>
            <button
              onClick={() => router.push('/customers/create')}
              className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 group"
            >
              <div className="text-3xl mb-2">👤</div>
              <div className="font-semibold text-sm">Add Customer</div>
            </button>
            <button
              onClick={() => router.push('/products/create')}
              className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 group"
            >
              <div className="text-3xl mb-2">📦</div>
              <div className="font-semibold text-sm">Add Product</div>
            </button>
            <button
              onClick={() => router.push('/invoices')}
              className="p-4 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 group"
            >
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold text-sm">View Reports</div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <span className="text-2xl">📈</span>
            <span>Performance Insights</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
                  💰
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Revenue Growth</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">+12.5%</p>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                  🧾
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Invoice Success Rate</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">94.2%</p>
                <p className="text-xs text-gray-500">+2.1% increase</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                  👥
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Customer Growth</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-purple-600">+15.8%</p>
                <p className="text-xs text-gray-500">New customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips & Welcome Message */}
      <div className="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex items-start space-x-4">
          <div className="text-5xl">🎉</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Welcome to Invoice SaaS!</h3>
            <p className="text-indigo-100 mb-4">
              Your complete invoice management solution. Create invoices, track payments, and grow your business with ease.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/invoices/create')}
                className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
              >
                Create First Invoice →
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
