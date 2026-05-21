import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, CloudRain, Droplets, Eye, Gauge, Search, Sunrise, Sunset, Thermometer, Wind } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'
import { getForecastByCity, getWeatherByCity } from '../api/weatherApi'
import { useAuthContext } from '../context/AuthContext'

export default function WeatherPage() {
  const { userDistrict, userState } = useAuthContext()
  const [cityInput, setCityInput] = useState('')
  const [searchedCity, setSearchedCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [hourlyData, setHourlyData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchWeather = useCallback(async (city, state = '') => {
    const cleanCity = city.trim()
    if (cleanCity.length < 2) {
      toast.error('Enter a valid city name')
      return
    }

    setLoading(true)
    setError('')
    try {
      const weatherResponse = await getWeatherByCity(cleanCity, state)
      const weather = weatherResponse.data.data

      if (!weather?.city || !weather.city.toLowerCase().includes(cleanCity.toLowerCase().split(' ')[0])) {
        throw new Error('City not found. Try a different spelling.')
      }

      const forecastResponse = await getForecastByCity(cleanCity, state)
      const forecast = forecastResponse.data.data
      setWeatherData(weather)
      setForecastData(forecast.forecast || weather.forecast || [])
      setHourlyData(forecast.hourly || weather.hourly || [])
      setSearchedCity(weather.location || [weather.city, weather.state].filter(Boolean).join(', '))
    } catch (err) {
      const message = err.message || 'City not found. Try a different spelling.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userDistrict) {
      const timer = setTimeout(() => {
        setCityInput(userDistrict)
        searchWeather(userDistrict, userState || '')
      }, 0)
      return () => clearTimeout(timer)
    }

    if (!navigator.geolocation) return undefined
    navigator.geolocation.getCurrentPosition(async position => {
      try {
        const { latitude, longitude } = position.coords
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
        const data = await response.json()
        const city = data.city || data.locality || data.principalSubdivision
        const state = data.principalSubdivision || ''
        if (city) {
          setCityInput(city)
          searchWeather(city, state)
        }
      } catch {
        setError('Enter your city to load local weather.')
      }
    }, () => setError('Enter your city to load local weather.'))
    return undefined
  }, [userDistrict, userState, searchWeather])

  const recommendations = useMemo(() => {
    if (!weatherData) return []
    const condition = weatherData.condition.toLowerCase()
    const tips = []
    if (weatherData.temperature > 36) tips.push(['Heat care', 'Irrigate early morning and use mulching around sensitive crops.'])
    if (weatherData.humidity > 80) tips.push(['Disease watch', 'High humidity can favor fungal disease. Scout leaves closely.'])
    if (weatherData.wind_speed > 25) tips.push(['Spray timing', 'Delay pesticide or foliar nutrient sprays until wind drops.'])
    if (condition.includes('rain')) tips.push(['Drainage', 'Open drainage channels and skip irrigation until soil moisture falls.'])
    if (!tips.length) tips.push(['Field work', 'Good window for scouting, weeding, harvesting, and irrigation checks.'])
    tips.push(['Livestock', 'Keep drinking water and shade available during peak afternoon hours.'])
    return tips.slice(0, 4)
  }, [weatherData])

  const severe = useMemo(() => {
    if (!weatherData) return null
    const maxRain = Math.max(...forecastData.map(day => day.rain_chance || 0), 0)
    const condition = weatherData.condition.toLowerCase()
    if (weatherData.temperature > 40) return 'Heatwave risk. Protect crops, workers, and livestock.'
    if (maxRain > 80) return 'Heavy rain risk. Avoid spraying and check field drainage.'
    if (weatherData.wind_speed > 40) return 'High wind risk. Secure greenhouses and delay spraying.'
    if (condition.includes('storm') || condition.includes('thunder')) return 'Storm alert. Avoid field work until conditions improve.'
    return null
  }, [weatherData, forecastData])

  const submit = event => {
    event.preventDefault()
    searchWeather(cityInput)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <form onSubmit={submit} className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900 sm:flex-row">
          <input className="min-h-11 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-950" placeholder="Enter city name..." value={cityInput} onChange={e => setCityInput(e.target.value)} />
          <Button disabled={loading} className="min-h-11"><Search size={18} />{loading ? 'Searching...' : 'Search'}</Button>
        </form>

        {searchedCity && <h1 className="text-3xl font-extrabold">Weather for {searchedCity}</h1>}
        {error && !weatherData && <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">{error}</div>}

        {weatherData && (
          <>
            {severe && <div className="rounded-lg bg-red-600 p-4 font-semibold text-white"><AlertTriangle className="mr-2 inline" size={18} />{severe}</div>}

            <section className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                <div>
                  <p className="text-sm font-semibold uppercase text-primary-600">{weatherData.location || [weatherData.city, weatherData.state].filter(Boolean).join(', ')}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <img alt={weatherData.condition} className="h-20 w-20" src={`https://openweathermap.org/img/wn/${weatherData.condition_icon}@2x.png`} />
                    <div>
                      <div className="text-[64px] font-black leading-none">{Math.round(weatherData.temperature)}°C</div>
                      <p className="mt-2 text-lg font-semibold">{weatherData.condition}</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-lg bg-primary-50 p-4 font-semibold text-primary-800 dark:bg-primary-900/30 dark:text-primary-100">{weatherData.farming_advice}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Metric icon={Thermometer} label="Feels like" value={`${weatherData.feels_like}°C`} />
                  <Metric icon={Droplets} label="Humidity" value={`${weatherData.humidity}%`} />
                  <Metric icon={Wind} label="Wind" value={`${weatherData.wind_speed} km/h`} />
                  <Metric icon={Gauge} label="Pressure" value={`${weatherData.pressure} hPa`} />
                  <Metric icon={Eye} label="Visibility" value={`${(weatherData.visibility / 1000).toFixed(1)} km`} />
                  <Metric icon={Sunrise} label="Sunrise" value={time(weatherData.sunrise)} />
                  <Metric icon={Sunset} label="Sunset" value={time(weatherData.sunset)} />
                </div>
              </div>
            </section>

            <section className="overflow-x-auto">
              <div className="flex min-w-max gap-3">
                {forecastData.map((day, index) => (
                  <div key={day.date} className={`w-40 rounded-lg p-4 text-center shadow-sm ${index === 0 ? 'bg-green-600 text-white' : 'bg-white dark:bg-slate-900'}`}>
                    <p className="font-bold">{day.day_name}</p>
                    <img alt="" className="mx-auto h-14 w-14" src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} />
                    <p className="font-semibold">{Math.round(day.high)} / {Math.round(day.low)}°C</p>
                    <p className="mt-1 text-sm"><CloudRain className="inline" size={15} /> {day.rain_chance}%</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
              <h2 className="text-xl font-bold">Next 12 Hours</h2>
              <div className="mt-4 h-80">
                <ResponsiveContainer>
                  <ComposedChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="temp" />
                    <YAxis yAxisId="rain" orientation="right" />
                    <Tooltip />
                    <Area yAxisId="temp" dataKey="temp" stroke="#16a34a" fill="#bbf7d0" />
                    <Bar yAxisId="rain" dataKey="rain_chance" fill="#38bdf8" opacity={0.45} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {recommendations.map(([label, text]) => <div key={label} className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900"><p className="font-bold">{label}</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{text}</p></div>)}
            </section>
          </>
        )}
      </div>
    </Layout>
  )
}

function Metric({ icon: Icon, label, value }) {
  return <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><Icon size={18} className="text-primary-600" /><p className="mt-2 text-xs text-slate-500">{label}</p><p className="font-bold">{value}</p></div>
}

function time(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}
