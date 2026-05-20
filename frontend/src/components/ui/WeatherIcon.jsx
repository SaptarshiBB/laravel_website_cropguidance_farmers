import { Cloud, CloudRain, Sun, CloudSun } from 'lucide-react'
export default function WeatherIcon({ condition = '', size = 28 }) { const c = condition.toLowerCase(); if (c.includes('rain')) return <CloudRain size={size} />; if (c.includes('sun')) return <Sun size={size} />; if (c.includes('cloud')) return <CloudSun size={size} />; return <Cloud size={size} /> }
