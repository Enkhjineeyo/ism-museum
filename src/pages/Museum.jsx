import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAsync } from '../lib/useAsync'
import { useLang } from '../lib/i18n'
import { PROJECT_TYPES } from '../lib/constants'
import Reveal from '../components/Reveal'
import { PageHead, State } from '../components/Ui'

export default function Museum({ mode }) {
  const { t } = useLang()
  const [params] = useSearchParams()
  const [q, setQ] = useState('')
  const [category, setCategory] = useState(params.get('category') || '')
  const [year, setYear] = useState('')
  const [course, setCourse] = useState('')
  const [type, setType] = useState('')
  const [sort, setSort] = useState('new')

  const { data, loading, error } = useAsync(async () => {
    const [ex, ca] = await Promise.all([
      supabase.from('exhibits').select('*, exhibition_categories(id, name, kind)').eq('is_active', true),
      supabase.from('exhibition_categories').select('*').order('id'),
    ])
    if (ex.error || ca.error) return { error: ex.error || ca.error }
    return { data: { ex: ex.data, ca: ca.data } }
  }, [])

  const base = useMemo(() => {
    const all = data?.ex || []
    return mode === 'projects' ? all.filter(e => e.exhibition_categories?.kind !== 'archive') : all
  }, [data, mode])

  const cats = (data?.ca || []).filter(c => mode !== 'projects' || c.kind !== 'archive')
  const years = [...new Set(base.map(e => e.year_created).filter(Boolean))].sort((a, b) => b - a)

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    const out = base.filter(e =>
      (!category || String(e.category_id) === String(category)) &&
      (!year || String(e.year_created) === year) &&
      (!course || String(e.course_year) === course) &&
      (!type || e.project_type === type) &&
      (!s || [e.title, e.author_name, e.course_name, e.project_name, e.technology_stack, e.summary]
        .some(v => v && v.toLowerCase().includes(s)))
    )
    out.sort((a, b) =>
      sort === 'title' ? a.title.localeCompare(b.title, 'mn')
        : sort === 'old' ? (a.year_created || 0) - (b.year_created || 0)
          : (b.year_created || 0) - (a.year_created || 0))
    return out
  }, [base, q, category, year, course, type, sort])

  return (
    <section className="page">
      <PageHead
        kicker={mode === 'projects' ? 'Student Projects' : 'Digital Museum'}
        title={mode === 'projects' ? t('projects') : t('museum')}
        lead="Оюутнуудын бүтээл, судалгаа, программ хангамж болон тэнхимийн архивыг хайж, ангилж, шүүнэ."
      />

      <div className="filters glass">
        <input className="search" placeholder="Нэр, зохиогч, хичээл, технологиор хайх..." value={q} onChange={e => setQ(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Бүх ангилал</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={year} onChange={e => setYear(e.target.value)}>
          <option value="">Бүх он</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={course} onChange={e => setCourse(e.target.value)}>
          <option value="">Бүх курс</option>
          {[1, 2, 3, 4].map(c => <option key={c} value={c}>{c}-р курс</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="">Бүх төрөл</option>
          {PROJECT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="new">Шинэ эхэндээ</option>
          <option value="old">Хуучин эхэндээ</option>
          <option value="title">Нэрээр (А–Я)</option>
        </select>
      </div>

      <State loading={loading} error={error} empty count={list.length} />
      {!loading && !error && <p className="muted small">{list.length} үзмэр</p>}

      <div className="grid3">
        {list.map((e, i) => (
          <Reveal key={e.id} delay={(i % 3) * 70}>
            <Link to={`/museum/${e.id}`} className="glass exhibit">
              {e.image_url
                ? <img src={e.image_url} alt={e.title} loading="lazy" />
                : <div className="img-ph">{e.project_type?.[0] || e.exhibition_categories?.name?.[0] || '·'}</div>}
              <div className="exhibit-body">
                <small className="cyan">{e.exhibition_categories?.name} · {e.year_created || '—'}</small>
                <h3>{e.title}</h3>
                <p className="muted clamp">{e.summary || e.description}</p>
                {e.author_name && <small>{e.author_name}{e.course_year ? ` · ${e.course_year}-р курс` : ''}</small>}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
