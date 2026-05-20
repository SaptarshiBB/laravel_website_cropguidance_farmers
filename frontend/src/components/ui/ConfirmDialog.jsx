import Modal from './Modal'
import Button from './Button'
export default function ConfirmDialog({ open, title = 'Confirm action', message, onConfirm, onClose }) {
  return <Modal open={open} title={title} onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="danger" onClick={onConfirm}>Delete</Button></>}><p className="text-slate-600 dark:text-slate-300">{message}</p></Modal>
}
