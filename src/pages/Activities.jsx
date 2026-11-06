import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAsync } from '../lib/useAsync'
import { EVENT_TYPES, today } from '../lib/constants'
import Reveal from '../components/Reveal'
import { PageHead, State, Chips, SourceLink, fmtDate } from '../components/Ui'

const COMPETITIONS = [
  ['Программчлалын тэмцээн', 'Тэнхимээс жил бүр зохион байгуулдаг оюутнуудын программчлалын тэмцээн.'],
  ['Бүтээлийн уралдаан', 'Жил бүр зохион байгуулагддаг оюутнуудын бүтээлийн уралдаан. M Bank-ны ивээн тэтгэлгээр явагддаг.'],
]

const CLUBS = [
  { name: 'White Hats club', founded: '2022', head: 'Б.Оюу',
    text: 'МСМ тэнхимийн оюутнуудын клуб. 2022 онд үүсгэн байгуулагдсан. Одоогийн тэргүүн Б.Оюу.',
    url: 'https://www.instagram.com/ufe_whitehats/' },
]

export default function Activities() {
  const [type, setType] = useState('all')
  const [open, setOpen] = useState(null)
  const [photos, setPhotos] = useState([])

  const { data, loading, error } = useAsync(
    () => supabase.from('events').select('*').eq('is_active', true)
      .order('event_date', { ascending: false, nullsFirst: false }), [])

  async function toggle(id) {
    if (open === id) { setOpen(null); return }
    setOpen(id)
    const { data: p } = await supabase.from('event_photos').select('*').eq('event_id', id)
    setPhotos(p || [])
  }

  const list = (data || []).filter(e => type === 'all' || e.event_type === type)
  const upcoming = list.filter(e => e.event_date && e.event_date >= today())
  const past = list.filter(e => !e.event_date || e.event_date < today())

  const Card = ({ ev }) => (
    <Reveal>
      <article className="glass event">
        <button className="event-head" onClick={() => toggle(ev.id)}>
          <time>{fmtDate(ev.event_date)}</time>
          <div>
            <h3>{ev.title}</h3>
            {ev.event_type && <small className="cyan">{ev.event_type}</small>}
          </div>
          <span>{open === ev.id ? '−' : '+'}</span>
        </button>
        {open === ev.id && (
          <div className="event-body">
            <div className="meta">
              {ev.location && <span>📍 {ev.location}</span>}
              {ev.organizer && <span>Зохион байгуулагч: {ev.organizer}</span>}
              {ev.participants && <span>Оролцогчид: {ev.participants}</span>}
            </div>
            {ev.purpose && <p><b>Зорилго:</b> {ev.purpose}</p>}
            <p>{ev.description}</p>
            {ev.cover_image_url && <img className="detail-img" src={ev.cover_image_url} alt={ev.title} />}
            {photos.length > 0 && (
              <div className="gallery">
                {photos.map(p => <img key={p.id} src={p.image_url} alt={p.caption || ev.title} loading="lazy" />)}
              </div>
            )}
            <SourceLink url={ev.source_url} label="Facebook / Instagram / эх сурвалж" />
          </div>
        )}
      </article>
    </Reveal>
  )

  return (
    <section className="page">
      <PageHead kicker="Өдөрлөг · Сургалт · Тэмцээн" title="Арга хэмжээ"
        lead="Тэнхимийн оюутнуудад зориулсан үйл ажиллагаа, уламжлалт арга хэмжээ, сургалт, уулзалтууд." />
      <div className="actions" style={{ marginBottom: 22 }}>
        <a className="btn ghost" href="https://www.instagram.com/ufe_ismd/" target="_blank" rel="noreferrer">Instagram: ufe_ismd ↗</a>
        <a className="btn ghost" href="https://www.facebook.com/profile.php?id=61576135060864" target="_blank" rel="noreferrer">Facebook ↗</a>
        <a className="btn ghost" href="https://www.instagram.com/ism_last_login/" target="_blank" rel="noreferrer">Instagram: ism_last_login ↗</a>
      </div>
      <h2 className="h3">Оюутны клуб, хамтын ажиллагаа</h2>
      <div className="grid3" style={{ marginBottom: 32 }}>
        {CLUBS.map(c => (
          <a key={c.url} href={c.url} target="_blank" rel="noreferrer" className="glass card-pad">
            <small className="cyan">Үүсгэн байгуулагдсан: {c.founded} · Тэргүүн: {c.head}</small>
            <h3>{c.name}</h3>
            <p className="muted">{c.text}</p>
            <span className="src">Instagram: ufe_whitehats ↗</span>
          </a>
        ))}
      </div>

      <h2 className="h3">Жил бүрийн тэмцээн</h2>
      <div className="grid3" style={{ marginBottom: 32 }}>
        {COMPETITIONS.map(([title, text]) => (
          <div key={title} className="glass card-pad">
            <small className="cyan">Жил бүр</small>
            <h3>{title}</h3>
            <p className="muted">{text}</p>
          </div>
        ))}
      </div>
      <p className="muted" style={{ marginBottom: 20 }}>2022 оноос хойш тэнхим жил бүр хавар, намар гэсэн хоёр удаа тэнхимийн өдөрлөг зохион байгуулдаг.</p>
      <Chips value={type} onChange={setType} options={[['all', 'Бүгд'], ...EVENT_TYPES.map(t => [t, t])]} />
      <State loading={loading} error={error} empty count={list.length} />

      {upcoming.length > 0 && <><h2 className="h3">Удахгүй болох</h2><div className="stack">{upcoming.map(e => <Card key={e.id} ev={e} />)}</div></>}
      {past.length > 0 && <><h2 className="h3">Болсон</h2><div className="stack">{past.map(e => <Card key={e.id} ev={e} />)}</div></>}
    </section>
  )
}
