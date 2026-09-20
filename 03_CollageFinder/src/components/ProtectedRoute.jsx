import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated } from '../store/slices/authSlice'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to admin login with return path
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}

