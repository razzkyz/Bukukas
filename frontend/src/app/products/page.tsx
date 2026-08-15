'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { productService, Product } from '@/services/productService'
import DashboardLayout from '@/components/DashboardLayout'
import { useDebounce } from '@/hooks/useDebounce'

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500) // 500ms debounce
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  })
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null)

  useEffect(() => {
    loadProducts()
  }, [pagination.page, debouncedSearch]) // Use debouncedSearch

  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await productService.list(debouncedSearch, pagination.page, pagination.limit)
      setProducts(response.products)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPagination({ ...pagination, page: 1 })
  }

  const handleDelete = async (id: number) => {
    try {
      await productService.delete(id)
      setShowDeleteModal(null)
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Gagal menghapus produk')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Produk & Jasa</h1>
            <p className="text-gray-600">Kelola produk dan layanan Anda</p>
          </div>
          <button
            onClick={() => router.push('/products/create')}
            className="btn-primary"
          >
            + Tambah Produk
          </button>
        </div>

        {/* Search */}
        <div className="card">
          <input
            type="text"
            placeholder="🔍 Cari produk atau jasa..."
            className="input-field"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">Belum ada produk/jasa</p>
            <button
              onClick={() => router.push('/products/create')}
              className="btn-primary"
            >
              Tambah Produk Pertama
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="text-primary-600 hover:text-primary-900 text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(product.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description || 'Tidak ada deskripsi'}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-sm text-gray-500">per {product.unit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="card flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">{products.length}</span> dari{' '}
                <span className="font-medium">{pagination.total}</span> produk
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  « Prev
                </button>
                <div className="flex items-center px-4 text-sm">
                  Halaman {pagination.page} dari {pagination.total_pages}
                </div>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.total_pages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next »
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Yakin ingin menghapus produk ini? Data yang sudah dihapus tidak bisa dikembalikan.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="btn-secondary"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
