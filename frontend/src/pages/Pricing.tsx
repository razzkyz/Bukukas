import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Zap, Crown, Rocket, Star } from 'lucide-react'
import Swal from 'sweetalert2'
import api from '@/lib/api'

export default function Pricing() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<string | null>(null)
  
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 5000,
      icon: <Zap className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      features: [
        '5 Invoice per bulan',
        '10 Customer',
        '10 Produk',
        'Dashboard basic',
        'Export PDF',
      ],
      popular: false,
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 10000,
      icon: <Star className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-500',
      features: [
        '20 Invoice per bulan',
        '50 Customer',
        '50 Produk',
        'Dashboard lengkap',
        'Export PDF & Excel',
        'Email notification',
      ],
      popular: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 20000,
      icon: <Crown className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Unlimited Invoice',
        'Unlimited Customer',
        'Unlimited Produk',
        'Analytics advanced',
        'Multi user (3 user)',
        'WhatsApp integration',
        'Priority support',
      ],
      popular: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 30000,
      icon: <Rocket className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      features: [
        'Semua fitur Pro',
        'Multi user (unlimited)',
        'Custom domain',
        'API access',
        'White label',
        'Dedicated support',
        'Custom features',
      ],
      popular: false,
    },
  ]

  const handleSubscribe = async (plan: typeof plans[0]) => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      const result = await Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Silakan login terlebih dahulu untuk berlangganan',
        showCancelButton: true,
        confirmButtonText: 'Login Sekarang',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#10b981',
      })
      
      if (result.isConfirmed) {
        navigate('/login')
      }
      return
    }

    setLoading(plan.id)

    try {
      // Call backend to create DOKU payment
      const response = await api.post('/payments/create-subscription', {
        plan_id: plan.id,
        amount: plan.price,
      })

      const { payment_url, invoice_number } = response.data

      // Show confirmation
      const result = await Swal.fire({
        icon: 'success',
        title: 'Pembayaran Dibuat',
        html: `
          <p>Invoice: <strong>${invoice_number}</strong></p>
          <p>Total: <strong>Rp ${plan.price.toLocaleString('id-ID')}</strong></p>
          <p class="mt-4 text-sm text-gray-600">Anda akan diarahkan ke halaman pembayaran DOKU</p>
        `,
        confirmButtonText: 'Bayar Sekarang',
        confirmButtonColor: '#10b981',
        showCancelButton: true,
        cancelButtonText: 'Nanti',
      })

      if (result.isConfirmed) {
        // Redirect to DOKU payment page
        window.location.href = payment_url
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.error || 'Gagal membuat pembayaran',
        confirmButtonColor: '#10b981',
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/assets/images/logo.jpg" 
                alt="BukuKas Logo" 
                className="w-14 h-14 rounded-xl object-cover shadow-lg"
              />
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                BukuKas
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-lg"
              >
                Masuk
              </Link>
              <Link 
                to="/dashboard" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-200 transition-all hover:scale-105"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Pilih Paket yang
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Sesuai Bisnis Anda</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mulai gratis, upgrade kapan saja. Semua paket termasuk trial 7 hari!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl shadow-xl p-8 transition-all hover:scale-105 ${
                plan.popular ? 'ring-4 ring-emerald-500 ring-offset-4' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    🔥 Paling Populer
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                {plan.icon}
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    Rp {(plan.price / 1000).toFixed(0)}K
                  </span>
                  <span className="text-gray-500 ml-2">/bulan</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Trial 7 hari gratis</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-xl hover:shadow-emerald-300'
                    : 'bg-gray-800 hover:bg-gray-900'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Berlangganan Sekarang'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Pertanyaan Umum</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-2">💳 Metode pembayaran apa saja yang diterima?</h3>
              <p className="text-gray-600">Kami menerima Virtual Account (BCA, Mandiri, BNI, BRI), E-Wallet (OVO, GoPay, Dana), dan Credit Card melalui DOKU Payment Gateway.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-2">🔄 Apakah bisa upgrade/downgrade paket?</h3>
              <p className="text-gray-600">Ya! Anda bisa upgrade atau downgrade kapan saja. Perbedaan biaya akan di-prorata secara otomatis.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-2">⏰ Kapan trial 7 hari dimulai?</h3>
              <p className="text-gray-600">Trial dimulai setelah Anda berlangganan. Anda bisa cancel kapan saja selama trial tanpa dikenakan biaya.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-2">🔒 Apakah data saya aman?</h3>
              <p className="text-gray-600">Sangat aman! Kami menggunakan enkripsi SSL 256-bit dan server berada di Indonesia. Data Anda di-backup setiap hari.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© 2026 BukuKas. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-gray-400 hover:text-emerald-400">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-emerald-400">Terms</a>
            <a href="#" className="text-gray-400 hover:text-emerald-400">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
