import api from './axios'
export const getSummary = async () => (await api.get('/dashboard/summary')).data
export const getAdminSummary = async () => (await api.get('/dashboard/admin')).data
