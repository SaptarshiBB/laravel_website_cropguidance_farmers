export default function FormInput({ label, error, className = '', ...props }) {
  return <label className="block"><span className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span><input className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white ${className}`} {...props} />{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>
}
