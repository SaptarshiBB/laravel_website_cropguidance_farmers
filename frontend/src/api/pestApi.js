import api from './axios'

export const getAlerts = async params => (await api.get('/pest-alerts', { params })).data
export const getAlertsByState = async state => (await api.get('/pest-alerts', { params: { state } })).data
export const reportPestSighting = async data => (await api.post('/pest-alerts/report', data)).data
