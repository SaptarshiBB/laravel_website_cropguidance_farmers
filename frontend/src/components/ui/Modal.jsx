import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Button from './Button'
export default function Modal({ open, title, children, onClose, footer }) {
  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .95, opacity: 0 }} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><Button variant="ghost" onClick={onClose}><X size={18} /></Button></div>{children}{footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}</motion.div></motion.div>}</AnimatePresence>
}
