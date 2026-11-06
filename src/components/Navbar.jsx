import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">ISM Digital Museum</NavLink>
      <div className="links">
        <NavLink to="/">Нүүр</NavLink>
        <NavLink to="/teachers">Багш нар</NavLink>
      </div>
    </nav>
  )
}