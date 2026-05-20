import { cn } from '../../utils/helpers'
export default function Button({ children, variant = 'primary', className = '', disabled, ...props }) {
  const variants = { primary: 'bg-primary-600 text-white hover:bg-primary-700', secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600', danger: 'bg-red-600 text-white hover:bg-red-700', ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800' }
  return <button disabled={disabled} className={cn('inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60', variants[variant], className)} {...props}>{children}</button>
}
