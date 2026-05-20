import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Layout from '../components/layout/Layout'
import SelectInput from '../components/ui/SelectInput'
import FormInput from '../components/ui/FormInput'
import PestCard from '../components/cards/PestCard'
import ChartCard from '../components/cards/ChartCard'
import { getAlerts } from '../api/pestApi'
import { fallbackAlerts, states } from '../utils/constants'

export default function PestAlertPage() {
  const [alerts,setAlerts]=useState([]), [state,setState]=useState('All'), [level,setLevel]=useState('All'), [q,setQ]=useState('')
  useEffect(()=>{ getAlerts().then(setAlerts).catch(()=>setAlerts(fallbackAlerts)) },[])
  const filtered=useMemo(()=>alerts.filter(a=>(state==='All'||a.affected_states?.includes(state))&&(level==='All'||a.severity===level.toLowerCase())&&(a.pest_name+a.crop?.name).toLowerCase().includes(q.toLowerCase())),[alerts,state,level,q])
  const radar=[{cat:'Sucking',value:80},{cat:'Borers',value:65},{cat:'Fungal',value:52},{cat:'Locust',value:40},{cat:'Mites',value:48}]
  const bars=states.slice(0,6).map((s,i)=>({state:s,alerts:i+2}))
  return <Layout><div className="space-y-6"><h1 className="text-3xl font-extrabold">Pest Alerts</h1><div className="grid gap-3 md:grid-cols-3"><SelectInput label="State" options={['All',...states]} value={state} onChange={e=>setState(e.target.value)}/><FormInput label="Search" value={q} onChange={e=>setQ(e.target.value)}/><SelectInput label="Alert level" options={['All','Critical','High','Medium','Low']} value={level} onChange={e=>setLevel(e.target.value)}/></div><div className="grid gap-4 xl:grid-cols-2">{filtered.map(a=><PestCard key={a.id} alert={a}/>)}</div><div className="grid gap-5 lg:grid-cols-2"><ChartCard title="Pest Activity"><ResponsiveContainer><RadarChart data={radar}><PolarGrid/><PolarAngleAxis dataKey="cat"/><Radar dataKey="value" fill="#16a34a" fillOpacity={0.5}/><Tooltip/></RadarChart></ResponsiveContainer></ChartCard><ChartCard title="Alerts Per State"><ResponsiveContainer><BarChart data={bars}><XAxis dataKey="state"/><YAxis/><Tooltip/><Bar dataKey="alerts" fill="#ea580c"/></BarChart></ResponsiveContainer></ChartCard></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-white p-5 dark:bg-slate-900"><h2 className="font-bold">Prevention Guide</h2><p className="mt-2">Organic: neem, pheromone traps, bio-control, field sanitation.</p><p className="mt-2">Chemical: rotate mode of action and spray only at threshold.</p><p className="mt-2">IPM: combine monitoring, resistant seed, trap crops, and weather timing.</p></div><div className="rounded-2xl bg-primary-50 p-5 dark:bg-primary-900/30"><h2 className="font-bold">Emergency Contacts</h2><p className="mt-2">State agriculture helpline: 1800-180-1551</p><p className="mt-2">KVK contact: reach nearest district KVK for field diagnosis.</p></div></div></div></Layout>
}
