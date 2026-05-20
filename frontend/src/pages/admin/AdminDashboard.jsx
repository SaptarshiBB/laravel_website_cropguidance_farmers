import { useEffect, useState } from 'react'
import { Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Bell, Leaf, Users, FileText } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import StatCard from '../../components/cards/StatCard'
import ChartCard from '../../components/cards/ChartCard'
import DataTable from '../../components/ui/DataTable'
import { getAnalytics } from '../../api/adminApi'

export default function AdminDashboard() {
  const [data,setData]=useState(null)
  useEffect(()=>{getAnalytics().then(setData).catch(()=>setData({totals:{users:2,alerts:10,crops:20,schemes:8},registrations:[{month:'Jan',users:80},{month:'Feb',users:130},{month:'Mar',users:210}],searched_crops:[],alerts_by_severity:[{severity:'critical',count:2},{severity:'high',count:4}],recent_activity:[]}))},[])
  if(!data) return <Layout>Loading admin analytics...</Layout>
  return <Layout><div className="space-y-6"><h1 className="text-3xl font-extrabold">Admin Overview</h1><div className="grid gap-4 md:grid-cols-4"><StatCard icon={Users} label="Total Users" value={data.totals.users}/><StatCard icon={Bell} label="Active Alerts" value={data.totals.alerts}/><StatCard icon={Leaf} label="Crops in DB" value={data.totals.crops}/><StatCard icon={FileText} label="Schemes" value={data.totals.schemes}/></div><div className="grid gap-5 lg:grid-cols-2"><ChartCard title="User Growth"><ResponsiveContainer><LineChart data={data.registrations}><XAxis dataKey="month"/><YAxis/><Tooltip/><Line dataKey="users" stroke="#16a34a" strokeWidth={3}/></LineChart></ResponsiveContainer></ChartCard><ChartCard title="Alerts by Severity"><ResponsiveContainer><PieChart><Pie data={data.alerts_by_severity} dataKey="count" nameKey="severity" outerRadius={90}>{data.alerts_by_severity.map((_,i)=><Cell key={i} fill={['#dc2626','#ea580c','#ca8a04','#16a34a'][i%4]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></ChartCard></div><DataTable columns={[{key:'id',label:'ID'},{key:'soil_type',label:'Soil'},{key:'state',label:'State'}]} data={data.recent_activity || []}/></div></Layout>
}
