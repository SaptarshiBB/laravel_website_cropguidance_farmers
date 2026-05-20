import { Link } from 'react-router-dom'
import { Leaf, Menu, Moon, Sun, User, X } from 'lucide-react'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import Button from '../ui/Button'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const links = [['Home','/'], ['Schemes','/schemes'], ['Crops','/crops'], ['Alerts','/pest-alerts']]
  return <header className="sticky top-0 z-40 border-b border-primary-500/20 bg-white/85 shadow-lg backdrop-blur dark:bg-slate-950/80"><nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"><Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-primary-700 dark:text-primary-300"><Leaf />CropGuidance</Link><div className="hidden items-center gap-6 md:flex">{links.map(([l,p]) => <Link key={p} to={p} className="text-sm font-semibold text-slate-700 hover:text-primary-600 dark:text-slate-200">{l}</Link>)}<button aria-label="Toggle theme" onClick={toggleTheme} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>{isAuthenticated ? <div className="flex items-center gap-2"><Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-200"><User size={16}/>{user?.name}</Link><Button variant="secondary" onClick={logout}>Logout</Button></div> : <div className="flex gap-2"><Link to="/login"><Button variant="secondary">Login</Button></Link><Link to="/register"><Button>Register</Button></Link></div>}</div><button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></nav>{open && <div className="border-t bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">{links.map(([l,p]) => <Link onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 font-semibold" key={p} to={p}>{l}</Link>)}<div className="mt-3 flex gap-2"><Button variant="secondary" onClick={toggleTheme}>{isDark ? 'Light' : 'Dark'}</Button>{isAuthenticated ? <Button onClick={logout}>Logout</Button> : <Link to="/login"><Button>Login</Button></Link>}</div></div>}</header>
}
