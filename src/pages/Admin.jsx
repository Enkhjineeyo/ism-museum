import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAsync } from '../lib/useAsync'
import { useAuth } from '../context/AuthContext'
import { ALBUMS, EVENT_TYPES, PROJECT_TYPES } from '../lib/constants'
import { uploadImage } from '../lib/upload'
import { PageHead } from '../components/Ui'

/* Нэг CRUD хүснэгт: нэмэх, засах, устгах, идэвхтэй/идэвхгүй (архив), зураг оруулах */
function AdminTable({ table, fields, titleKey, pk = 'id', order = 'id', beforeSave, hasActive = true, note }) {
  const [editing, setEditing] = useState(null)
  const [msg, setMsg] = useState('')
  const { data: rows, loading, error, reload } = useAsync(
    () => supabase.from(table).select('*').order(order, { ascending: false }), [table])

  const set = (k, v) => setEditing(e => ({ ...e, [k]: v }))

  async function save(e) {
    e.preventDefault()
    setMsg('')
    const { __new, ...raw } = editing
    const payload = {}
    for (const f of fields) {
      let v = raw[f.key]
      if (f.type === 'number' || f.type === 'select-number') v = v === '' || v == null ? null : Number(v)
      else if (f.type === 'bool') v = !!v
      else if (v === '') v = null
      payload[f.key] = v
    }
    if (hasActive && raw.is_active === undefined) payload.is_active = true
    if (beforeSave) beforeSave(payload, __new)
    const q = __new ? supabase.from(table).insert(payload)
      : supabase.from(table).update(payload).eq(pk, raw[pk])
    const { error: err } = await q
    if (err) setMsg(err.message)
    else { setEditing(null); reload() }
  }

  async function remove(r) {
    if (!confirm('Устгах уу? Үүнийг буцаах боломжгүй. Архивлахыг хүсвэл "Идэвхгүй болгох"-ыг ашиглана уу.')) return
    const { error: err } = await supabase.from(table).delete().eq(pk, r[pk])
    if (err) setMsg(err.message); else reload()
  }

  async function toggle(r) {
    const { error: err } = await supabase.from(table).update({ is_active: r.is_active === false }).eq(pk, r[pk])
    if (err) setMsg(err.message); else reload()
  }

  async function onFile(key, file) {
    if (!file) return
    try { set(key, await uploadImage(file, table)) } catch (err) { setMsg(err.message) }
  }

  const initial = Object.fromEntries(fields.map(f => [f.key, f.type === 'bool' ? false : '']))

  return (
    <div>
      {note && <p className="muted small">{note}</p>}
      <button className="btn primary" onClick={() => { setMsg(''); setEditing({ ...initial, __new: true }) }}>+ Шинээр нэмэх</button>
      {msg && <p className="error">{msg}</p>}
      {loading && <p className="muted">Ачаалж байна...</p>}
      {error && <p className="error">{error}</p>}

      <div className="admin-list">
        {(rows || []).map(r => (
          <div key={r[pk]} className={`glass admin-row ${r.is_active === false ? 'off' : ''}`}>
            <div>
              <b>{r[titleKey]}</b>
              {r.is_active === false && <small className="muted"> · архивласан</small>}
            </div>
            <div className="admin-actions">
              <button className="chip" onClick={() => { setMsg(''); setEditing({ ...r }) }}>Засах</button>
              {hasActive && <button className="chip" onClick={() => toggle(r)}>{r.is_active === false ? 'Идэвхжүүлэх' : 'Идэвхгүй болгох'}</button>}
              <button className="chip danger" onClick={() => remove(r)}>Устгах</button>
            </div>
          </div>
        ))}
        {!loading && (rows || []).length === 0 && <p className="muted">Мэдээлэл алга.</p>}
      </div>

      {editing && (
        <div className="modal-back" onClick={() => setEditing(null)}>
          <form className="modal glass form" onClick={e => e.stopPropagation()} onSubmit={save}>
            <button type="button" className="modal-x" onClick={() => setEditing(null)}>✕</button>
            <h3>{editing.__new ? 'Шинээр нэмэх' : 'Засах'}</h3>
            {fields.map(f => (
              <label key={f.key}>{f.label}
                {f.type === 'textarea' ? <textarea rows={4} value={editing[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />
                  : f.type === 'bool' ? <input type="checkbox" checked={!!editing[f.key]} onChange={e => set(f.key, e.target.checked)} />
                    : f.type === 'select' || f.type === 'select-number' ? (
                      <select value={editing[f.key] ?? ''} onChange={e => set(f.key, e.target.value)}>
                        <option value="">—</option>
                        {f.options.map(o => typeof o === 'string'
                          ? <option key={o} value={o}>{o}</option>
                          : <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : f.type === 'image' ? (
                      <>
                        <input value={editing[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} placeholder="URL эсвэл файл оруулах" />
                        <input type="file" accept="image/*" onChange={e => onFile(f.key, e.target.files?.[0])} />
                        {editing[f.key] && <img className="preview" src={editing[f.key]} alt="" />}
                      </>
                    ) : <input type={f.type || 'text'} value={editing[f.key] ?? ''} required={f.required}
                      disabled={f.key === pk && !editing.__new}
                      onChange={e => set(f.key, e.target.value)} />}
              </label>
            ))}
            {msg && <p className="error">{msg}</p>}
            <button className="btn primary">Хадгалах</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default function Admin() {
  const { user, isAdmin, ready } = useAuth()
  const [tab, setTab] = useState('exhibits')
  const { data: cats } = useAsync(() => supabase.from('exhibition_categories').select('id, name').order('id'), [])
  const catOptions = (cats || []).map(c => ({ value: c.id, label: c.name }))

  if (!ready) return <section className="page"><p className="muted">Ачаалж байна...</p></section>
  if (!user) return <section className="page"><p>Админ хэсэгт <Link className="src" to="/login">нэвтэрнэ үү</Link>.</p></section>
  if (!isAdmin) return (
    <section className="page narrow">
      <PageHead kicker="Admin" title="Хандах эрхгүй" />
      <div className="glass form"><p className="muted">Энэ хэсэг зөвхөн админд нээлттэй. Supabase → Table Editor → profiles дээр өөрийн мөрийн <code>role</code>-ийг <code>admin</code> болгоно.</p></div>
    </section>
  )

  const TABS = {
    exhibits: ['Үзмэр, бүтээл', <AdminTable key="ex" table="exhibits" titleKey="title" fields={[
      { key: 'title', label: 'Нэр', required: true },
      { key: 'image_url', label: 'Зураг / Thumbnail', type: 'image' },
      { key: 'summary', label: 'Товч тайлбар', type: 'textarea' },
      { key: 'description', label: 'Дэлгэрэнгүй тайлбар', type: 'textarea' },
      { key: 'category_id', label: 'Ангилал', type: 'select-number', options: catOptions },
      { key: 'project_type', label: 'Бүтээлийн төрөл', type: 'select', options: PROJECT_TYPES },
      { key: 'author_name', label: 'Зохиогч' },
      { key: 'course_year', label: 'Курс (1–4)', type: 'number' },
      { key: 'year_created', label: 'Бүтээсэн он', type: 'number' },
      { key: 'course_name', label: 'Хичээлийн нэр' },
      { key: 'project_name', label: 'Төслийн нэр' },
      { key: 'technology_stack', label: 'Ашигласан технологи' },
      { key: 'demo_url', label: 'Бүтээлийн холбоос (demo)', type: 'url' },
      { key: 'github_url', label: 'GitHub', type: 'url' },
      { key: 'video_url', label: 'Видео холбоос', type: 'url' },
      { key: 'source_url', label: 'Эх сурвалж', type: 'url' },
      { key: 'is_featured', label: 'Онцлох', type: 'bool' },
    ]} beforeSave={(p, isNew) => { if (isNew) p.creator_id = user.id }} />],
    teachers: ['Багш нар', <AdminTable key="t" table="teachers" titleKey="name" fields={[
      { key: 'name', label: 'Овог, нэр', required: true },
      { key: 'photo_url', label: 'Зураг', type: 'image' },
      { key: 'position', label: 'Албан тушаал' },
      { key: 'education', label: 'Боловсрол', type: 'textarea' },
      { key: 'bio', label: 'Мэргэжлийн танилцуулга', type: 'textarea' },
      { key: 'experience', label: 'Мэргэжлийн туршлага', type: 'textarea' },
      { key: 'courses', label: 'Заадаг хичээлүүд', type: 'textarea' },
      { key: 'research', label: 'Судалгааны чиглэл', type: 'textarea' },
      { key: 'certificates', label: 'Сертификат', type: 'textarea' },
      { key: 'publications', label: 'Бүтээл, судалгаа', type: 'textarea' },
      { key: 'source_url', label: 'Холбоос', type: 'url' },
    ]} />],
    events: ['Арга хэмжээ', <AdminTable key="e" table="events" titleKey="title" order="event_date" fields={[
      { key: 'title', label: 'Нэр', required: true },
      { key: 'event_type', label: 'Төрөл', type: 'select', options: EVENT_TYPES },
      { key: 'event_date', label: 'Огноо', type: 'date' },
      { key: 'location', label: 'Байршил' },
      { key: 'organizer', label: 'Зохион байгуулагч' },
      { key: 'participants', label: 'Оролцогчид' },
      { key: 'purpose', label: 'Зорилго', type: 'textarea' },
      { key: 'description', label: 'Товч тайлбар', type: 'textarea' },
      { key: 'cover_image_url', label: 'Нүүр зураг', type: 'image' },
      { key: 'source_url', label: 'Facebook / Instagram холбоос', type: 'url' },
    ]} />],
    gallery: ['Зурагт цомог', <AdminTable key="g" table="gallery_photos" titleKey="title" fields={[
      { key: 'image_url', label: 'Зураг', type: 'image' },
      { key: 'album', label: 'Цомог', type: 'select', options: ALBUMS, required: true },
      { key: 'title', label: 'Зургийн нэр' },
      { key: 'event_title', label: 'Арга хэмжээний нэр' },
      { key: 'photo_date', label: 'Огноо', type: 'date' },
      { key: 'description', label: 'Тайлбар', type: 'textarea' },
      { key: 'source_url', label: 'Эх сурвалжийн холбоос', type: 'url' },
    ]} note="Зургийг зөвхөн зөвшөөрөлтэй, эх сурвалжийн холбоостой оруулна." />],
    categories: ['Ангилал', <AdminTable key="c" table="exhibition_categories" titleKey="name" hasActive={false} fields={[
      { key: 'name', label: 'Нэр (МН)', required: true },
      { key: 'name_en', label: 'Нэр (EN)' },
      { key: 'kind', label: 'Төрөл', type: 'select', options: ['project', 'archive'] },
      { key: 'description', label: 'Тайлбар', type: 'textarea' },
    ]} />],
    courses: ['Хичээл', <AdminTable key="co" table="courses" titleKey="name" order="code" fields={[
      { key: 'code', label: 'Код', required: true },
      { key: 'name', label: 'Нэр', required: true },
      { key: 'course_year', label: 'Курс (1–4)', type: 'number' },
      { key: 'description', label: 'Тайлбар', type: 'textarea' },
      { key: 'source_url', label: 'Эх сурвалж', type: 'url' },
    ]} />],
    history: ['Түүх', <AdminTable key="h" table="history_milestones" titleKey="title" hasActive={false} order="year" fields={[
      { key: 'year', label: 'Он', type: 'number', required: true },
      { key: 'title', label: 'Гарчиг', required: true },
      { key: 'description', label: 'Тайлбар', type: 'textarea' },
      { key: 'category', label: 'Төрөл', type: 'select', options: ['faculty', 'award', 'research', 'tech'] },
    ]} />],
    info: ['Тэнхимийн тухай', <AdminTable key="i" table="site_info" pk="key" titleKey="label" hasActive={false} order="key" fields={[
      { key: 'key', label: 'Түлхүүр', required: true },
      { key: 'label', label: 'Гарчиг' },
      { key: 'value', label: 'Агуулга', type: 'textarea' },
    ]} note="Зорилго, алсын хараа, түүх, уламжлал зэргийг баталгаатай эх сурвалжаар нөхнө." />],
  }

  return (
    <section className="page">
      <PageHead kicker="Admin panel" title="Удирдлага" />
      <div className="chips">
        {Object.entries(TABS).map(([k, [label]]) => (
          <button key={k} className={`chip ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>
      {TABS[tab][1]}
    </section>
  )
}
