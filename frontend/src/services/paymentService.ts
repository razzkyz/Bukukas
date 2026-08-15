import api from '@/lib/api'

export interface Payment {
  id: number
  organization_id: number
  invoice_id: number
  amount: number
  payment_method: 'cash' | 'bank_transfer' | 'qris' | 'other'
  paid_at: string
  notes: string
  created_at: string
}

export interface CreatePaymentData {
  amount: number
  payment_method: string
  paid_at: string
  notes: string
}

export const paymentService = {
  async getByInvoiceId(invoiceId: number): Promise<Payment[]> {
    const response = await api.get(`/invoices/${invoiceId}/payments`)
    return response.data.data
  },

  async create(invoiceId: number, data: CreatePaymentData): Promise<Payment> {
    const response = await api.post(`/invoices/${invoiceId}/payments`, data)
    return response.data.data
  },
}
