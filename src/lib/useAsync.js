import { useEffect, useState } from 'react'

// fn нь { data, error } буцаах promise (Supabase хэлбэр)
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let alive = true
    setState(s => ({ ...s, loading: true }))
    Promise.resolve(fn())
      .then(r => {
        if (!alive) return
        if (r?.error) setState({ data: null, loading: false, error: r.error.message || String(r.error) })
        else setState({ data: r?.data ?? null, loading: false, error: null })
      })
      .catch(e => alive && setState({ data: null, loading: false, error: String(e.message || e) }))
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  return { ...state, reload: () => setTick(t => t + 1) }
}
