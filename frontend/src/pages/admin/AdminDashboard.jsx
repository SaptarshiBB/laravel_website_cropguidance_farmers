import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Activity, Bug, Leaf, ShieldCheck, Sprout, Users } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import useAuth from '../../hooks/useAuth'
import { demoteUser, getActivityLogs, getAdminStats, getAdminUsers, promoteUser } from '../../api/adminApi'

const formatDate = value => value ? new Date(value).toLocaleString() : 'Never'
const errorMessage = error => error.response?.data?.message || 'Something went wrong'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{value ?? 0}</p>
        </div>
        <div className="rounded-lg bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"><Icon size={24} /></div>
      </div>
    </div>
  )
}

function SkeletonBlock() {
  return <div className="animate-pulse"><div className="mb-2 h-4 w-3/4 rounded bg-gray-700"></div><div className="mb-2 h-4 w-1/2 rounded bg-gray-700"></div></div>
}

function RoleBadge({ role }) {
  const isAdmin = role === 'admin'
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${isAdmin ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{role}</span>
}

function ActionBadge({ action }) {
  const colors = { login: 'bg-emerald-100 text-emerald-700', logout: 'bg-red-100 text-red-700', register: 'bg-blue-100 text-blue-700' }
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[action] || 'bg-slate-100 text-slate-700'}`}>{action}</span>
}

export default function AdminDashboard() {
  const { user: currentUser } = useAuth()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState(null)
  const [page, setPage] = useState(1)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [logsLoading, setLogsLoading] = useState(true)

  const loadStats = () => getAdminStats().then(setStats)
  const loadUsers = () => getAdminUsers().then(setUsers)
  const loadLogs = selectedPage => getActivityLogs(selectedPage).then(setLogs)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([loadStats(), loadUsers()]).finally(() => setIsLoading(false))
  }, [])
  useEffect(() => {
    setLogsLoading(true)
    loadLogs(page).finally(() => setLogsLoading(false))
  }, [page])

  const refreshUsers = async () => {
    await Promise.all([loadStats(), loadUsers()])
  }

  const makeAdmin = async user => {
    try {
      await promoteUser({ user_id: user.id })
      toast.success('User promoted to admin successfully')
      await refreshUsers()
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  const makeFarmer = async user => {
    try {
      await demoteUser({ user_id: user.id })
      toast.success('User removed from admin successfully')
      await refreshUsers()
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  const promoteByEmail = async e => {
    e.preventDefault()
    setMessage(null)
    try {
      await promoteUser({ email })
      setEmail('')
      setMessage({ type: 'success', text: 'User promoted to admin successfully' })
      await refreshUsers()
    } catch (error) {
      setMessage({ type: 'error', text: errorMessage(error) })
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Manage users, roles, and the authentication logbook.</p>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {isLoading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900"><SkeletonBlock /></div>) : <>
            <StatCard icon={Users} label="Total Users" value={stats?.total_users} />
            <StatCard icon={Sprout} label="Total Farmers" value={stats?.total_farmers} />
            <StatCard icon={ShieldCheck} label="Total Admins" value={stats?.total_admins} />
            <StatCard icon={Leaf} label="Total Crops" value={stats?.total_crops} />
            <StatCard icon={Bug} label="Total Pest Alerts" value={stats?.total_pest_alerts} />
            <StatCard icon={Activity} label="Total Recommendations" value={stats?.total_recommendations} />
          </>}
        </section>

        <section className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
          <h2 className="text-xl font-bold">Recent Login Activity</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"><tr><th className="p-3">#</th><th>Name</th><th>Email</th><th>Login Time</th></tr></thead>
              <tbody>
                {isLoading ? Array.from({ length: 4 }).map((_, i) => <tr key={i} className="border-b dark:border-slate-800"><td className="p-3" colSpan="4"><SkeletonBlock /></td></tr>) : stats?.recent_logins?.length ? stats.recent_logins.map((log, i) => <tr key={`${log.email}-${i}`} className="border-b dark:border-slate-800"><td className="p-3">{i + 1}</td><td>{log.name}</td><td>{log.email}</td><td>{formatDate(log.created_at)}</td></tr>) : <tr><td className="p-4 text-center text-slate-500" colSpan="4">No recent logins</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
          <h2 className="text-xl font-bold">All Users + Promote/Remove Admin</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"><tr><th className="p-3">Name</th><th>Email</th><th>State</th><th>Role</th><th>Joined</th><th>Last Login</th><th>Actions</th></tr></thead>
              <tbody>
                {isLoading ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b dark:border-slate-800"><td className="p-3" colSpan="7"><SkeletonBlock /></td></tr>) : users.map(item => <tr key={item.id} className="border-b dark:border-slate-800"><td className="p-3 font-semibold">{item.name}</td><td>{item.email}</td><td>{item.state || '-'}</td><td><RoleBadge role={item.role} /></td><td>{formatDate(item.created_at)}</td><td>{formatDate(item.last_login)}</td><td>{item.role === 'admin' ? <button disabled={currentUser?.id === item.id} onClick={() => makeFarmer(item)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Remove Admin</button> : <button onClick={() => makeAdmin(item)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">Make Admin</button>}</td></tr>)}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
          <h2 className="text-xl font-bold">Promote by Email</h2>
          <form onSubmit={promoteByEmail} className="mt-4 flex flex-col gap-3 md:flex-row">
            <input className="min-h-11 flex-1 rounded-lg border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-950" placeholder="Enter user email to promote" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <button className="rounded-lg bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700">Promote to Admin</button>
          </form>
          {message && <p className={`mt-3 text-sm font-semibold ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>{message.text}</p>}
        </section>

        <section className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
          <h2 className="text-xl font-bold">Full Activity Logbook</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"><tr><th className="p-3">#</th><th>Name</th><th>Email</th><th>Action</th><th>IP Address</th><th>Date & Time</th></tr></thead>
              <tbody>
                {logsLoading ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b dark:border-slate-800"><td className="p-3" colSpan="6"><SkeletonBlock /></td></tr>) : logs?.data?.map((log, i) => <tr key={log.id} className="border-b dark:border-slate-800"><td className="p-3">{((logs.current_page - 1) * logs.per_page) + i + 1}</td><td>{log.user?.name || '-'}</td><td>{log.user?.email || '-'}</td><td><ActionBadge action={log.action} /></td><td>{log.ip_address || '-'}</td><td>{formatDate(log.created_at)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            <button disabled={!logs?.prev_page_url} onClick={() => setPage(page - 1)} className="rounded-lg border px-4 py-2 text-sm font-bold disabled:opacity-40 dark:border-slate-700">Previous</button>
            <span className="text-sm font-bold">Page {logs?.current_page || page}</span>
            <button disabled={!logs?.next_page_url} onClick={() => setPage(page + 1)} className="rounded-lg border px-4 py-2 text-sm font-bold disabled:opacity-40 dark:border-slate-700">Next</button>
          </div>
        </section>
      </div>
    </Layout>
  )
}
