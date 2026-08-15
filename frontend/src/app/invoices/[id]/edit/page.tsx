'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { invoiceService } from '@/services/invoiceService'
import { customerService } from '@/services/customerService'
import { productService } from '@/services/productService'
import DashboardLayout from '@/components/DashboardLayout'

export default function EditInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const invoiceId = Number(params.id)
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [error, setError] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    customer_id: '',
    issue_date: '',
    due_date: '',
    tax: '0',
    discount: '0',
    notes: '',
  })

  const [items, setItems] = useState<any[]>([
    { product_id: '', description: '', quantity: '1', unit_price: '0' }
  ])

  useEffect(() => {
    loadData()
  }, [invoiceId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [invoiceData, customersData, productsData] = await Promise.all([
        invoiceService.getById(invoiceId),
        customerService.list('', 1, 100),
        productService.list('', 1, 100),
      ])

      // Check if invoice can be edited
      if (invoiceData.invoice.status !== 'draft') {
        alert('Hanya invoice dengan status Draft yang dapat diedit')
        router.push(`/invoices/${invoiceId}`)
        return
      }

      setCustomers(customersData.customers)
      setProducts(productsData.products)

      // Set form data
      setFormData({
        customer_id: invoiceData.invoice.customer_id.toString(),
        issue_date: invoiceData.invoice.issue_date.split('T')[0],
        due_date: invoiceData.invoice.due_date.split('T')[0],
        tax: invoiceData.invoice.tax.toString(),
        discount: invoiceData.invoice.discount.toString(),
        notes: invoiceData.invoice.notes || '',
      })

      // Set items
      setItems(invoiceData.items.map((item: any) => ({
        product_id: item.product_id?.toString() || '',
        description: item.description,
        quantity: item.quantity.toString(),
        unit_price: item.unit_price.toString(),
      })))

    } catch (error) {
      console.error('Error loading data:', error)
      alert('Invoice tidak ditemukan')
      router.push('/invoices')
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setItems([...items, { product_id: '', description: '', quantity: '1', unit_price: '0' }])
  }

  const removeItem = (index: number) => {
    if (items.length === 1) {
      alert('Invoice harus memiliki minimal 1 item')
      return
    }
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index][field] = value
    
    // Auto-fill dari produk
    if (field === 'product_id' && value) {
      const product = products.find(p => p.id === parseInt(value))
      if (product) {
        newItems[index].description = product.name
        newItems[index].unit_price = product.price.toString()
      }
    }
    
    setItems(newItems)
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) * parseFloat(item.unit_price))
    }, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = parseFloat(formData.tax) || 0
    const discount = parseFloat(formData.discount) || 0
    return subtotal + tax - discount
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const invoiceData = {
        customer_id: parseInt(formData.customer_id),
        issue_date: formData.issue_date,
        due_date: formData.due_date,
        items: items.map(item => ({
          product_id: item.product_id ? parseInt(item.product_id) : undefined,
          description: item.description,
          quantity: parseFloat(item.quantity),
          unit_price: parseFloat(item.unit_price),
        })),
        tax: parseFloat(formData.tax),
        discount: parseFloat(formData.discount),
        notes: formData.notes,
      }

      await invoiceService.update(invoiceId, invoiceData)
      alert('Invoice berhasil diupdate!')
      router.push(`/invoices/${invoiceId}`)
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
      <div className="max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Kembali
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Invoice</h1>
          <p className="text-gray-600">Update informasi invoice</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer & Dates */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Informasi Invoice</h3>
            
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  className="input-field"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  required
                >
                  <option value="">Pilih Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Invoice <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jatuh Tempo <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Item Invoice</h3>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Item #{index + 1}</h4>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️ Hapus
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Produk (opsional)
                      </label>
                      <select
                        className="input-field"
                        value={item.product_id}
                        onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                      >
                        <option value="">Pilih Produk atau isi manual</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - {formatCurrency(product.price)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        required
                        min="0.01"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga Satuan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                        required
                        min="0"
                        step="1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-right">
                        <span className="text-sm text-gray-600">Subtotal: </span>
                        <span className="font-semibold">
                          {formatCurrency(parseFloat(item.quantity) * parseFloat(item.unit_price))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addItem}
                className="btn-secondary w-full"
              >
                + Tambah Item
              </button>
            </div>
          </div>

          {/* Calculations */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Perhitungan</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pajak (Rp)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diskon (Rp)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pajak:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(formData.tax) || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Diskon:</span>
                  <span className="font-medium">- {formatCurrency(parseFloat(formData.discount) || 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>TOTAL:</span>
                  <span className="text-primary-600">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Catatan tambahan untuk invoice ini..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : 'Update Invoice'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
