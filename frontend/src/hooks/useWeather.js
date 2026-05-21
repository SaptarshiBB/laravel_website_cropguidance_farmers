import { useEffect, useState } from 'react'
import { getForecast } from '../api/weatherApi'

export default function useWeather(location = {}) {
  const { city, state } = location
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getForecast({ city, state }).then(res => active && setData(res)).catch(() => active && setData(null)).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [city, state])

  return { data, loading }
}
