import api from './axios'
export const getAlerts = async () => (await api.get('/pest-alerts')).data
export const getAlertsByState = async state => (await api.get('/pest-alerts/state', { params: { state } })).data
