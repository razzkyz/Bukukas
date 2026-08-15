import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { customerService, Customer } from '@/services/customerService'
import DashboardLayout from '@/components/DashboardLayout'
import { useDebounce } from '@/hooks/useDebounce'

export default function CustomersPage() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  })
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [pagination.page, debouncedSearch])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const response = await customerService.list(debouncedSearch, pagination.page, pagination.limit)
      setCustomers(response.customers)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Error loading customers:', error)
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
      await customerService.delete(id)
      setShowDeleteModal(null)
      loadCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Gagal menghapus customer')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer</h1>
            <p className="text-gray-600">Kelola data customer Anda</p>
          </div>
          <button
            onClick={() => navigate('/customers/create')}
            className="btn-primary"
          >
            + Tambah Customer
          </button>
        </div>

        {/* Search */}
        <div className="card">
          <input
            type="text"
            placeholder="🔍 Cari customer (nama atau email)..."
            className="input-field"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="card overflow-hidden p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Belum ada customer</p>
              <button
                onClick={() => navigate('/customers/create')}
                className="btn-primary"
              >
                Tambah Customer Pertama
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telepon
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alamat
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{customer.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {customer.email || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {customer.phone || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="max-w-xs truncate">{customer.address || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => navigate(`/customers/${customer.id}`)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(customer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                <div className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{customers.length}</span> dari{' '}
                  <span className="font-medium">{pagination.total}</span> customer
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
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Yakin ingin menghapus customer ini? Data yang sudah dihapus tidak bisa dikembalikan.
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
