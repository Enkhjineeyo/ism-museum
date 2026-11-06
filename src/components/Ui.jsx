import { useEffect } from 'react'
import { useLang } from '../lib/i18n'
import { hasEnv } from '../supabaseClient'

export function PageHead({ kicker, title, lead }) {
  return (
    <header className="page-head">
      {kicker && <p className="kicker">{kicker}</p>}
      <h1 className="h1">{title}<span className="dot">.</span></h1>
      {lead && <p className="lead">{lead}</p>}
    </header>
  )
}

export function State({ loading, error, empty, count }) {
  const { t } = useLang()
  if (!hasEnv) return <p className="error">Supabase тохиргоо (.env) олдсонгүй. VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY-г шалгана уу.</p>
  if (loading) return <p className="muted">{t('loading')}</p>
  if (error) return <p className="error">Алдаа: {error}</p>
  if (empty && count === 0) return <p className="muted">{typeof empty === 'string' ? empty : t('empty')}</p>
  return null
}

export function Chips({ options, value, onChange }) {
  return (
    <div className="chips">
      {options.map(([k, label]) => (
        <button key={k} className={`chip ${value === k ? 'on' : ''}`} onClick={() => onChange(k)}>{label}</button>
      ))}
    </div>
  )
}

export function Modal({ onClose, children }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal glass" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-x" onClick={onClose} aria-label="Close">✕</button>
        {children}
      </div>
    </div>
  )
}

export function SourceLink({ url, label = 'Эх сурвалж' }) {
  if (!url) return null
  return <a className="src" href={url} target="_blank" rel="noreferrer">{label} ↗</a>
}

export const fmtDate = d => (d ? String(d).slice(0, 10) : 'Огноо тодорхойгүй')
