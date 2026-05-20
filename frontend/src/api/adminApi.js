import api from './axios'
export const getUsers = async () => (await api.get('/admin/users')).data
export const updateUser = async (id, data) => (await api.put(`/admin/users/${id}`, data)).data
export const deleteUser = async id => (await api.delete(`/admin/users/${id}`)).data
export const getAnalytics = async () => (await api.get('/admin/analytics')).data
export const createCrop = async data => (await api.post('/crops', data)).data
export const updateCrop = async (id, data) => (await api.put(`/crops/${id}`, data)).data
export const deleteCrop = async id => (await api.delete(`/crops/${id}`)).data
export const createAlert = async data => (await api.post('/pest-alerts', data)).data
export const updateAlert = async (id, data) => (await api.put(`/pest-alerts/${id}`, data)).data
export const createScheme = async data => (await api.post('/schemes', data)).data
