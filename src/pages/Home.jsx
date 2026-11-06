import { Link } from 'react-router-dom'
import TiltedGridHero from '../components/TiltedGridHero'
import { supabase } from '../supabaseClient'
import { useAsync } from '../lib/useAsync'
import { useLang } from '../lib/i18n'
import { today } from '../lib/constants'
import Reveal from '../components/Reveal'
import { State, fmtDate } from '../components/Ui'

const KEYWORDS = ['Дижитал музей', 'Багш нар', 'Оюутны бүтээл', 'Арга хэмжээ', 'Зурагт цомог', 'Өгөгдлийн шинжилгээ',
  'Системийн шинжилгээ', 'Хиймэл оюун', 'Дижитал шилжилт']

const EVENT_PHOTOS = ['/events/welcome-night.jpg', '/events/sports-day.jpg', '/events/img4.jpg', '/events/halloween.jpg']
  .map(src => ({ src }))

const ROWS = [
  ['/about', '01', 'Тэнхимийн тухай', 'Мэргэжил, хичээл, 1–4-р курс, түүх'],
  ['/museum', '02', 'Цахим музей', 'Үзмэр, бүтээл, хайлт ба шүүлт'],
  ['/teachers', '03', 'Багш нар', 'Профайл, хичээл, судалгааны чиглэл'],
  ['/activities', '04', 'Арга хэмжээ', 'Өдөрлөг, сургалт, тэмцээн, уулзалт'],
  ['/gallery', '05', 'Зурагт цомог', 'Grid, Masonry, Lightbox'],
]

