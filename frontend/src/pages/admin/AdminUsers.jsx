import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import useAuth from '../../hooks/useAuth'
import { demoteUser, getAdminUsers, promoteUser } from '../../api/adminApi'

const formatDate = value => value ? new Date(value).toLocaleString() : 'Never'
const errorMessage = error => error.response?.data?.message || 'Something went wrong'

function RoleBadge({ role }) {
  const isAdmin = role === 'admin'
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${isAdmin ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{role}</span>
}

function SkeletonBlock() {
  return <div className="animate-pulse"><div className="mb-2 h-4 w-3/4 rounded bg-gray-700"></div><div className="mb-2 h-4 w-1/2 rounded bg-gray-700"></div></div>
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUsers = () => {
    setIsLoading(true)
    return getAdminUsers().then(setUsers).catch(() => setUsers([])).finally(() => setIsLoading(false))
  }

  useEffect(() => { loadUsers() }, [])
  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedQ(q) }, 300)
    return () => clearTimeout(timer)
  }, [q])

  const filteredUsers = useMemo(() => {
    const term = debouncedQ.toLowerCase()
    return users.filter(user => `${user.name} ${user.email}`.toLowerCase().includes(term))
  }, [users, debouncedQ])

  const makeAdmin = async user => {
    try {
      await promoteUser({ user_id: user.id })
      toast.success('User promoted to admin successfully')
      await loadUsers()
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  const makeFarmer = async user => {
    try {
      await demoteUser({ user_id: user.id })
      toast.success('User removed from admin successfully')
      await loadUsers()
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
      await loadUsers()
    } catch (error) {
      setMessage({ type: 'error', text: errorMessage(error) })
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Users Management</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Search farmers, promote trusted accounts, and remove admin access when needed.</p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Search size={18} className="text-emerald-600" />
          <input className="min-h-10 flex-1 bg-transparent outline-none" placeholder="Search users by name or email" value={q} onChange={e => setQ(e.target.value)} />
        </div>

        <section className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
          <h2 className="text-xl font-bold">All Users + Promote/Remove Admin</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"><tr><th className="p-3">Name</th><th>Email</th><th>State</th><th>Role</th><th>Joined</th><th>Last Login</th><th>Actions</th></tr></thead>
              <tbody>
                {isLoading ? Array.from({ length: 6 }).map((_, i) => <tr key={i} className="border-b dark:border-slate-800"><td className="p-3" colSpan="7"><SkeletonBlock /></td></tr>) : filteredUsers.map(item => (
                  <tr key={item.id} className="border-b dark:border-slate-800">
                    <td className="p-3 font-semibold">{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.state || '-'}</td>
                    <td><RoleBadge role={item.role} /></td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>{formatDate(item.last_login)}</td>
                    <td>{item.role === 'admin' ? <button disabled={currentUser?.id === item.id} onClick={() => makeFarmer(item)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Remove Admin</button> : <button onClick={() => makeAdmin(item)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">Make Admin</button>}</td>
                  </tr>
                ))}
                {!isLoading && !filteredUsers.length && <tr><td className="p-4 text-center text-slate-500" colSpan="7">No users found</td></tr>}
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
      </div>
    </Layout>
  )
}
