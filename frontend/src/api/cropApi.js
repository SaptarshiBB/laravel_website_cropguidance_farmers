import api from './axios'
export const getCrops = async () => (await api.get('/crops')).data
export const getCrop = async id => (await api.get(`/crops/${id}`)).data
export const getRecommendation = async data => (await api.post('/recommendations', data)).data
