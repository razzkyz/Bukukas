import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productService } from '@/services/productService'
import DashboardLayout from '@/components/DashboardLayout'

const UNIT_OPTIONS = [
  'pcs',
  'unit',
  'jam',
  'hari',
  'bulan',
  'paket',
  'kg',
  'meter',
  'liter',
  'box',
  'lusin',
  'set',
]

export default function EditProductPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const productId = Number(id)
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'pcs',
  })

  useEffect(() => {
    loadProduct()
  }, [])

  const loadProduct = async () => {
    try {
      const product = await productService.getById(productId)
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        unit: product.unit,
      })
    } catch (error) {
      console.error('Error loading product:', error)
      alert('Produk tidak ditemukan')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await productService.update(productId, {
        ...formData,
        price: parseFloat(formData.price),
      })
      navigate('/products')
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Produk/Jasa</h1>
          <p className="text-gray-600">Update informasi produk atau jasa</p>
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
                Nama Produk/Jasa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Jasa Konsultasi, Produk A, dll"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Deskripsi singkat tentang produk/jasa..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
                  <input
                    type="number"
                    className="input-field pl-10"
                    placeholder="100000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <select
                  className="input-field"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                >
                  {UNIT_OPTIONS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
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
                {submitting ? 'Menyimpan...' : 'Update Produk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
