import api from '@/lib/api'

export interface Customer {
  id: number
  organization_id: number
  name: string
  email: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}

export interface CreateCustomerData {
  name: string
  email: string
  phone: string
  address: string
}

export interface PaginationResponse {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface CustomerListResponse {
  customers: Customer[]
  pagination: PaginationResponse
}

export const customerService = {
  async list(search?: string, page = 1, limit = 20): Promise<CustomerListResponse> {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await api.get(`/customers?${params}`)
    return {
      customers: response.data.data,
      pagination: response.data.pagination,
    }
  },

  async getById(id: number): Promise<Customer> {
    const response = await api.get(`/customers/${id}`)
    return response.data.data
  },

  async create(data: CreateCustomerData): Promise<Customer> {
    const response = await api.post('/customers', data)
    return response.data.data
  },

  async update(id: number, data: CreateCustomerData): Promise<Customer> {
    const response = await api.put(`/customers/${id}`, data)
    return response.data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/customers/${id}`)
  },
}
