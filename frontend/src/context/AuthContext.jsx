import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import * as authApi from '../api/authApi'
import { apiError } from '../utils/helpers'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    const loadUser = async () => {
      if (!token) return setLoading(false)
      try {
        const data = await authApi.getMe()
        setUser(data.user)
      } catch {
        localStorage.removeItem('auth_token')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [token])

  const login = async credentials => {
    try {
      const data = await authApi.login(credentials)
      localStorage.setItem('auth_token', data.token)
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
      localStorage.setItem('auth_token', data.token)
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
    try { await authApi.logout() } catch {}
    localStorage.removeItem('auth_token')
    setToken(null)
    setUser(null)
    toast.success('Logged out')
  }

  const value = useMemo(() => ({ user, token, loading, login, register, logout, isAuthenticated: Boolean(user && token), isAdmin: user?.role === 'admin' }), [user, token, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
