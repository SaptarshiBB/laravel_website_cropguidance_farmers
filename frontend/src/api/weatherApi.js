import api from './axios'

export const getWeatherByCity = (city, state = '') =>
  api.get('/weather', { params: { city, state } })

export const getForecastByCity = (city, state = '') =>
  api.get('/weather/forecast', { params: { city, state } })

export const getWeather = async params => (await getWeatherByCity(params.city, params.state)).data
export const getForecast = async params => (await getForecastByCity(params.city, params.state)).data
export const storeWeatherLog = async data => (await api.post('/weather/log', data)).data
