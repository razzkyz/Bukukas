import api from '@/lib/api'

export interface Product {
  id: number
  organization_id: number
  name: string
  description: string
  price: number
  unit: string
  created_at: string
  updated_at: string
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  unit: string
}

export interface PaginationResponse {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface ProductListResponse {
  products: Product[]
  pagination: PaginationResponse
}

export const productService = {
  async list(search?: string, page = 1, limit = 20): Promise<ProductListResponse> {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await api.get(`/products?${params}`)
    return {
      products: response.data.data,
      pagination: response.data.pagination,
    }
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`)
    return response.data.data
  },

  async create(data: CreateProductData): Promise<Product> {
    const response = await api.post('/products', data)
    return response.data.data
  },

  async update(id: number, data: CreateProductData): Promise<Product> {
    const response = await api.put(`/products/${id}`, data)
    return response.data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/products/${id}`)
  },
}
