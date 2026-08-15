import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { customerService } from '@/services/customerService'
import DashboardLayout from '@/components/DashboardLayout'

export default function EditCustomerPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const customerId = Number(id)
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    loadCustomer()
  }, [])

  const loadCustomer = async () => {
    try {
      const customer = await customerService.getById(customerId)
      setFormData({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
      })
    } catch (error) {
      console.error('Error loading customer:', error)
      alert('Customer tidak ditemukan')
      navigate('/customers')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await customerService.update(customerId, formData)
      navigate('/customers')
    } catch (err: any) {
      setError(err.response?.data?.error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Kembali
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
          <p className="text-gray-600">Update informasi customer</p>
        </div>

        {/* Form */}
        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="PT. ABC atau John Doe"
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
                placeholder="customer@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telepon
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="08123456789 atau 021-12345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Jl. Sudirman No. 123, Jakarta"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Menyimpan...' : 'Update Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
