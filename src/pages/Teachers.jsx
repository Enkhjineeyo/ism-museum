import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAsync } from '../lib/useAsync'
import Reveal from '../components/Reveal'
import { PageHead, State, Modal, SourceLink } from '../components/Ui'

function Block({ title, text }) {
  if (!text) return null
  return <div className="block"><h4>{title}</h4><p>{text}</p></div>
}

export default function Teachers() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)
  const { data, loading, error } = useAsync(
    () => supabase.from('teachers').select('*').eq('is_active', true).order('id'), [])

  const list = (data || []).filter(t =>
    `${t.name} ${t.position || ''} ${t.courses || ''} ${t.research || ''}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <section className="page">
      <PageHead kicker="Тэнхимийн баг" title="Багш нар"
        lead="СЭЗИС-ийн албан ёсны хуудаснаас авсан мэдээлэл. Карт дээр дарж дэлгэрэнгүй профайлыг үзнэ үү." />
      <input className="search glass" placeholder="Нэр, албан тушаал, хичээл, судалгааны чиглэлээр хайх..."
        value={q} onChange={e => setQ(e.target.value)} />
      <State loading={loading} error={error} empty count={list.length} />

      <div className="grid3">
        {list.map((t, i) => (
          <Reveal key={t.id} delay={(i % 3) * 70}>
            <article className="glass teacher" onClick={() => setOpen(t)} tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setOpen(t)}>
              {t.photo_url ? <img src={t.photo_url} alt={t.name} loading="lazy" /> : <div className="img-ph">{t.name?.[2]}</div>}
              <div className="teacher-body">
                <h3>{t.name}</h3>
                <p className="pos">{t.position}</p>
                {t.courses && <p className="small clamp"><b>Хичээл:</b> {t.courses}</p>}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {open && (
        <Modal onClose={() => setOpen(null)}>
          <div className="profile-head">
            {open.photo_url && <img src={open.photo_url} alt={open.name} />}
            <div>
              <h2>{open.name}</h2>
              <p className="pos">{open.position}</p>
              <SourceLink url={open.source_url} label="Албан ёсны хуудас" />
            </div>
          </div>
          <Block title="Боловсрол" text={open.education} />
          <Block title="Мэргэжлийн танилцуулга" text={open.bio} />
          <Block title="Мэргэжлийн туршлага" text={open.experience} />
          <Block title="Заадаг хичээлүүд" text={open.courses} />
          <Block title="Судалгааны чиглэл" text={open.research} />
          <Block title="Сертификат" text={open.certificates} />
          <Block title="Бүтээл, судалгаа" text={open.publications} />
          {!open.education && !open.research && <p className="muted small">Нэмэлт мэдээллийг албан ёсны хуудаснаас үзнэ үү.</p>}
        </Modal>
      )}
    </section>
  )
}
