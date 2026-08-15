import axios from 'axios'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000, // 30 second timeout (for slower connections)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle errors with strict validation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized (invalid/expired token)
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Show notification
      await Swal.fire({
        icon: 'warning',
        title: 'Sesi Berakhir',
        text: 'Sesi Anda telah berakhir. Silakan login kembali.',
        confirmButtonText: 'Login',
        confirmButtonColor: '#10b981',
        allowOutsideClick: false,
      })
      
      // Redirect to login
      window.location.href = '/login'
      return Promise.reject(error)
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      await Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Anda tidak memiliki izin untuk mengakses resource ini.',
        confirmButtonColor: '#10b981',
      })
      return Promise.reject(error)
    }
    
    // Handle 429 Too Many Requests (rate limiting)
    if (error.response?.status === 429) {
      await Swal.fire({
        icon: 'warning',
        title: 'Terlalu Banyak Percobaan',
        text: 'Anda terlalu banyak melakukan request. Tunggu beberapa saat.',
        confirmButtonColor: '#10b981',
      })
      return Promise.reject(error)
    }
    
    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      await Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Server mengalami masalah. Coba lagi nanti.',
        confirmButtonColor: '#10b981',
      })
      return Promise.reject(error)
    }
    
    // Handle network errors
    if (!error.response) {
      await Swal.fire({
        icon: 'error',
        title: 'Koneksi Gagal',
        text: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        confirmButtonColor: '#10b981',
      })
      return Promise.reject(error)
    }
    
    return Promise.reject(error)
  }
)

// Validate token on app load
export const validateToken = async (): Promise<boolean> => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return false
  }
  
  try {
    // Call backend to validate token
    await api.get('/auth/me')
    return true
  } catch (error) {
    // Token invalid, clear storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return false
  }
}

export default api
