import api from '@/lib/api'

export interface RegisterData {
  name: string
  email: string
  password: string
  organization_name: string
}

export interface LoginData {
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data)
    return response.data.data
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data)
    return response.data.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
  },
}
