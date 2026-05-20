import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Button from '../components/ui/Button'
import FormInput from '../components/ui/FormInput'
import SelectInput from '../components/ui/SelectInput'
import { states } from '../utils/constants'

export default function RegisterPage() {
  const [form,setForm]=useState({name:'',email:'',password:'',password_confirmation:'',state:'Maharashtra',district:'',phone:'',role:'farmer',admin_code:'',terms:false})
  const [loading,setLoading]=useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const submit = async e => { e.preventDefault(); if(!form.terms) return; setLoading(true); try { const user = await register(form); navigate(user.role === 'admin' ? '/admin' : '/dashboard') } finally { setLoading(false) } }
  return <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950"><form onSubmit={submit} className="mx-auto my-8 max-w-3xl rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900"><h1 className="text-3xl font-extrabold">Create your account</h1><div className="mt-6 grid gap-4 md:grid-cols-2"><FormInput label="Full name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><FormInput label="Email" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><FormInput label="Password" type="password" required minLength={8} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><FormInput label="Confirm password" type="password" required value={form.password_confirmation} onChange={e=>setForm({...form,password_confirmation:e.target.value})}/><SelectInput label="State" options={states} value={form.state} onChange={e=>setForm({...form,state:e.target.value})}/><FormInput label="District" required value={form.district} onChange={e=>setForm({...form,district:e.target.value})}/><FormInput label="Phone number" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><SelectInput label="Role" options={['farmer','admin']} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}/>{form.role==='admin' && <FormInput label="Admin code" value={form.admin_code} onChange={e=>setForm({...form,admin_code:e.target.value})}/>}</div><label className="mt-5 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.terms} onChange={e=>setForm({...form,terms:e.target.checked})}/>I agree to the terms and farmer advisory disclaimer.</label><Button disabled={loading || !form.terms} className="mt-6 w-full">{loading?'Creating account...':'Register'}</Button><p className="mt-4 text-center text-sm">Already registered? <Link className="font-bold text-primary-700" to="/login">Login</Link></p></form></div>
}
