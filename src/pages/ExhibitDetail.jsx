import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAsync } from '../lib/useAsync'
import { useAuth } from '../context/AuthContext'
import { State, SourceLink } from '../components/Ui'

function Row({ label, children }) {
  if (!children) return null
  return <div className="kv"><span>{label}</span><b>{children}</b></div>
}

export default function ExhibitDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [fav, setFav] = useState(false)
  const { data: e, loading, error } = useAsync(
    () => supabase.from('exhibits').select('*, exhibition_categories(name)').eq('id', id).maybeSingle(), [id])

  useEffect(() => {
    if (!user || !e) return
    supabase.from('views').upsert({ user_id: user.id, exhibit_id: e.id, viewed_at: new Date().toISOString() })
    supabase.from('favorites').select('exhibit_id').eq('user_id', user.id).eq('exhibit_id', e.id)
      .maybeSingle().then(({ data }) => setFav(!!data))
  }, [user, e])

  async function toggleFav() {
    if (fav) await supabase.from('favorites').delete().eq('user_id', user.id).eq('exhibit_id', e.id)
    else await supabase.from('favorites').insert({ user_id: user.id, exhibit_id: e.id })
    setFav(!fav)
  }

  if (loading || error) return <section className="page"><State loading={loading} error={error} /></section>
  if (!e) return <section className="page"><p className="muted">Үзмэр олдсонгүй. <Link className="src" to="/museum">Музей рүү буцах</Link></p></section>

  return (
    <section className="page">
      <Link to="/museum" className="src">← Музей</Link>
      <p className="kicker" style={{ marginTop: 18 }}>{e.exhibition_categories?.name}</p>
      <h1 className="h1" style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}>{e.title}</h1>

      <div className="detail">
        <div>
          {e.image_url && <img className="detail-img" src={e.image_url} alt={e.title} />}
          {e.video_url && <p><a className="btn ghost" href={e.video_url} target="_blank" rel="noreferrer">Видео үзэх ↗</a></p>}
          <p className="detail-text">{e.description || e.summary || 'Дэлгэрэнгүй тайлбарыг админ нөхнө.'}</p>
        </div>
        <aside className="glass side">
          <Row label="Зохиогч">{e.author_name}</Row>
          <Row label="Курс">{e.course_year && `${e.course_year}-р курс`}</Row>
          <Row label="Он">{e.year_created}</Row>
          <Row label="Төрөл">{e.project_type}</Row>
          <Row label="Хичээл">{e.course_name}</Row>
          <Row label="Төсөл">{e.project_name}</Row>
          <Row label="Технологи">{e.technology_stack}</Row>
          <div className="side-links">
            {e.demo_url && <a className="btn primary" href={e.demo_url} target="_blank" rel="noreferrer">Demo ↗</a>}
            {e.github_url && <a className="btn ghost" href={e.github_url} target="_blank" rel="noreferrer">GitHub ↗</a>}
            <SourceLink url={e.source_url} />
          </div>
          {user
            ? <button className={`btn ${fav ? 'primary' : 'ghost'}`} onClick={toggleFav}>{fav ? '♥ Хадгалсан' : '♡ Дуртайд нэмэх'}</button>
            : <p className="muted small"><Link className="src" to="/login">Нэвтэрч</Link> дуртай бүтээлээ хадгална уу.</p>}
        </aside>
      </div>
    </section>
  )
}
