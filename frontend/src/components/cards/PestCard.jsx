import { useState } from 'react'
import AlertBadge from '../ui/AlertBadge'
import RiskMeter from '../ui/RiskMeter'
import Button from '../ui/Button'

export default function PestCard({ alert }) {
  const [open, setOpen] = useState(false)
  const symptoms = Array.isArray(alert.symptoms) ? alert.symptoms : [alert.symptoms].filter(Boolean)
  const organic = Array.isArray(alert.prevention_organic) ? alert.prevention_organic : []

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold">{alert.pest_name}</h3>
          <p className="text-sm text-slate-500">Crops: {(alert.affected_crops || [alert.crop?.name || 'Multiple crops']).join(', ')}</p>
        </div>
        <AlertBadge severity={alert.severity} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="text-sm">
          <b>States:</b> {(alert.affected_states || []).slice(0, 4).join(', ')}
          <p className="mt-2 text-slate-600 dark:text-slate-300">{symptoms.slice(0, 2).join(', ')}</p>
        </div>
        <RiskMeter value={alert.risk_score || 30} />
      </div>
      <button onClick={() => setOpen(!open)} className="mt-4 text-sm font-bold text-primary-700">{open ? 'Hide prevention' : 'Show prevention'}</button>
      {open && <div className="mt-3 rounded-lg bg-primary-50 p-3 text-sm dark:bg-primary-900/30">{organic.map(item => <p key={item}>- {item}</p>)}{alert.prevention_chemical && <p className="mt-2"><b>Chemical:</b> {alert.prevention_chemical.chemical_name} @ {alert.prevention_chemical.dose}</p>}</div>}
      <Button className="mt-4 w-full" variant={alert.severity === 'critical' ? 'danger' : 'secondary'}>{alert.emergency_action || 'Contact agriculture officer'}</Button>
    </div>
  )
}
