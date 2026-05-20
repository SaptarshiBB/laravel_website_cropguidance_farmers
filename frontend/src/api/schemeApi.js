import api from './axios'
export const getSchemes = async () => (await api.get('/schemes')).data
export const getScheme = async id => (await api.get(`/schemes/${id}`)).data
