export default function RiskMeter({ value = 40 }) {
  const color = value > 80 ? '#dc2626' : value > 60 ? '#ea580c' : value > 30 ? '#ca8a04' : '#16a34a'
  const angle = -90 + (value / 100) * 180
  const label = value > 80 ? 'Critical' : value > 60 ? 'High' : value > 30 ? 'Medium' : 'Low Risk'
  return <div className="relative h-28 w-36"><svg viewBox="0 0 160 100" className="h-full w-full"><path d="M20 80 A60 60 0 0 1 140 80" fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round"/><path d="M20 80 A60 60 0 0 1 140 80" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${value * 1.88} 188`}/><line x1="80" y1="80" x2="80" y2="28" stroke={color} strokeWidth="4" strokeLinecap="round" style={{ transform: `rotate(${angle}deg)`, transformOrigin: '80px 80px', transition: 'transform .5s ease' }}/></svg><div className="absolute inset-x-0 bottom-1 text-center text-xs font-bold" style={{ color }}>{label}</div></div>
}
