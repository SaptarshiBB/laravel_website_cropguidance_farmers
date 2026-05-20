import Layout from '../components/layout/Layout'
import FormInput from '../components/ui/FormInput'
import Button from '../components/ui/Button'
import useAuth from '../hooks/useAuth'
export default function ProfilePage() { const { user } = useAuth(); return <Layout><div className="max-w-3xl rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"><h1 className="text-2xl font-extrabold">Profile</h1><div className="mt-6 grid gap-4 md:grid-cols-2"><FormInput label="Name" value={user?.name || ''} readOnly/><FormInput label="Email" value={user?.email || ''} readOnly/><FormInput label="Role" value={user?.role || ''} readOnly/><FormInput label="State" value={user?.state || ''} readOnly/><FormInput label="District" value={user?.district || ''} readOnly/><FormInput label="Phone" value={user?.phone || ''} readOnly/></div><Button className="mt-6">Save Profile</Button></div></Layout> }
