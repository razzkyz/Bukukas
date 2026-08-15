import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  CreditCard, 
  Users, 
  TrendingUp, 
  Zap, 
  Shield, 
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function Landing() {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Buku Kas Digital",
      description: "Catat semua transaksi bisnis Anda secara otomatis dan real-time",
      color: "text-teal-500"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Invoice Profesional",
      description: "Buat invoice cantik dalam hitungan detik, kirim langsung ke customer",
      color: "text-emerald-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Kelola Customer",
      description: "Database customer lengkap dengan riwayat transaksi dan pembayaran",
      color: "text-teal-500"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Laporan Keuangan",
      description: "Dashboard analytics real-time untuk monitor performa bisnis",
      color: "text-emerald-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Super Cepat",
      description: "Teknologi modern yang membuat kerja 10x lebih efisien",
      color: "text-teal-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Aman & Terpercaya",
      description: "Data terenkripsi dengan standar keamanan tingkat enterprise",
      color: "text-emerald-500"
    }
  ]

  const benefits = [
    "Hemat waktu hingga 5 jam per minggu",
    "Tidak perlu Excel ribet lagi",
    "Tagihan dibayar lebih cepat",
    "Pantau cashflow real-time",
    "Invoice profesional otomatis",
    "Laporan pajak lebih mudah"
  ]

  const testimonials = [
    {
      name: "Rina Kusuma",
      role: "Toko Baju Online",
      text: "Awalnya males banget bikin invoice manual. Pake BukuKas tinggal klik-klik, langsung jadi. Customer juga ga bingung lagi mau bayar kemana.",
      avatar: "RK",
      rating: 5
    },
    {
      name: "Dedi Prasetyo",
      role: "Bengkel Motor",
      text: "Dulu sering lupa catat transaksi, akhirnya bingung pas tutup buku. Sekarang semua tercatat otomatis, laporan juga tinggal print.",
      avatar: "DP",
      rating: 5
    },
    {
      name: "Maya Sari",
      role: "Katering Rumahan",
      text: "Customer suka karena invoice nya profesional. Padahal bikinnya cuma 2 menit. Ini sih game changer buat UMKM!",
      avatar: "MS",
      rating: 5
    }
  ]

  // Public landing page
  return (
    <div className="min-h-screen bg-white">
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 text-center">
        <p className="text-base font-semibold">
          Yuk pakai BukuKas agar bisnis lebih tertata, invoice cepat, dan pembukuan rapi tanpa ribet!
        </p>
      </div>

      {/* Navigation */}
      <nav className="border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-xl z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/assets/images/logo.jpg" 
                alt="BukuKas Logo" 
                className="w-14 h-14 rounded-xl object-contain bg-white p-1 shadow-lg"
              />
              <span className="text-3xl font-bold text-slate-900">
                BukuKas
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-lg"
              >
                Masuk
              </Link>
              <Link 
                to="/register" 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all hover:scale-105 text-lg"
              >
                Coba Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - BG.JPG Background */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/assets/images/bg.jpg" 
            alt="BukuKas Background" 
            className="w-full h-full object-contain bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40"></div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm mb-8">
              <Zap className="w-4 h-4" />
              <span>Trusted by 10,000+ UMKM Indonesia</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white mb-6">
              Siap untuk Bisnis yang
              <span className="text-emerald-400"> Lebih Tertata?</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-200 leading-relaxed mb-10">
              Bergabung dengan ribuan pengusaha yang sudah merasakan kemudahan BukuKas
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link 
                to="/register"
                className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all hover:scale-105"
              >
                <span>Coba Gratis 30 Hari</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center space-x-2 bg-emerald-500/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-500/30 transition-all"
              >
                <span>Sudah Punya Akun? Masuk</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Tidak perlu kartu kredit</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Gratis selamanya untuk fitur dasar</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Cancel kapan saja</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invoice Feature Section - NEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/assets/images/invoicesent.jpg" 
                  alt="Invoice Profesional BukuKas" 
                  className="w-full h-auto object-cover rounded-3xl border-4 border-slate-100"
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-white rounded-2xl shadow-2xl p-6 border-4 border-white">
                <div className="text-center">
                  <p className="text-3xl font-bold">2 Menit</p>
                  <p className="text-sm font-medium opacity-90">Bikin Invoice</p>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                <CreditCard className="w-4 h-4" />
                <span>Invoice Profesional</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Buat Invoice Cantik dalam
                <span className="text-emerald-500"> Hitungan Detik</span>
              </h2>

              <p className="text-xl text-slate-600 leading-relaxed">
                Tidak perlu repot lagi dengan Excel atau Word. Buat invoice profesional dengan logo bisnis Anda, 
                kirim langsung ke customer lewat email atau WhatsApp.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Template Profesional</h3>
                    <p className="text-slate-600">Pilih dari berbagai template invoice yang sudah disesuaikan untuk bisnis Indonesia</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Kirim Otomatis</h3>
                    <p className="text-slate-600">Kirim invoice ke customer via email atau WhatsApp, dengan tracking status pembayaran</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Reminder Otomatis</h3>
                    <p className="text-slate-600">Sistem akan mengingatkan customer yang belum bayar, tanpa perlu Anda repot</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link 
                  to="/register"
                  className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-emerald-500/50 transition-all hover:scale-105"
                >
                  <span>Coba Buat Invoice Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - REDESIGNED */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Semua yang Anda Butuhkan untuk
              <span className="text-emerald-500"> Mengelola Bisnis</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Platform lengkap untuk pembukuan, invoice, dan manajemen keuangan bisnis kecil
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white border-2 border-slate-200 p-8 rounded-2xl hover:border-emerald-200 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${feature.color.includes('teal') ? 'bg-teal-100' : 'bg-emerald-100'} rounded-xl flex items-center justify-center ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Kenapa Harus Pakai
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> BukuKas?</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Lebih dari 10,000 UMKM di Indonesia sudah merasakan manfaatnya
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link 
                  to="/register"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-emerald-300 transition-all hover:scale-105"
                >
                  <span>Mulai Gratis Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white border-2 border-slate-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:border-emerald-200 transition-all group"
                >
                  {/* Stars Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-slate-700 text-lg leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Reviewer Info */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-slate-100">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center border-2 border-emerald-200">
                        <span className="text-xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          {testimonial.avatar}
                        </span>
                      </div>
                      {/* Verified badge */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-base">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Siap untuk Bisnis yang Lebih Tertata?
          </h2>
          <p className="text-xl text-emerald-50 mb-10">
            Bergabung dengan ribuan pengusaha yang sudah merasakan kemudahan BukuKas
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="inline-flex items-center justify-center space-x-2 bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
            >
              <span>Coba Gratis 30 Hari</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/login"
              className="inline-flex items-center justify-center space-x-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all border-2 border-white"
            >
              <span>Sudah Punya Akun? Masuk</span>
            </Link>
          </div>

          <p className="mt-8 text-emerald-50 text-sm flex items-center justify-center space-x-6">
            <span className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Tidak perlu kartu kredit</span>
            </span>
            <span className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Gratis selamanya untuk fitur dasar</span>
            </span>
            <span className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Cancel kapan saja</span>
            </span>
          </p>
        </div>
      </section>

      {/* Footer - REDESIGNED */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/assets/images/logo.jpg" 
                  alt="BukuKas Logo" 
                  className="w-14 h-14 rounded-xl object-contain bg-white p-1 shadow-lg"
                />
                <span className="text-2xl font-bold text-white">BukuKas</span>
              </div>
              <p className="text-sm text-slate-400">
                Platform pembukuan modern untuk UMKM Indonesia
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Fitur</a></li>
                <li><Link to="/pricing" className="hover:text-emerald-400 transition-colors">Harga</Link></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Karir</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Kontak</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">
              © 2026 BukuKas. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
