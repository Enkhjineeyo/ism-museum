import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAsync } from '../lib/useAsync'
import { MAJOR_TOPICS } from '../lib/constants'
import Reveal from '../components/Reveal'
import { PageHead, State, Chips, SourceLink } from '../components/Ui'

const INFO_ORDER = ['founded', 'mission', 'vision', 'traditions', 'clubs', 'alumni', 'partners']

export default function About() {
  const [year, setYear] = useState('1')
  const { data, loading, error } = useAsync(async () => {
    const [info, courses, ms, ex] = await Promise.all([
      supabase.from('site_info').select('*'),
      supabase.from('courses').select('*').eq('is_active', true).order('code'),
      supabase.from('history_milestones').select('*').order('year').order('id'),
      supabase.from('exhibits').select('id, title, course_year, year_created').eq('is_active', true),
    ])
    const bad = [info, courses, ms, ex].find(r => r.error)
    if (bad) return { error: bad.error }
    return { data: { info: Object.fromEntries(info.data.map(r => [r.key, r])), courses: courses.data, ms: ms.data, ex: ex.data } }
  }, [])

  const info = data?.info || {}
  const yc = (data?.courses || []).filter(c => String(c.course_year) === year)
  const yp = (data?.ex || []).filter(e => String(e.course_year) === year)

  return (
    <section className="page">
      <PageHead kicker="About ISMD" title="Тэнхимийн тухай"
        lead="СЭЗИС-ийн Мэдээллийн системийн менежментийн тэнхим: мэргэжил, хичээл, курс, түүх." />
      <State loading={loading} error={error} />

      <Reveal>
        <div className="glass card-pad big">
          <p className="kicker">Мэдээллийн систем · Бакалаврын хөтөлбөр {info.major_index?.value && `· индекс ${info.major_index.value}`}</p>
          <p className="detail-text">{info.major_intro?.value}</p>
          <h4>Суралцах үндсэн чиглэлүүд</h4>
          <div className="chips">{MAJOR_TOPICS.map(t => <span key={t} className="chip static">{t}</span>)}</div>
        </div>
      </Reveal>

      <h2 className="h2 mt">Сургалтын хичээлүүд<span className="dot">.</span></h2>
      <p className="muted small">СЭЗИС-ийн онлайн сургалтын системд нийтлэгдсэн хичээлийн жишээ. Бүрэн сургалтын төлөвлөгөө биш.</p>
      <div className="grid3">
        {(data?.courses || []).map(c => (
          <div key={c.id} className="glass card-pad">
            <small className="cyan">{c.code}</small>
            <h3>{c.name}</h3>
            {c.description && <p className="muted">{c.description}</p>}
            <SourceLink url={c.source_url} />
          </div>
        ))}
      </div>

      <h2 className="h2 mt">Курсээр<span className="dot">.</span></h2>
      <Chips value={year} onChange={setYear} options={[1, 2, 3, 4].map(n => [String(n), `${n}-р курс`])} />
      <div className="grid3">
        <div className="glass card-pad">
          <h4>Судалж буй хичээлүүд</h4>
          {yc.length ? <ul>{yc.map(c => <li key={c.id}>{c.code} · {c.name}</li>)}</ul>
            : <p className="muted small">Курсийн хичээлийн хуваарийг тэнхимээс баталгаажуулж нөхнө.</p>}
        </div>
        <div className="glass card-pad">
          <h4>Хийсэн төслүүд</h4>
          {yp.length ? <ul>{yp.map(e => <li key={e.id}><Link className="src" to={`/museum/${e.id}`}>{e.title}</Link></li>)}</ul>
            : <p className="muted small">Энэ курсийн бүтээл бүртгэгдээгүй байна.</p>}
        </div>
        <div className="glass card-pad">
          <h4>Оюутнууд, арга хэмжээ, ангийн бүтээл</h4>
          <p className="muted small">Ангийн албан ёсны нэр, оюутны жагсаалтыг баталгаажаагүй тул оруулаагүй. Админ нөхнө.</p>
        </div>
      </div>

      <h2 className="h2 mt">Тэнхимийн мэдээлэл<span className="dot">.</span></h2>
      <div className="grid3">
        {INFO_ORDER.map(k => (
          <div key={k} className="glass card-pad">
            <h4>{info[k]?.label || k}</h4>
            <p className={info[k]?.value ? '' : 'muted small'}>{info[k]?.value || 'Мэдээллийг тэнхимээс баталгаажуулж админ нөхнө.'}</p>
          </div>
        ))}
      </div>

      <h2 className="h2 mt" id="history">Time Machine: түүх<span className="dot">.</span></h2>
      <p className="muted small">Албан ёсны хуудсанд дурдагдсан баримтуудаас бүрдүүлсэн.</p>
      <ol className="timeline">
        {(data?.ms || []).map(m => (
          <li key={m.id}>
            <Reveal>
              <span className="year">{m.year}</span>
              <div className="glass tl-card"><h3>{m.title}</h3><p>{m.description}</p></div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
