import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="min-h-screen grid place-items-center"><LoadingSpinner /></div>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
}
