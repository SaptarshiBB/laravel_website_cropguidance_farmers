import api from './axios'

export const getAdminStats = async () => (await api.get('/admin/stats')).data
export const getAdminUsers = async () => {
  const data = (await api.get('/admin/users')).data
  return data.data || data
}
export const promoteUser = async data => (await api.post('/admin/promote', data)).data
export const demoteUser = async data => (await api.post('/admin/demote', data)).data
export const getActivityLogs = async page => (await api.get(`/admin/activity-logs?page=${page}`)).data

export const createCrop = async data => (await api.post('/crops', data)).data
export const updateCrop = async (id, data) => (await api.put(`/crops/${id}`, data)).data
export const deleteCrop = async id => (await api.delete(`/crops/${id}`)).data
export const createAlert = async data => (await api.post('/pest-alerts', data)).data
export const updateAlert = async (id, data) => (await api.put(`/pest-alerts/${id}`, data)).data
export const createScheme = async data => (await api.post('/schemes', data)).data
