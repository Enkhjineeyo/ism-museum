import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageHead } from '../components/Ui'

export function Login() {
  const { signIn } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setMsg('')
    const { error } = await signIn(email, password)
    setBusy(false)
    if (error) setMsg(error.message)
    else nav('/profile')
  }

  return (
    <section className="page narrow">
      <PageHead kicker="Account" title="Нэвтрэх" />
      <form className="glass form" onSubmit={submit}>
        <label>И-мэйл<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Нууц үг<input type="password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
        {msg && <p className="error">{msg}</p>}
        <button className="btn primary" disabled={busy}>{busy ? '...' : 'Нэвтрэх'}</button>
        <p className="muted small">Бүртгэлгүй юу? <Link className="src" to="/register">Бүртгүүлэх</Link></p>
      </form>
    </section>
  )
}

export function Register() {
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (password.length < 6) { setMsg('Нууц үг дор хаяж 6 тэмдэгт байна.'); return }
    setBusy(true); setMsg('')
    const { error } = await signUp(email, password, name)
    setBusy(false)
    if (error) setMsg(error.message)
    else setOk(true)
  }

  return (
    <section className="page narrow">
      <PageHead kicker="Account" title="Бүртгүүлэх" />
      {ok ? (
        <div className="glass form">
          <p>Бүртгэл амжилттай үүслээ. И-мэйл баталгаажуулалт идэвхтэй бол имэйлээ шалгаад дараа нь <Link className="src" to="/login">нэвтэрнэ үү</Link>.</p>
        </div>
      ) : (
        <form className="glass form" onSubmit={submit}>
          <label>Овог, нэр<input required value={name} onChange={e => setName(e.target.value)} /></label>
          <label>И-мэйл<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label>Нууц үг<input type="password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
          {msg && <p className="error">{msg}</p>}
          <button className="btn primary" disabled={busy}>{busy ? '...' : 'Бүртгүүлэх'}</button>
          <p className="muted small">Бүртгэлтэй юу? <Link className="src" to="/login">Нэвтрэх</Link></p>
        </form>
      )}
    </section>
  )
}