export default function Home() {
  const { t } = useLang()
  const { data, loading, error } = useAsync(async () => {
    const [ex, ev, al, te, ca] = await Promise.all([
      supabase.from('exhibits').select('*, exhibition_categories(name, kind)')
        .eq('is_active', true).order('year_created', { ascending: false }),
      supabase.from('events').select('*').eq('is_active', true).order('event_date', { ascending: true }),
      supabase.from('gallery_photos').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(6),
      supabase.from('teachers').select('id, name, position, photo_url').eq('is_active', true).order('id'),
      supabase.from('exhibition_categories').select('id, name, name_en, exhibits(count)').order('id'),
    ])
    const bad = [ex, ev, al, te, ca].find(r => r.error)
    if (bad) return { error: bad.error }
    return { data: { ex: ex.data, ev: ev.data, al: al.data, te: te.data, ca: ca.data } }
  }, [])

  const ex = data?.ex || []

  // Hero-ийн зураг: тэнхимийн өдөрлөгүүдийн бодит зургууд (public/events)
  const heroImages = EVENT_PHOTOS

  const projects = ex.filter(e => e.exhibition_categories?.kind !== 'archive')
  const featured = [...ex].sort((a, b) => Number(!!b.is_featured) - Number(!!a.is_featured)).slice(0, 6)
  const upcoming = (data?.ev || []).filter(e => e.event_date && e.event_date >= today()).slice(0, 3)
  const stats = [
    [ex.length, t('totalExhibits')], [projects.length, t('totalProjects')],
    [data?.te.length ?? 0, t('totalTeachers')], [data?.ev.length ?? 0, t('totalEvents')],
  ]

  return (
    <>
      <TiltedGridHero images={heroImages} className="hero-tilt" axis={58} tileHeight={27} speed={5}>
        <div className="hero-over">
          <div>
            <p className="kicker">{t('heroKicker')}</p>
            <h1>ISM Digital<br />Museum<span className="dot">.</span></h1>
          </div>
          <div className="hero-bottom">
            <p className="lead">{t('heroLead')}</p>
            <div className="actions">
              <Link to="/museum" className="btn primary">{t('exploreMuseum')}</Link>
              <Link to="/teachers" className="btn ghost">{t('meetTeachers')}</Link>
            </div>
          </div>
        </div>
      </TiltedGridHero>

      <div className="marquee" aria-hidden="true">
        <div className="track">
          {[...KEYWORDS, ...KEYWORDS].map((k, i) => <span key={i}>{k}<i>✦</i></span>)}
        </div>
      </div>

      <section className="section">
        <Reveal><h2 className="h2">Музейд юу байна<span className="dot">.</span></h2></Reveal>
        <div className="rows">
          {ROWS.map(([to, n, title, text], i) => (
            <Reveal key={to} delay={i * 70}>
              <Link to={to} className="row-link">
                <span className="num">{n}</span>
                <span className="row-title">{title}</span>
                <span className="row-text">{text}</span>
                <span className="arrow">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="stats">
          {stats.map(([n, label], i) => (
            <Reveal key={label} className="glass stat" delay={i * 80}><b>{n}</b><span>{label}</span></Reveal>
          ))}
        </div>
        <State loading={loading} error={error} />
      </section>

      <section className="section">
        <Reveal><h2 className="h2">{t('featured')}<span className="dot">.</span></h2></Reveal>
        <div className="hscroll">
          {featured.map(e => (
            <Link key={e.id} to={`/museum/${e.id}`} className="glass work">
              {e.image_url ? <img src={e.image_url} alt={e.title} loading="lazy" /> : <div className="img-ph">{e.year_created || '·'}</div>}
              <div className="work-body">
                <small>{e.exhibition_categories?.name} · {e.year_created || '—'}</small>
                <h3>{e.title}</h3>
              </div>
            </Link>
          ))}
          {!loading && featured.length === 0 && <p className="muted">{t('empty')}</p>}
        </div>
      </section>

      <section className="section">
        <div className="split-head">
          <Reveal><h2 className="h2">{t('latestProjects')}<span className="dot">.</span></h2></Reveal>
          <Link to="/projects" className="btn ghost">{t('viewAll')}</Link>
        </div>
        <div className="grid3">
          {projects.slice(0, 3).map((e, i) => (
            <Reveal key={e.id} delay={i * 80}>
              <Link to={`/museum/${e.id}`} className="glass card-pad">
                <small className="cyan">{e.project_type || e.exhibition_categories?.name} · {e.year_created || '—'}</small>
                <h3>{e.title}</h3>
                <p className="muted clamp">{e.summary || e.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="split-head">
          <Reveal><h2 className="h2">{t('upcoming')}<span className="dot">.</span></h2></Reveal>
          <Link to="/activities" className="btn ghost">{t('viewAll')}</Link>
        </div>
        {upcoming.length === 0
          ? <p className="muted">Удахгүй болох арга хэмжээ бүртгэгдээгүй байна. Тэнхимийн арга хэмжээг <Link className="src" to="/activities">энд</Link> үзнэ үү.</p>
          : <div className="grid3">
              {upcoming.map(ev => (
                <Link key={ev.id} to="/activities" className="glass card-pad">
                  <small className="cyan">{fmtDate(ev.event_date)}</small>
                  <h3>{ev.title}</h3>
                  <p className="muted clamp">{ev.description}</p>
                </Link>
              ))}
            </div>}
      </section>

      <section className="section">
        <div className="split-head">
          <Reveal><h2 className="h2">{t('newAlbums')}<span className="dot">.</span></h2></Reveal>
          <Link to="/gallery" className="btn ghost">{t('viewAll')}</Link>
        </div>
        {(data?.al || []).length === 0
          ? <p className="muted">Зурагт цомог хараахан нэмэгдээгүй байна. {t('adminFill')}</p>
          : <div className="mini-gallery">
              {data.al.map(p => <img key={p.id} src={p.image_url} alt={p.title || p.album} loading="lazy" />)}
            </div>}
      </section>

      <section className="section">
        <div className="split-head">
          <Reveal><h2 className="h2">{t('teachersIntro')}<span className="dot">.</span></h2></Reveal>
          <Link to="/teachers" className="btn ghost">{t('viewAll')}</Link>
        </div>
        <div className="avatars">
          {(data?.te || []).slice(0, 6).map(p => (
            <Link key={p.id} to="/teachers" className="avatar-card glass">
              {p.photo_url ? <img src={p.photo_url} alt={p.name} loading="lazy" /> : <div className="img-ph sm">{p.name?.[2]}</div>}
              <b>{p.name}</b><small>{p.position}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal><h2 className="h2">{t('categoriesTitle')}<span className="dot">.</span></h2></Reveal>
        <div className="chips">
          {(data?.ca || []).map(c => (
            <Link key={c.id} to={`/museum?category=${c.id}`} className="chip">
              {c.name} <b>{c.exhibits?.[0]?.count ?? 0}</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal>
          <div className="cta glass">
            <h2 className="h2">Бүтээлээ музейд нэмье<span className="dot">.</span></h2>
            <p className="lead">Бүртгүүлж, профайлаа үүсгэн, дуртай үзмэрээ хадгалаарай.</p>
            <Link to="/register" className="btn primary">Бүртгүүлэх</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
