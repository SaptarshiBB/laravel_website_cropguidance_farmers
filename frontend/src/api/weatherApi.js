import api from './axios'
export const getWeather = async params => (await api.get('/weather', { params })).data
export const getForecast = async params => (await api.get('/weather/forecast', { params })).data
export const storeWeatherLog = async data => (await api.post('/weather/log', data)).data
