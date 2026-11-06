import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAsync } from '../lib/useAsync'
import Reveal from '../components/Reveal'
import { PageHead, State } from '../components/Ui'

export default function Categories() {
  const { data, loading, error } = useAsync(
    () => supabase.from('exhibition_categories').select('*, exhibits(count)').order('id'), [])

  return (
    <section className="page">
      <PageHead kicker="Exhibit Categories" title="Үзмэрийн ангилал"
        lead="Ангилал тус бүрийн үзмэрийн тоо. Ангилал дээр дарж үзмэрүүдийг шүүнэ." />
      <State loading={loading} error={error} empty count={(data || []).length} />
      <div className="grid3">
        {(data || []).map((c, i) => (
          <Reveal key={c.id} delay={(i % 3) * 70}>
            <Link to={`/museum?category=${c.id}`} className="glass card-pad cat">
              <span className="count">{c.exhibits?.[0]?.count ?? 0}</span>
              <h3>{c.name}</h3>
              {c.name_en && <small className="cyan">{c.name_en}</small>}
              <p className="muted clamp">{c.description}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
