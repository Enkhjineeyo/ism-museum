import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAsync } from '../lib/useAsync'
import { ALBUMS } from '../lib/constants'
import { PageHead, State, Chips, SourceLink, fmtDate } from '../components/Ui'

// Google Drive дээрх бүрэн цомгууд (фолдерын холбоос "Anyone with the link" эрхтэй байх ёстой)
const DRIVE_ALBUMS = [
  { title: 'Нөхөрлөл 2026', text: 'Оюутан, төгсөгч, багш нарын спортын өдөрлөгийн бүрэн цомог',
    cover: '/events/sports-day.jpg',
    url: 'https://drive.google.com/drive/folders/1Ch7SAK1EJnkx6jgQVu49xTd67qfBJlbi' },
  { title: 'Тэнхимийн өдөрлөгийн цомог', text: 'Тэнхимийн өдөрлөгийн зургийн бүрэн цомог',
    cover: '/events/img4.jpg',
    url: 'https://drive.google.com/drive/folders/1E4T4g3nc0jZzc3qYpbceaDU1Y018lGSx' },
]

export default function Gallery() {
  const [album, setAlbum] = useState('all')
  const [layout, setLayout] = useState('masonry')
  const [idx, setIdx] = useState(null)

  const { data, loading, error } = useAsync(
    () => supabase.from('gallery_photos').select('*').eq('is_active', true)
      .order('photo_date', { ascending: false, nullsFirst: false }), [])

  const list = (data || []).filter(p => album === 'all' || p.album === album)
  const counts = ALBUMS.reduce((m, a) => ({ ...m, [a]: (data || []).filter(p => p.album === a).length }), {})

  useEffect(() => {
    if (idx === null) return
    const onKey = e => {
      if (e.key === 'Escape') setIdx(null)
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % list.length)
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + list.length) % list.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [idx, list.length])

  const cur = idx !== null ? list[idx] : null

  return (
    <section className="page">
      <PageHead kicker="Photo Gallery" title="Зурагт цомог"
        lead="Арга хэмжээний зураг, дурсамж. Зургийг зөвшөөрөлтэй, эх сурвалжийн холбоостой байршуулна." />
      <h2 className="h3">Бүрэн цомгууд · Google Drive</h2>
      <div className="grid3" style={{ marginBottom: 32 }}>
        {DRIVE_ALBUMS.map(a => (
          <a key={a.url} href={a.url} target="_blank" rel="noreferrer" className="glass work">
            <img src={a.cover} alt={a.title} loading="lazy" />
            <div className="work-body">
              <small>Google Drive ↗</small>
              <h3>{a.title}</h3>
              <p className="muted clamp">{a.text}</p>
            </div>
          </a>
        ))}
      </div>

      <Chips value={album} onChange={setAlbum}
        options={[['all', 'Бүгд'], ...ALBUMS.map(a => [a, `${a} (${counts[a]})`])]} />
      <div className="chips">
        <button className={`chip ${layout === 'masonry' ? 'on' : ''}`} onClick={() => setLayout('masonry')}>Masonry</button>
        <button className={`chip ${layout === 'grid' ? 'on' : ''}`} onClick={() => setLayout('grid')}>Grid</button>
      </div>

      <State loading={loading} error={error} empty="Зурагт цомог хараахан нэмэгдээгүй байна. Админ /admin хэсгээс Facebook, Instagram-ын зургийг эх сурвалжийн холбоостой нэмнэ." count={list.length} />

      <div className={layout === 'masonry' ? 'masonry' : 'photo-grid'}>
        {list.map((p, i) => (
          <figure key={p.id} className="photo" onClick={() => setIdx(i)}>
            <img src={p.image_url} alt={p.title || p.album} loading="lazy" />
            <figcaption>{p.title || p.event_title || p.album}</figcaption>
          </figure>
        ))}
      </div>

      {cur && (
        <div className="lightbox" onClick={() => setIdx(null)}>
          <button className="lb-x" onClick={() => setIdx(null)} aria-label="Close">✕</button>
          <button className="lb-nav l" onClick={e => { e.stopPropagation(); setIdx((idx - 1 + list.length) % list.length) }}>‹</button>
          <figure onClick={e => e.stopPropagation()}>
            <img src={cur.image_url} alt={cur.title || cur.album} />
            <figcaption>
              <b>{cur.title || cur.event_title}</b>
              <span>{cur.album} · {fmtDate(cur.photo_date)}</span>
              {cur.description && <span>{cur.description}</span>}
              <SourceLink url={cur.source_url} />
            </figcaption>
          </figure>
          <button className="lb-nav r" onClick={e => { e.stopPropagation(); setIdx((idx + 1) % list.length) }}>›</button>
        </div>
      )}
    </section>
  )
}
