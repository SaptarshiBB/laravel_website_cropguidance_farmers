import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AlertTriangle, CalendarDays, CheckCircle2, ChevronDown, IndianRupee, Sprout } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'
import SkeletonCard from '../components/ui/SkeletonCard'
import { getRecommendation } from '../api/cropApi'
import { useAuthContext } from '../context/AuthContext'

const states = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','J&K','Ladakh','Delhi','Puducherry','Chandigarh']
const soils = ['Clay','Sandy','Loamy','Black (Regur)','Red','Laterite','Sandy-Loam','Clay-Loam','Alluvial','Saline/Alkaline']
const seasons = [{ label: 'Kharif (June-October)', value: 'kharif' }, { label: 'Rabi (November-April)', value: 'rabi' }, { label: 'Zaid (March-June)', value: 'zaid' }]

export default function CropRecommendationPage() {
  const { userState } = useAuthContext()
  const [formData, setFormData] = useState({ state: '', soil_type: '', season: 'kharif', temperature: 28, rainfall: 900, water_availability: 'medium', budget: 'medium' })
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    if (!userState) return undefined
    const timer = setTimeout(() => setFormData(current => ({ ...current, state: userState })), 0)
    return () => clearTimeout(timer)
  }, [userState])

  const update = (key, value) => setFormData(current => ({ ...current, [key]: value }))

  const submit = async event => {
    event.preventDefault()
    if (!formData.state || !formData.soil_type) {
      toast.error('State and soil type are required')
      return
    }

    setLoading(true)
    setHasSearched(true)
    try {
      const response = await getRecommendation(formData)
      setRecommendations(response.data || response.result?.recommendations || [])
      toast.success('Recommendations ready')
    } catch {
      setRecommendations([])
      toast.error('Could not load crop recommendations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
          <h1 className="text-2xl font-extrabold">Crop Recommendation</h1>
          <div className="mt-5 space-y-4">
            <Field label="State"><select className="field" value={formData.state} onChange={e => update('state', e.target.value)}><option value="">Select state</option>{states.map(state => <option key={state}>{state}</option>)}</select></Field>
            <Field label="Soil type"><select className="field" value={formData.soil_type} onChange={e => update('soil_type', e.target.value)}><option value="">Select soil</option>{soils.map(soil => <option key={soil}>{soil}</option>)}</select></Field>
            <Field label="Season"><select className="field" value={formData.season} onChange={e => update('season', e.target.value)}>{seasons.map(season => <option key={season.value} value={season.value}>{season.label}</option>)}</select></Field>
            <Range label="Temperature" suffix="C" min="10" max="48" value={formData.temperature} onChange={value => update('temperature', Number(value))} />
            <Range label="Rainfall" suffix="mm" min="0" max="3000" value={formData.rainfall} onChange={value => update('rainfall', Number(value))} />
            <Field label="Water availability"><select className="field" value={formData.water_availability} onChange={e => update('water_availability', e.target.value)}><option value="high">Irrigated (ample water)</option><option value="medium">Semi-irrigated (moderate)</option><option value="low">Rainfed (only rainfall)</option></select></Field>
            <Field label="Budget"><select className="field" value={formData.budget} onChange={e => update('budget', e.target.value)}><option value="low">Low (&lt; Rs 5000/acre)</option><option value="medium">Medium (Rs 5000-15000)</option><option value="high">High (&gt; Rs 15000)</option></select></Field>
            <Button disabled={loading} className="w-full">{loading ? 'Analyzing...' : 'Get Recommendations'}</Button>
          </div>
        </form>

        <div className="space-y-4">
          {loading && <div className="grid gap-4 md:grid-cols-2"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}
          {!loading && hasSearched && recommendations?.length === 0 && (
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
              <h2 className="text-xl font-bold">No crops found matching all your criteria.</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Try adjusting soil type or water availability.</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {['Try Loamy or Sandy-Loam soil if nearby fields match it.','Switch water availability to semi-irrigated.','Try the other active season for your sowing window.'].map(text => <div key={text} className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{text}</div>)}
              </div>
            </div>
          )}
          {!loading && recommendations?.map((item, index) => {
            const crop = item.crop
            const percent = item.suitability_percent
            const band = percent > 80 ? ['bg-green-600', 'Excellent Match'] : percent >= 60 ? ['bg-blue-600', 'Good Match'] : ['bg-yellow-500', 'Moderate Match']
            return (
              <article key={crop.id || crop.name} className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-primary-600">Rank {index + 1}</p>
                    <h2 className="text-2xl font-black">{crop.name} <span className="text-base font-semibold text-slate-500">({crop.local_names?.hindi || crop.name})</span></h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{crop.description}</p>
                  </div>
                  <div className="min-w-44">
                    <p className="text-sm font-bold">{band[1]} - {percent}%</p>
                    <div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-3 rounded-full ${band[0]}`} style={{ width: `${percent}%` }} /></div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <List title="Why suitable" icon={CheckCircle2} color="text-green-600" items={item.reasons} />
                  <List title="Warnings" icon={AlertTriangle} color="text-amber-600" items={item.warnings.length ? item.warnings : ['No major warnings for selected inputs']} />
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <Stat label="Season" value={crop.season} />
                  <Stat label="Duration" value={`${crop.duration_days} days`} />
                  <Stat label="Water" value={crop.water_requirement} />
                  <Stat label="Yield/Acre" value={`${item.yield_estimate.min}-${item.yield_estimate.max} ${item.yield_estimate.unit}`} />
                </div>

                <button type="button" onClick={() => setOpenId(openId === crop.id ? null : crop.id)} className="mt-5 flex w-full items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-left font-bold dark:bg-slate-800">
                  <span>Fertilizer Section</span><ChevronDown size={18} />
                </button>
                {openId === crop.id && <Fertilizer advice={item.fertilizer_advice} />}

                <div className="mt-5">
                  <h3 className="font-bold"><CalendarDays className="mr-2 inline" size={18} />Farming Calendar</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Chip label={`Sowing: ${item.farming_calendar.sowing.join(', ')}`} />
                    <Chip label={`Growing: ${item.farming_calendar.growing.join(', ')}`} />
                    <Chip label={`Harvesting: ${item.farming_calendar.harvesting.join(', ')}`} />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
      <style>{'.field{width:100%;border:1px solid rgb(226 232 240);border-radius:.5rem;padding:.625rem;background:white}.dark .field{background:#020617;border-color:#334155}'}</style>
    </Layout>
  )
}

function Field({ label, children }) {
  return <label className="block text-sm font-semibold">{label}<div className="mt-1">{children}</div></label>
}

function Range({ label, suffix, value, min, max, onChange }) {
  return <label className="block text-sm font-semibold">{label}: {value}{suffix}<input className="mt-2 w-full accent-green-600" type="range" min={min} max={max} value={value} onChange={e => onChange(e.target.value)} /></label>
}

function List({ title, icon: Icon, color, items }) {
  return <div><h3 className="font-bold">{title}</h3>{items.map(item => <p key={item} className="mt-2 text-sm"><Icon className={`mr-2 inline ${color}`} size={16} />{item}</p>)}</div>
}

function Stat({ label, value }) {
  return <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><p className="text-xs text-slate-500">{label}</p><p className="font-bold capitalize">{value}</p></div>
}

function Fertilizer({ advice }) {
  return <div className="mt-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
    <div className="grid gap-3 md:grid-cols-3">{['N','P','K'].map(key => <Stat key={key} label={`${key} kg/acre`} value={advice.npk?.[key] || 0} />)}</div>
    <div className="mt-4 grid gap-3 md:grid-cols-3">{Object.entries(advice.schedule || {}).map(([key, value]) => <div key={key} className="rounded-lg bg-green-50 p-3 text-sm text-green-900"><b>{key.replaceAll('_', ' ')}</b><p>{value}</p></div>)}</div>
    <p className="mt-4 text-sm"><Sprout className="mr-2 inline text-green-600" size={16} />{advice.organic}</p>
    <p className="mt-2 text-sm"><IndianRupee className="mr-2 inline text-primary-600" size={16} />{advice.soil_amendment}</p>
  </div>
}

function Chip({ label }) {
  return <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-800 dark:bg-primary-900/30 dark:text-primary-100">{label}</span>
}
