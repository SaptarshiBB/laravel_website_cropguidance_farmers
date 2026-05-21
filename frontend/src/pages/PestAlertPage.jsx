import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { AlertTriangle, FilterX, X } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { getAlerts, reportPestSighting } from '../api/pestApi'
import { useAuthContext } from '../context/AuthContext'

const states = ['All India','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','J&K','Ladakh','Delhi','Puducherry','Chandigarh']
const severities = ['all','critical','high','medium','low']
const seasons = ['all','kharif','rabi','zaid','year-round']

export default function PestAlertPage() {
  const { userState } = useAuthContext()
  const [alerts, setAlerts] = useState([])
  const [filters, setFilters] = useState({ state: 'All India', severity: 'all', crop: '', season: 'all', search: '' })
  const [loading, setLoading] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [tab, setTab] = useState({})

  useEffect(() => {
    if (!userState) return undefined
    const timer = setTimeout(() => setFilters(current => ({ ...current, state: userState })), 0)
    return () => clearTimeout(timer)
  }, [userState])

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        state: filters.state === 'All India' ? 'all' : filters.state,
        severity: filters.severity,
        season: filters.season,
        crop: filters.crop || undefined,
      }
      const response = await getAlerts(params)
      setAlerts(response.data || response || [])
    } catch {
      setAlerts([])
      toast.error('Could not load pest alerts')
    } finally {
      setLoading(false)
    }
  }, [filters.crop, filters.season, filters.severity, filters.state])

  useEffect(() => {
    const timer = setTimeout(fetchAlerts, 0)
    return () => clearTimeout(timer)
  }, [fetchAlerts])

  const visibleAlerts = useMemo(() => {
    const search = filters.search.toLowerCase()
    return alerts.filter(alert => !search || `${alert.pest_name} ${alert.common_name} ${(alert.affected_crops || []).join(' ')}`.toLowerCase().includes(search))
  }, [alerts, filters.search])

  const counts = useMemo(() => severities.slice(1).reduce((acc, severity) => ({ ...acc, [severity]: visibleAlerts.filter(alert => alert.severity === severity).length }), {}), [visibleAlerts])
  const criticalForState = visibleAlerts.find(alert => alert.severity === 'critical' && userState && alert.affected_states?.includes(userState))
  const mostCritical = visibleAlerts[0]

  const update = (key, value) => setFilters(current => ({ ...current, [key]: value }))
  const clear = key => update(key, key === 'state' ? 'All India' : key === 'severity' || key === 'season' ? 'all' : '')

  const report = async alert => {
    try {
      await reportPestSighting({ pest_name: alert.pest_name, state: filters.state, crop: alert.affected_crops?.[0] || '', notes: 'Reported from pest alert detail modal' })
      toast.success('Sighting report submitted')
    } catch {
      toast.error('Could not submit sighting report')
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {criticalForState && <div className="animate-pulse rounded-lg bg-red-600 p-4 font-bold text-white"><AlertTriangle className="mr-2 inline" size={18} />CRITICAL ALERT: {criticalForState.pest_name} outbreak reported in {userState}</div>}

        <div>
          <h1 className="text-3xl font-extrabold">Pest Alerts</h1>
          {!userState && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Select your state to see local alerts first.</p>}
        </div>

        <section className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
          <div className="grid gap-3 lg:grid-cols-5">
            <Select label="State" value={filters.state} onChange={value => update('state', value)} options={states} />
            <Select label="Severity" value={filters.severity} onChange={value => update('severity', value)} options={severities} />
            <Select label="Season" value={filters.season} onChange={value => update('season', value)} options={seasons} />
            <label className="block text-sm font-semibold">Crop<input className="field mt-1" placeholder="Rice, Wheat, Cotton..." value={filters.crop} onChange={e => update('crop', e.target.value)} /></label>
            <label className="block text-sm font-semibold">Search<input className="field mt-1" placeholder="Pest or crop" value={filters.search} onChange={e => update('search', e.target.value)} /></label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(filters).filter(([, value]) => value && value !== 'all' && value !== 'All India').map(([key, value]) => <button key={key} onClick={() => clear(key)} className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-800"><X size={14} />{key}: {value}</button>)}
          </div>
        </section>

        <section className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
          <p className="font-bold">{loading ? 'Loading...' : `Showing ${visibleAlerts.length} alerts`}</p>
          <Badge color="bg-red-600" label={`${counts.critical || 0} Critical`} />
          <Badge color="bg-orange-500" label={`${counts.high || 0} High`} />
          <Badge color="bg-yellow-500" label={`${counts.medium || 0} Medium`} />
          <Badge color="bg-green-600" label={`${counts.low || 0} Low`} />
        </section>

        {!loading && visibleAlerts.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-slate-900">
            <FilterX className="mx-auto text-green-600" size={36} />
            <h2 className="mt-3 text-xl font-bold">No active pest alerts for your filters.</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">This could mean your area is currently pest-free, or try selecting All India to see all active alerts.</p>
          </div>
        )}

        <section className="grid gap-4 xl:grid-cols-2">
          {visibleAlerts.map(alert => {
            const activeTab = tab[alert.id] || 'organic'
            return (
              <article key={alert.id} className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black">{alert.pest_name}</h2>
                    <p className="text-sm text-slate-500">{alert.common_name}</p>
                  </div>
                  <Severity severity={alert.severity} />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_110px]">
                  <div className="space-y-3">
                    <ChipList items={alert.affected_crops} color="bg-green-50 text-green-800" />
                    <ChipList items={alert.affected_states} color="bg-sky-50 text-sky-800" max={5} />
                    <p className="text-xs text-slate-500">Reported {formatDate(alert.reported_date)} - {alert.source}</p>
                  </div>
                  <RiskMeter score={alert.risk_score} />
                </div>
                <div className="mt-4">
                  <h3 className="font-bold">Symptoms</h3>
                  {(expanded[alert.id] ? alert.symptoms : alert.symptoms?.slice(0, 2) || []).map(symptom => <p key={symptom} className="mt-1 text-sm">- {symptom}</p>)}
                  {alert.symptoms?.length > 2 && <button className="mt-2 text-sm font-bold text-primary-700" onClick={() => setExpanded(current => ({ ...current, [alert.id]: !current[alert.id] }))}>{expanded[alert.id] ? 'Show less' : 'Show more'}</button>}
                </div>
                <div className="mt-4">
                  <div className="flex gap-2">
                    {['organic','chemical'].map(name => <button key={name} onClick={() => setTab(current => ({ ...current, [alert.id]: name }))} className={`rounded-lg px-3 py-1 text-sm font-bold ${activeTab === name ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{name}</button>)}
                  </div>
                  <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
                    {activeTab === 'organic' ? alert.prevention_organic?.map(item => <p key={item}>- {item}</p>) : <p>{alert.prevention_chemical?.chemical_name}: {alert.prevention_chemical?.dose}, {alert.prevention_chemical?.frequency}</p>}
                  </div>
                </div>
                {alert.severity === 'critical' && <details className="mt-4 rounded-lg bg-red-50 p-3 text-red-900"><summary className="cursor-pointer font-bold">Emergency action</summary><p className="mt-2 text-sm">{alert.emergency_action}</p></details>}
                <Button className="mt-4" onClick={() => setSelectedAlert(alert)}>Full Details</Button>
              </article>
            )
          })}
        </section>

        {mostCritical && filters.state !== 'All India' && (
          <section className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
            <h2 className="text-xl font-bold">Alerts for {filters.state}</h2>
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-950">
              <p className="font-black">{mostCritical.pest_name} - {mostCritical.risk_score}% risk</p>
              <p className="mt-2 text-sm">{mostCritical.emergency_action}</p>
              <p className="mt-2 text-sm"><b>Organic:</b> {mostCritical.prevention_organic?.join(', ')}</p>
              <p className="mt-2 text-sm"><b>Chemical:</b> {mostCritical.prevention_chemical?.chemical_name} @ {mostCritical.prevention_chemical?.dose}</p>
            </div>
          </section>
        )}

        <Modal open={Boolean(selectedAlert)} title={selectedAlert?.pest_name || ''} onClose={() => setSelectedAlert(null)} footer={selectedAlert && <Button onClick={() => report(selectedAlert)}>Report Sighting in My Area</Button>}>
          {selectedAlert && <div className="space-y-4 text-sm">
            <p><b>Common name:</b> {selectedAlert.common_name}</p>
            <p><b>Affected crops:</b> {selectedAlert.affected_crops?.join(', ')}</p>
            <p><b>Affected states:</b> {selectedAlert.affected_states?.join(', ')}</p>
            <p><b>Symptoms:</b> {selectedAlert.symptoms?.join(', ')}</p>
            <p><b>Organic prevention:</b> {selectedAlert.prevention_organic?.join(', ')}</p>
            <p><b>Chemical prevention:</b> {selectedAlert.prevention_chemical?.chemical_name} @ {selectedAlert.prevention_chemical?.dose}, {selectedAlert.prevention_chemical?.frequency}</p>
            <p><b>IPM approach:</b> combine monitoring, resistant varieties where available, field sanitation, traps, biological controls, and threshold-based chemical sprays.</p>
            <p><b>Nearby KVK:</b> Contact your district Krishi Vigyan Kendra or state agriculture helpline for field diagnosis.</p>
          </div>}
        </Modal>
      </div>
      <style>{'.field{width:100%;border:1px solid rgb(226 232 240);border-radius:.5rem;padding:.625rem;background:white}.dark .field{background:#020617;border-color:#334155}'}</style>
    </Layout>
  )
}

function Select({ label, value, onChange, options }) {
  return <label className="block text-sm font-semibold">{label}<select className="field mt-1 capitalize" value={value} onChange={e => onChange(e.target.value)}>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>
}

function Badge({ color, label }) {
  return <span className={`rounded-full px-3 py-1 text-sm font-bold text-white ${color}`}>{label}</span>
}

function Severity({ severity }) {
  const colors = { critical: 'bg-red-600', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-600' }
  return <span className={`rounded-full px-3 py-1 text-xs font-black uppercase text-white ${colors[severity]}`}>{severity}</span>
}

function ChipList({ items = [], color, max = 999 }) {
  const shown = items.slice(0, max)
  return <div className="flex flex-wrap gap-2">{shown.map(item => <span key={item} className={`rounded-full px-2 py-1 text-xs font-bold ${color}`}>{item}</span>)}{items.length > max && <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">+{items.length - max} more</span>}</div>
}

function RiskMeter({ score }) {
  const dash = `${score}, 100`
  return <div className="grid place-items-center"><svg viewBox="0 0 36 36" className="h-24 w-24"><path d="M18 2a16 16 0 1 1 0 32a16 16 0 0 1 0-32" fill="none" stroke="#e2e8f0" strokeWidth="4" /><path d="M18 2a16 16 0 1 1 0 32a16 16 0 0 1 0-32" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray={dash} strokeLinecap="round" /><text x="18" y="21" textAnchor="middle" className="fill-current text-[8px] font-bold">{score}</text></svg></div>
}

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'recently'
}
