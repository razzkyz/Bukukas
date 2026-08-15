import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '@/services/authService'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization_name: '',
  })
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await authService.register(formData)
      localStorage.setItem('token', response.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src="/assets/images/logo.jpg" 
              alt="BukuKas Logo" 
              className="w-24 h-24 rounded-2xl object-contain bg-white p-2 shadow-2xl"
            />
          </div>
          <p className="text-gray-600 text-lg">Mulai kelola bisnis Anda sekarang</p>
        </div>

        {/* Register Card */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-center">Daftar Akun Baru</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">{error.message}</p>
              {error.fields && (
                <ul className="mt-2 text-sm list-disc list-inside">
                  {Object.entries(error.fields).map(([field, message]) => (
                    <li key={field}>{message as string}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="Min. 8 karakter"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Perusahaan
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="PT. ABC"
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
