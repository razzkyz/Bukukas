import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import CustomerCreate from './pages/CustomerCreate'
import CustomerEdit from './pages/CustomerEdit'
import Products from './pages/Products'
import ProductCreate from './pages/ProductCreate'
import ProductEdit from './pages/ProductEdit'
import Invoices from './pages/Invoices'
import InvoiceCreate from './pages/InvoiceCreate'
import InvoiceDetail from './pages/InvoiceDetail'
import InvoiceEdit from './pages/InvoiceEdit'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Customers */}
      <Route path="/customers" element={<Customers />} />
      <Route path="/customers/create" element={<CustomerCreate />} />
      <Route path="/customers/:id" element={<CustomerEdit />} />
      
      {/* Products */}
      <Route path="/products" element={<Products />} />
      <Route path="/products/create" element={<ProductCreate />} />
      <Route path="/products/:id" element={<ProductEdit />} />
      
      {/* Invoices */}
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/invoices/create" element={<InvoiceCreate />} />
      <Route path="/invoices/:id" element={<InvoiceDetail />} />
      <Route path="/invoices/:id/edit" element={<InvoiceEdit />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
