/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import * as authApi from '../api/authApi'
import { apiError } from '../utils/helpers'

const AuthContext = createContext(null)

const readStoredUser = () => {
  const stored = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')
  return stored ? JSON.parse(stored) : null
}

const clearAuthStorage = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('auth_user')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    const loadUser = async () => {
      if (!token) return setLoading(false)
      try {
        const data = await authApi.getMe()
        const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage
        storage.setItem('auth_user', JSON.stringify(data.user))
        setUser(data.user)
      } catch {
        clearAuthStorage()
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [token])

  const login = async credentials => {
    try {
      const data = await authApi.login(credentials)
      const storage = credentials.remember ? localStorage : sessionStorage
      clearAuthStorage()
      storage.setItem('auth_token', data.token)
      storage.setItem('auth_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      toast.success('Welcome back')
      return data.user
    } catch (error) {
      toast.error(apiError(error))
      throw error
    }
  }

  const register = async payload => {
    try {
      const data = await authApi.register(payload)
      clearAuthStorage()
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      toast.success('Account created')
      return data.user
    } catch (error) {
      toast.error(apiError(error))
      throw error
    }
  }

  const logout = async () => {
    try { await authApi.logout() } catch {
      // Local logout should still clear stale credentials if the server token is already gone.
    }
    clearAuthStorage()
    setToken(null)
    setUser(null)
    toast.success('Logged out')
  }

  const value = useMemo(() => ({
    user,
    userState: user?.state || '',
    userDistrict: user?.district || '',
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'admin'
  }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
