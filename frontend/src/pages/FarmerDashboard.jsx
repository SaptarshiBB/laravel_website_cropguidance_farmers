import { useEffect, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CloudRain, Droplets, Thermometer, Wind } from 'lucide-react'
import Layout from '../components/layout/Layout'
import StatCard from '../components/cards/StatCard'
import ChartCard from '../components/cards/ChartCard'
import PestCard from '../components/cards/PestCard'
import SchemeCard from '../components/cards/SchemeCard'
import SkeletonCard from '../components/ui/SkeletonCard'
import { getSummary } from '../api/dashboardApi'
import { getWeatherByCity } from '../api/weatherApi'
import { getAlerts } from '../api/pestApi'
import { getRecommendation } from '../api/cropApi'
import { useAuthContext } from '../context/AuthContext'
import { fallbackSchemes } from '../utils/constants'

export default function FarmerDashboard() {
  const { userState, userDistrict } = useAuthContext()
  const [data, setData] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [summary, weatherResponse, alertsResponse, cropsResponse] = await Promise.all([
          getSummary().catch(() => ({ schemes: fallbackSchemes, tips: [] })),
          getWeatherByCity(userDistrict || 'Delhi', userState || ''),
          getAlerts({ state: userState || 'all' }),
          getRecommendation({ state: userState || 'Punjab', soil_type: 'Loamy', season: 'kharif', temperature: 28, rainfall: 800, water_availability: 'medium', budget: 'medium' }).catch(() => ({ data: [] })),
        ])

        const weather = weatherResponse.data.data
        const alerts = alertsResponse.data || []
        const recommendations = cropsResponse.data || cropsResponse.result?.recommendations || []
        setData({
          weather,
          weekly_rainfall: (weather.forecast || []).slice(0, 7).map(day => ({ day: day.day_name, rainfall: day.rain_chance })),
          temperature_trend: (weather.forecast || []).slice(0, 7).map(day => ({ day: day.day_name, temperature: day.high })),
          yield_prediction: recommendations.map(item => ({ month: item.crop?.name, yield: item.suitability_percent })),
          alerts,
          recommended_crops: recommendations,
          schemes: summary.schemes || fallbackSchemes,
          tips: [weather.farming_advice, 'Scout fields weekly for pests after weather changes.', 'Use soil-test based fertilizer doses.'],
          irrigation: weather.farming_advice,
        })
      } catch {
        setData(null)
      }
    }
    load()
  }, [userState, userDistrict])

  if (!data) return <Layout><div className="grid gap-4 md:grid-cols-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div></Layout>
  const w = data.weather
  const location = w.location || [w.city, w.state].filter(Boolean).join(', ')

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold">Farmer Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={Thermometer} label={`${location} Temperature`} value={`${w.temperature}°C`} />
          <StatCard icon={Droplets} label="Humidity" value={`${w.humidity}%`} />
          <StatCard icon={Wind} label="Wind Speed" value={`${w.wind_speed} km/h`} />
          <StatCard icon={CloudRain} label="Rain Chance" value={`${data.weekly_rainfall[0]?.rainfall || 0}%`} />
        </div>
        {data.alerts?.some(alert => alert.severity === 'critical') && <div className="animate-pulse rounded-lg bg-red-600 p-4 font-bold text-white">Critical pest alert active for {userState || 'selected regions'}. Review emergency actions.</div>}
        <div className="grid gap-5 xl:grid-cols-3">
          <ChartCard title="Weekly Rain Risk"><ResponsiveContainer><BarChart data={data.weekly_rainfall}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="rainfall" fill="#16a34a" /></BarChart></ResponsiveContainer></ChartCard>
          <ChartCard title="Temperature Trend"><ResponsiveContainer><LineChart data={data.temperature_trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line dataKey="temperature" stroke="#0284c7" strokeWidth={3} /></LineChart></ResponsiveContainer></ChartCard>
          <ChartCard title="Crop Suitability"><ResponsiveContainer><AreaChart data={data.yield_prediction}><XAxis dataKey="month" /><YAxis /><Tooltip /><Area dataKey="yield" stroke="#ca8a04" fill="#fde68a" /></AreaChart></ResponsiveContainer></ChartCard>
        </div>
        <section><h2 className="mb-4 text-xl font-bold">Active Alerts for {userState || 'All India'}</h2><div className="grid gap-4 lg:grid-cols-2">{data.alerts.slice(0, 4).map(alert => <PestCard key={alert.id} alert={alert} />)}</div></section>
        <section><h2 className="mb-4 text-xl font-bold">Quick Recommendations</h2><div className="grid gap-4 md:grid-cols-3">{data.recommended_crops.slice(0, 3).map(item => <div key={item.crop.id} className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900"><p className="text-lg font-black">{item.crop.name}</p><p className="mt-2 text-sm">{item.suitability_percent}% suitable for {userState}</p></div>)}</div></section>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg bg-primary-50 p-5 dark:bg-primary-900/30"><h2 className="font-bold">Irrigation Guidance</h2><p className="mt-2">{data.irrigation}</p></div>
          <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900"><h2 className="font-bold">Daily Farming Tips</h2>{data.tips.map(tip => <p key={tip} className="mt-2 text-sm">- {tip}</p>)}</div>
        </div>
        <section><h2 className="mb-4 text-xl font-bold">Schemes Highlight</h2><div className="grid gap-4 md:grid-cols-2">{data.schemes.map(scheme => <SchemeCard key={scheme.id} scheme={scheme} />)}</div></section>
      </div>
    </Layout>
  )
}
