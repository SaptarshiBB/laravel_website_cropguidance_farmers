import Sidebar from './Sidebar'
import Navbar from './Navbar'
export default function Layout({ children }) { return <div className="min-h-screen bg-slate-50 dark:bg-slate-950"><Navbar/><div className="flex"><Sidebar/><main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">{children}</main></div></div> }
