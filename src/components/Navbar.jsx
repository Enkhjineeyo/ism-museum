import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../lib/i18n'

const ITEMS = [
  ['/', 'home', true], ['/about', 'about'], ['/museum', 'museum'], ['/projects', 'projects'],
  ['/teachers', 'teachers'], ['/activities', 'activities'], ['/gallery', 'gallery'], ['/categories', 'categories'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isAdmin, signOut } = useAuth()
  const { t, lang, setLang } = useLang()
  const close = () => setOpen(false)

  return (
    <header className="nav-wrap">
      <nav className="nav glass">
        <Link to="/" className="brand" onClick={close}>ISM<span>.</span>Museum</Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {ITEMS.map(([to, key, end]) => (
            <NavLink key={to} to={to} end={end} onClick={close}>{t(key)}</NavLink>
          ))}
          <NavLink to={user ? '/profile' : '/login'} onClick={close}>{t('profile')}</NavLink>
          {isAdmin && <NavLink to="/admin" onClick={close}>{t('admin')}</NavLink>}
          {user
            ? <button className="link-btn" onClick={() => { signOut(); close() }}>{t('logout')}</button>
            : <NavLink to="/register" className="nav-cta" onClick={close}>{t('register')}</NavLink>}
        </div>

        <div className="nav-tools">
          <button className="lang" onClick={() => setLang(lang === 'mn' ? 'en' : 'mn')} aria-label="Language">
            {lang === 'mn' ? 'EN' : 'МН'}
          </button>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">{open ? '✕' : '☰'}</button>
        </div>
      </nav>
    </header>
  )
}
