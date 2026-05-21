import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Leaf } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import Button from '../components/ui/Button'
import FormInput from '../components/ui/FormInput'

export default function LoginPage() {
  const [form,setForm]=useState({email:'',password:'',remember:true})
  const [show,setShow]=useState(false)
  const [loading,setLoading]=useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const submit = async e => { e.preventDefault(); setLoading(true); try { const user = await login(form); navigate(user.role === 'admin' ? '/admin' : '/dashboard') } finally { setLoading(false) } }
  return <div className="grid min-h-screen place-items-center bg-primary-50 p-4 dark:bg-slate-950"><div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-900 md:grid-cols-2"><div className="hidden bg-gradient-to-br from-primary-600 to-emerald-700 p-10 text-white md:block"><Leaf size={52}/><h1 className="mt-8 text-4xl font-extrabold">Welcome back to smarter farming</h1><p className="mt-4 text-green-50">Farmers can register directly. Admin access is granted only by an existing admin.</p></div><form onSubmit={submit} className="p-8"><h2 className="text-3xl font-extrabold">Login</h2><div className="mt-6 space-y-4"><FormInput label="Email" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><div className="relative"><FormInput label="Password" type={show?'text':'password'} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-8 text-slate-500">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div><div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={form.remember} onChange={e=>setForm({...form,remember:e.target.checked})}/>Remember me</label><a className="text-primary-700">Forgot password?</a></div><Button disabled={loading} className="w-full">{loading?'Signing in...':'Login'}</Button><p className="text-center text-sm">Don't have an account? <Link className="font-bold text-primary-700" to="/register">Register</Link></p></div></form></div></div>
}
