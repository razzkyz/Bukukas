import api from '@/lib/api'

export interface Invoice {
  id: number
  organization_id: number
  customer_id: number
  invoice_number: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  issue_date: string
  due_date: string
  subtotal: number
  tax: number
  discount: number
  total: number
  notes: string
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  product_id?: number
  description: string
  quantity: number
  unit_price: number
}

export interface CreateInvoiceData {
  customer_id: number
  issue_date: string
  due_date: string
  items: InvoiceItem[]
  tax: number
  discount: number
  notes: string
}

export interface InvoiceWithDetails {
  invoice: Invoice
  customer: any
  items: any[]
  payments: any[]
  total_paid: number
  amount_due: number
}

export const invoiceService = {
  async list(status?: string, page = 1, limit = 20) {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await api.get(`/invoices?${params}`)
    return {
      invoices: response.data.data,
      pagination: response.data.pagination,
    }
  },

  async getById(id: number): Promise<InvoiceWithDetails> {
    const response = await api.get(`/invoices/${id}`)
    return response.data.data
  },

  async create(data: CreateInvoiceData): Promise<Invoice> {
    const response = await api.post('/invoices', data)
    return response.data.data
  },

  async update(id: number, data: CreateInvoiceData): Promise<Invoice> {
    const response = await api.put(`/invoices/${id}`, data)
    return response.data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/invoices/${id}`)
  },

  async send(id: number): Promise<void> {
    await api.post(`/invoices/${id}/send`)
  },

  async cancel(id: number): Promise<void> {
    await api.post(`/invoices/${id}/cancel`)
  },
}
