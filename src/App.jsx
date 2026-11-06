import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import ShaderBackground from './components/ShaderBackground'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Museum from './pages/Museum'
import ExhibitDetail from './pages/ExhibitDetail'
import Teachers from './pages/Teachers'
import Activities from './pages/Activities'
import Gallery from './pages/Gallery'
import Categories from './pages/Categories'
import Profile from './pages/Profile'
import { Login, Register } from './pages/Auth'
import Admin from './pages/Admin'
import { SOURCES } from './lib/constants'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ShaderBackground />
      <div className="veil" />
      <ScrollTop />
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/museum" element={<Museum mode="museum" />} />
          <Route path="/museum/:id" element={<ExhibitDetail />} />
          <Route path="/projects" element={<Museum mode="projects" />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <div>
          <b>ISM Digital Museum</b>
          <span>Мэдээллийн Системийн Менежментийн тэнхим · СЭЗИС</span>
        </div>
        <div className="foot-links">
          {SOURCES.map(([l, u]) => <a key={u} href={u} target="_blank" rel="noreferrer">{l}</a>)}
        </div>
      </footer>
    </>
  )
}
