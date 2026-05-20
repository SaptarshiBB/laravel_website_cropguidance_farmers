import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  if (loading) return <div className="min-h-screen grid place-items-center"><LoadingSpinner /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}
