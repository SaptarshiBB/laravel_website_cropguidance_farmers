import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Layout from '../../components/layout/Layout'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { deleteUser, getUsers, updateUser } from '../../api/adminApi'

export default function AdminUsers() {
  const [users,setUsers]=useState([]), [q,setQ]=useState(''), [del,setDel]=useState(null)
  useEffect(()=>{getUsers().then(setUsers).catch(()=>setUsers([]))},[])
  const data=useMemo(()=>users.filter(u=>(u.name+u.email+u.role+u.state).toLowerCase().includes(q.toLowerCase())),[users,q])
  const remove=async()=>{await deleteUser(del.id);setUsers(users.filter(u=>u.id!==del.id));setDel(null);toast.success('User deleted')}
  const toggle=async u=>{const next=u.role==='admin'?'farmer':'admin';const updated=await updateUser(u.id,{role:next});setUsers(users.map(x=>x.id===u.id?updated:x));toast.success('Role updated')}
  return <Layout><div className="space-y-4"><h1 className="text-3xl font-extrabold">Users</h1><input className="w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-900" placeholder="Filter users" value={q} onChange={e=>setQ(e.target.value)}/><DataTable columns={[{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'role',label:'Role'},{key:'state',label:'State'},{key:'created_at',label:'Joined'}]} data={data} actions={u=><div className="flex justify-end gap-2"><Button variant="secondary" onClick={()=>toggle(u)}>Edit Role</Button><Button variant="danger" onClick={()=>setDel(u)}>Delete</Button></div>}/><ConfirmDialog open={!!del} message={`Delete ${del?.name}?`} onClose={()=>setDel(null)} onConfirm={remove}/></div></Layout>
}
