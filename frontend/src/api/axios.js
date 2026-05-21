import axios from 'axios'

const cache = {}
const CACHE_DURATION = 5 * 60 * 1000

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`

  const method = (config.method || 'get').toLowerCase()
  if (method === 'get') {
    const url = api.getUri(config)
    const cached = cache[url]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      config.adapter = () => Promise.resolve({
        data: cached.data,
        status: 200,
        statusText: 'OK',
        headers: cached.headers || {},
        config,
        request: null
      })
    }
    config.cacheKey = url
  } else {
    Object.keys(cache).forEach(key => delete cache[key])
  }

  return config
})

api.interceptors.response.use(
  res => {
    if ((res.config.method || 'get').toLowerCase() === 'get' && res.config.cacheKey) {
      cache[res.config.cacheKey] = {
        data: res.data,
        headers: res.headers,
        timestamp: Date.now()
      }
    }
    return res
  },
  err => {
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
