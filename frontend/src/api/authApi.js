import api from './axios'
export const login = async data => (await api.post('/auth/login', data)).data
export const register = async data => (await api.post('/auth/register', data)).data
export const logout = async () => (await api.post('/auth/logout')).data
export const getMe = async () => (await api.get('/auth/me')).data
