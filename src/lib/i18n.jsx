import { createContext, useContext, useState } from 'react'

const DICT = {
  mn: {
    home: 'Нүүр', about: 'Тэнхимийн тухай', museum: 'Цахим музей', projects: 'Оюутны бүтээл',
    teachers: 'Багш нар', activities: 'Арга хэмжээ', gallery: 'Зурагт цомог', categories: 'Ангилал',
    profile: 'Профайл', login: 'Нэвтрэх', logout: 'Гарах', register: 'Бүртгүүлэх', admin: 'Админ',
    heroKicker: 'Мэдээллийн Системийн Менежментийн тэнхим · СЭЗИС',
    heroLead: 'Тэнхимийн түүх, багш нар, оюутнуудын бүтээл, арга хэмжээ, зурагт цомгийг нэг дор хадгалсан цахим музей.',
    exploreMuseum: 'Музей үзэх', meetTeachers: 'Багш нартай танилцах',
    featured: 'Онцлох үзмэр', latestProjects: 'Сүүлийн үеийн бүтээл', upcoming: 'Удахгүй болох арга хэмжээ',
    newAlbums: 'Шинэ зурагт цомог', teachersIntro: 'Багш нар', categoriesTitle: 'Үзмэрийн ангилал',
    totalExhibits: 'нийт үзмэр', totalProjects: 'оюутны бүтээл', totalTeachers: 'багш', totalEvents: 'арга хэмжээ',
    search: 'Хайх...', all: 'Бүгд', empty: 'Илэрц олдсонгүй.', loading: 'Ачаалж байна...',
    viewAll: 'Бүгдийг харах', adminFill: 'Мэдээллийг админ нөхнө.',
  },
  en: {
    home: 'Home', about: 'About ISMD', museum: 'Digital Museum', projects: 'Student Projects',
    teachers: 'Teachers', activities: 'Activities', gallery: 'Gallery', categories: 'Categories',
    profile: 'Profile', login: 'Sign in', logout: 'Sign out', register: 'Sign up', admin: 'Admin',
    heroKicker: 'Department of Information Systems Management · UFE',
    heroLead: 'A digital museum preserving the department’s history, teachers, student projects, activities and photo albums in one place.',
    exploreMuseum: 'Explore the museum', meetTeachers: 'Meet the teachers',
    featured: 'Featured exhibits', latestProjects: 'Latest student projects', upcoming: 'Upcoming events',
    newAlbums: 'New photo albums', teachersIntro: 'Teachers', categoriesTitle: 'Exhibit categories',
    totalExhibits: 'exhibits', totalProjects: 'student projects', totalTeachers: 'teachers', totalEvents: 'events',
    search: 'Search...', all: 'All', empty: 'Nothing found.', loading: 'Loading...',
    viewAll: 'View all', adminFill: 'To be completed by the admin.',
  },
}

const Ctx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || 'mn' } catch { return 'mn' }
  })
  const change = l => {
    setLang(l)
    try { localStorage.setItem('lang', l) } catch { /* noop */ }
  }
  const t = k => DICT[lang][k] ?? DICT.mn[k] ?? k
  return <Ctx.Provider value={{ lang, setLang: change, t }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
