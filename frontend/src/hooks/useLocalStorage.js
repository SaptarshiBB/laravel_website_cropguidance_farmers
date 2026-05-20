import { useEffect, useState } from 'react'
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => JSON.parse(localStorage.getItem(key) || 'null') ?? initialValue)
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)) }, [key, value])
  return [value, setValue]
}
