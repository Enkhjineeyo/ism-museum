import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Teachers() {
  const [teachers, setTeachers] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('id')
      if (error) setError(error.message)
      else setTeachers(data)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = teachers.filter(t =>
    (t.name + ' ' + (t.courses || '')).toLowerCase().includes(query.toLowerCase())
  )

  if (loading) return <p>Ачаалж байна...</p>
  if (error) return <p className="error">Алдаа: {error}</p>

  return (
    <section>
      <h1>Тэнхимийн багш нар</h1>
      <input
        className="search"
        placeholder="Нэр эсвэл хичээлээр хайх..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {filtered.length === 0 && <p>Илэрц олдсонгүй.</p>}
      <div className="grid">
        {filtered.map(t => (
          <article key={t.id} className="card">
            {t.photo_url && <img src={t.photo_url} alt={t.name} />}
            <h3>{t.name}</h3>
            <p className="muted">{t.position}</p>
            {t.courses && <p><strong>Хичээл:</strong> {t.courses}</p>}
            {t.bio && <p>{t.bio}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}