export const cn = (...classes) => classes.filter(Boolean).join(' ')
export const titleCase = (text = '') => text.toString().replace(/\b\w/g, c => c.toUpperCase())
export const formatDate = date => date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Rolling'
export const apiError = error => error.response?.data?.message || Object.values(error.response?.data?.errors || {})?.[0]?.[0] || 'Something went wrong. Please try again.'
export const toArray = value => Array.isArray(value) ? value : String(value || '').split(/[,.]/).map(v => v.trim()).filter(Boolean)
export const fallback = (promise, value) => promise.catch(() => value)
