import { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import FormInput from '../components/ui/FormInput'
import SelectInput from '../components/ui/SelectInput'
import Modal from '../components/ui/Modal'
import SchemeCard from '../components/cards/SchemeCard'
import Button from '../components/ui/Button'
import { getSchemes } from '../api/schemeApi'
import { fallbackSchemes } from '../utils/constants'

export default function SchemesPage() {
  const [schemes,setSchemes]=useState([]), [search,setSearch]=useState(''), [category,setCategory]=useState('All'), [selected,setSelected]=useState(null)
  useEffect(()=>{getSchemes().then(setSchemes).catch(()=>setSchemes(fallbackSchemes))},[])
  const filtered=schemes.filter(s=>s.name.toLowerCase().includes(search.toLowerCase()) || s.ministry.toLowerCase().includes(search.toLowerCase()))
  return <Layout><div className="space-y-6"><h1 className="text-3xl font-extrabold">Government Schemes</h1><div className="grid gap-3 md:grid-cols-2"><FormInput label="Search scheme" value={search} onChange={e=>setSearch(e.target.value)}/><SelectInput label="Category" options={['All','Insurance','Subsidy','Loan','Irrigation','Market']} value={category} onChange={e=>setCategory(e.target.value)}/></div><div className="rounded-2xl bg-gradient-to-r from-primary-600 to-emerald-700 p-6 text-white"><h2 className="text-2xl font-extrabold">Featured: PM-KISAN</h2><p className="mt-2">Check payment status, complete eKYC, and keep land records linked through the official portal.</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-white/20 px-3 py-1">Register</span><span className="rounded-full bg-white/20 px-3 py-1">Verify Aadhaar</span><span className="rounded-full bg-white/20 px-3 py-1">Check beneficiary status</span></div></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map(s=><SchemeCard key={s.id} scheme={s} onMore={setSelected}/>)}</div><Modal open={!!selected} title={selected?.name} onClose={()=>setSelected(null)} footer={selected && <a href={selected.apply_url} target="_blank" rel="noreferrer"><Button>Official Website</Button></a>}><p className="text-slate-600 dark:text-slate-300">{selected?.description}</p><h3 className="mt-4 font-bold">Eligibility</h3><p>{selected?.eligibility}</p><h3 className="mt-4 font-bold">Required Documents</h3><p>Aadhaar, bank account, land records, mobile number, and crop details where applicable.</p><h3 className="mt-4 font-bold">Application Process</h3><p>Visit official portal, complete registration, upload documents, verify details, and track approval status.</p></Modal></div></Layout>
}
