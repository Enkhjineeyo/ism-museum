import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAsync } from '../lib/useAsync'
import { useAuth } from '../context/AuthContext'
import { uploadImage } from '../lib/upload'
import { PageHead } from '../components/Ui'

export default function Profile() {
  const { user, profile, ready, refreshProfile } = useAuth()
  const [form, setForm] = useState({})
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (profile) setForm({
      full_name: profile.full_name || profile.display_name || '',
      student_code: profile.student_code || '',
      course_year: profile.course_year || '',
      interests: (profile.interests || []).join(', '),
      avatar_url: profile.avatar_url || '',
    })
  }, [profile])

  const { data: lists } = useAsync(async () => {
    if (!user) return { data: { views: [], favs: [] } }
    const [v, f] = await Promise.all([
      supabase.from('views').select('viewed_at, exhibits(id, title)').eq('user_id', user.id).order('viewed_at', { ascending: false }).limit(20),
      supabase.from('favorites').select('created_at, exhibits(id, title)').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    if (v.error || f.error) return { error: v.error || f.error }
    return { data: { views: v.data, favs: f.data } }
  }, [user?.id])

  if (!ready) return <section className="page"><p className="muted">Ачаалж байна...</p></section>
  if (!user) return (
    <section className="page narrow">
      <PageHead kicker="Profile" title="Профайл" />
      <div className="glass form"><p>Профайлаа үзэхийн тулд нэвтэрнэ үү.</p>
        <Link className="btn primary" to="/login">Нэвтрэх</Link></div>
    </section>
  )

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function save(e) {
    e.preventDefault()
    setMsg('')
    const payload = {
      full_name: form.full_name || null,
      display_name: form.full_name || profile?.display_name,
      student_code: form.student_code || null,
      course_year: form.course_year ? Number(form.course_year) : null,
      interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
      avatar_url: form.avatar_url || null,
    }
    const { error } = await supabase.from('profiles').update(payload).eq('id', user.id)
    if (error) setMsg(error.message)
    else { setMsg('Хадгаллаа ✓'); refreshProfile() }
  }

  async function avatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try { set('avatar_url', await uploadImage(file, 'avatars')) } catch (err) { setMsg(err.message) }
  }

  return (
    <section className="page">
      <PageHead kicker="Profile" title="Миний профайл" />
      <div className="detail">
        <form className="glass form" onSubmit={save}>
          <div className="avatar-edit">
            {form.avatar_url ? <img src={form.avatar_url} alt="avatar" /> : <div className="img-ph sm">{(form.full_name || '?')[0]}</div>}
            <input type="file" accept="image/*" onChange={avatar} />
          </div>
          <label>Овог, нэр<input value={form.full_name || ''} onChange={e => set('full_name', e.target.value)} /></label>
          <label>Оюутны код<input value={form.student_code || ''} onChange={e => set('student_code', e.target.value)} /></label>
          <label>Мэргэжил<input value="Мэдээллийн систем" disabled /></label>
          <label>Тэнхим<input value="Мэдээллийн системийн менежментийн тэнхим" disabled /></label>
          <label>Курс
            <select value={form.course_year || ''} onChange={e => set('course_year', e.target.value)}>
              <option value="">—</option>
              {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}-р курс</option>)}
            </select>
          </label>
          <label>Сонирхдог чиглэл (таслалаар)
            <input value={form.interests || ''} onChange={e => set('interests', e.target.value)} placeholder="Программчлал, өгөгдлийн шинжилгээ, дизайн" />
          </label>
          {msg && <p className={msg.includes('✓') ? 'cyan' : 'error'}>{msg}</p>}
          <button className="btn primary">Хадгалах</button>
        </form>

        <aside className="side">
          <div className="glass card-pad">
            <h4>Хадгалсан дуртай бүтээлүүд</h4>
            {(lists?.favs || []).length === 0 ? <p className="muted small">Хадгалсан бүтээл алга.</p>
              : <ul>{lists.favs.map(f => f.exhibits && <li key={f.exhibits.id}><Link className="src" to={`/museum/${f.exhibits.id}`}>{f.exhibits.title}</Link></li>)}</ul>}
          </div>
          <div className="glass card-pad">
            <h4>Үзсэн үзмэрүүд</h4>
            {(lists?.views || []).length === 0 ? <p className="muted small">Одоогоор үзсэн үзмэр алга.</p>
              : <ul>{lists.views.map(v => v.exhibits && <li key={v.exhibits.id}><Link className="src" to={`/museum/${v.exhibits.id}`}>{v.exhibits.title}</Link></li>)}</ul>}
          </div>
        </aside>
      </div>
    </section>
  )
}
