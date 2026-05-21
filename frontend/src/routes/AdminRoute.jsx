import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated && !isAdmin) toast.error('Access Denied')
  }, [loading, isAuthenticated, isAdmin])

  if (loading) return <div className="min-h-screen grid place-items-center"><LoadingSpinner /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}
