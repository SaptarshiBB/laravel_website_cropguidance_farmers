import { NavLink } from 'react-router-dom'
import { Bot, Bug, ChevronLeft, ChevronRight, Cloud, FileText, Home, Leaf, Shield, Sprout, User } from 'lucide-react'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, isAdmin } = useAuth()
  const items = [['Dashboard','/dashboard',Home], ['Weather','/weather',Cloud], ['Crops','/crops',Sprout], ['Pest Alerts','/pest-alerts',Bug], ['Schemes','/schemes',FileText], ['Chatbot','/chatbot',Bot], ['Profile','/profile',User]]
  if (isAdmin) items.push(['Admin Panel','/admin',Shield])
  return <aside className={`${collapsed ? 'w-20' : 'w-72'} hidden shrink-0 border-r border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-950 lg:block`}><div className="flex h-screen flex-col p-4 sticky top-0"><div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-2 font-extrabold text-primary-700 dark:text-primary-300"><Leaf />{!collapsed && 'CropGuidance'}</div><button onClick={() => setCollapsed(!collapsed)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">{collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}</button></div><div className="mb-6 rounded-2xl bg-primary-50 p-3 dark:bg-primary-900/30"><div className="font-bold text-slate-800 dark:text-white">{collapsed ? user?.name?.[0] : user?.name}</div>{!collapsed && <div className="text-xs text-slate-500 dark:text-slate-300">{user?.state || 'India'} farmer</div>}</div><div className="space-y-1">{items.map(([label,path,Icon]) => <NavLink key={path} to={path} className={({isActive}) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-primary-600 text-white' : 'text-slate-700 hover:bg-primary-50 dark:text-slate-200 dark:hover:bg-slate-800'}`}><Icon size={18}/>{!collapsed && label}</NavLink>)}</div></div></aside>
}
