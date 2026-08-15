'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { invoiceService, InvoiceWithDetails } from '@/services/invoiceService'
import { paymentService, CreatePaymentData } from '@/services/paymentService'
import DashboardLayout from '@/components/DashboardLayout'

export default function InvoiceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const invoiceId = Number(params.id)
  
  const [loading, setLoading] = useState(true)
  const [invoice, setInvoice] = useState<InvoiceWithDetails | null>(null)
  const [error, setError] = useState<string>('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadInvoice()
  }, [invoiceId])

  const loadInvoice = async () => {
    try {
      setLoading(true)
      const data = await invoiceService.getById(invoiceId)
      setInvoice(data)
    } catch (error: any) {
      console.error('Error loading invoice:', error)
      setError('Invoice tidak ditemukan')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-600',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Draft',
      sent: 'Terkirim',
      paid: 'Lunas',
      overdue: 'Jatuh Tempo',
      cancelled: 'Dibatalkan',
    }
    return labels[status] || status
  }

  const handleSend = async () => {
    if (!invoice) return
    if (!confirm('Kirim invoice ini ke customer?')) return

    try {
      setActionLoading(true)
      await invoiceService.send(invoiceId)
      await loadInvoice() // Reload
      alert('Invoice berhasil dikirim!')
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Gagal mengirim invoice')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!invoice) return
    if (!confirm('Batalkan invoice ini? Tindakan ini tidak dapat dibatalkan.')) return

    try {
      setActionLoading(true)
      await invoiceService.cancel(invoiceId)
      await loadInvoice() // Reload
      alert('Invoice berhasil dibatalkan')
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Gagal membatalkan invoice')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!invoice) return
    if (!confirm('Hapus invoice ini? Tindakan ini tidak dapat dibatalkan.')) return

    try {
      setActionLoading(true)
      await invoiceService.delete(invoiceId)
      alert('Invoice berhasil dihapus')
      router.push('/invoices')
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Gagal menghapus invoice')
      setActionLoading(false)
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

  if (error || !invoice) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">{error || 'Invoice tidak ditemukan'}</p>
          <button onClick={() => router.push('/invoices')} className="btn-primary">
            Kembali ke Daftar Invoice
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/invoices')}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Kembali ke Daftar Invoice
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Invoice {invoice.invoice.invoice_number}
              </h1>
              <p className="text-gray-600">Detail invoice dan status pembayaran</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(invoice.invoice.status)}`}>
              {getStatusLabel(invoice.invoice.status)}
            </span>
          </div>
        </div>

        {/* Invoice Info Card */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Customer</h3>
              <div className="space-y-2">
                <p className="font-semibold text-lg">{invoice.customer.name}</p>
                {invoice.customer.email && (
                  <p className="text-gray-600 text-sm">📧 {invoice.customer.email}</p>
                )}
                {invoice.customer.phone && (
                  <p className="text-gray-600 text-sm">📱 {invoice.customer.phone}</p>
                )}
                {invoice.customer.address && (
                  <p className="text-gray-600 text-sm">📍 {invoice.customer.address}</p>
                )}
              </div>
            </div>

            {/* Invoice Dates */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informasi Invoice</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Tanggal Invoice</p>
                  <p className="font-medium">{formatDate(invoice.invoice.issue_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jatuh Tempo</p>
                  <p className="font-medium">{formatDate(invoice.invoice.due_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dibuat</p>
                  <p className="font-medium">{formatDate(invoice.invoice.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Item Invoice</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deskripsi</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Qty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Harga Satuan</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.unit_price)}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      {formatCurrency(item.quantity * item.unit_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations */}
          <div className="mt-6 border-t pt-4">
            <div className="space-y-2 max-w-sm ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.invoice.subtotal)}</span>
              </div>
              {invoice.invoice.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pajak:</span>
                  <span className="font-medium">{formatCurrency(invoice.invoice.tax)}</span>
                </div>
              )}
              {invoice.invoice.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Diskon:</span>
                  <span className="font-medium text-red-600">- {formatCurrency(invoice.invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>TOTAL:</span>
                <span className="text-primary-600">{formatCurrency(invoice.invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.invoice.notes && (
            <div className="mt-6 border-t pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Catatan:</p>
              <p className="text-sm text-gray-600">{invoice.invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Riwayat Pembayaran</h3>
            {invoice.invoice.status !== 'paid' && invoice.invoice.status !== 'cancelled' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-primary text-sm"
              >
                + Tambah Pembayaran
              </button>
            )}
          </div>

          {invoice.payments.length > 0 ? (
            <>
              <div className="space-y-3">
                {invoice.payments.map((payment: any) => (
                  <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(payment.paid_at)} • {payment.payment_method}
                        </p>
                        {payment.notes && (
                          <p className="text-sm text-gray-500 mt-1">{payment.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="space-y-2 max-w-sm ml-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Invoice:</span>
                    <span className="font-medium">{formatCurrency(invoice.invoice.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Dibayar:</span>
                    <span className="font-medium text-green-600">{formatCurrency(invoice.total_paid)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Sisa:</span>
                    <span className={invoice.amount_due > 0 ? 'text-red-600' : 'text-green-600'}>
                      {formatCurrency(invoice.amount_due)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-6">Belum ada pembayaran untuk invoice ini</p>
          )}
        </div>

        {/* Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Aksi</h3>
          <div className="flex flex-wrap gap-3">
            {invoice.invoice.status === 'draft' && (
              <>
                <button
                  onClick={handleSend}
                  className="btn-primary"
                  disabled={actionLoading}
                >
                  📧 Kirim Invoice
                </button>
                <button
                  onClick={() => router.push(`/invoices/${invoiceId}/edit`)}
                  className="btn-secondary"
                  disabled={actionLoading}
                >
                  ✏️ Edit
                </button>
              </>
            )}

            {invoice.invoice.status === 'sent' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-primary"
                disabled={actionLoading}
              >
                💰 Catat Pembayaran
              </button>
            )}

            {(invoice.invoice.status === 'draft' || invoice.invoice.status === 'sent') && (
              <button
                onClick={handleCancel}
                className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                disabled={actionLoading}
              >
                ❌ Batalkan Invoice
              </button>
            )}

            {invoice.invoice.status === 'draft' && (
              <button
                onClick={handleDelete}
                className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                disabled={actionLoading}
              >
                🗑️ Hapus Invoice
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="btn-secondary"
            >
              🖨️ Print / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          invoice={invoice}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false)
            loadInvoice()
          }}
        />
      )}
    </DashboardLayout>
  )
}

// Payment Modal Component
function PaymentModal({ 
  invoice, 
  onClose, 
  onSuccess 
}: { 
  invoice: InvoiceWithDetails
  onClose: () => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [formData, setFormData] = useState<CreatePaymentData>({
    amount: invoice.amount_due,
    payment_method: 'bank_transfer',
    paid_at: new Date().toISOString().split('T')[0],
    notes: '',
  })

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

    // Validation
    if (formData.amount <= 0) {
      setError({ message: 'Jumlah pembayaran harus lebih dari 0' })
      return
    }

    if (formData.amount > invoice.amount_due) {
      if (!confirm(`Pembayaran (${formatCurrency(formData.amount)}) melebihi sisa tagihan (${formatCurrency(invoice.amount_due)}). Lanjutkan?`)) {
        return
      }
    }

    try {
      setLoading(true)
      await paymentService.create(invoice.invoice.id, formData)
      alert('Pembayaran berhasil dicatat!')
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Catat Pembayaran</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

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

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Total Invoice:</span>
              <span className="font-medium">{formatCurrency(invoice.invoice.total)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Sudah Dibayar:</span>
              <span className="font-medium">{formatCurrency(invoice.total_paid)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Sisa Tagihan:</span>
              <span className="text-red-600">{formatCurrency(invoice.amount_due)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Pembayaran <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="input-field"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                required
                min="1"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metode Pembayaran <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field"
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                required
              >
                <option value="cash">Tunai</option>
                <option value="bank_transfer">Transfer Bank</option>
                <option value="qris">QRIS</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Pembayaran <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="input-field"
                value={formData.paid_at}
                onChange={(e) => setFormData({ ...formData, paid_at: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Catatan pembayaran (opsional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Pembayaran'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
