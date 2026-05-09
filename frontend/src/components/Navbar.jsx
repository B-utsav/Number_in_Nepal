import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Home',     to: '/' },
  { label: 'History',  to: '/history' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact',  to: '/contact' },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-asnn">AS NN</span>
          <span className="navbar__logo-tag">Numbers in Nepal</span>
        </Link>

        <ul className="navbar__links">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link to={to} className={`navbar__link ${location.pathname === to ? 'navbar__link--active' : ''}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <span className="navbar__theme">Let your inner thoughts be answered</span>

        <button className={`navbar__hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(v => !v)}>
          <span /><span /><span />
        </button>
      </div>

      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}>
        {NAV_LINKS.map(({ label, to }) => (
          <Link key={to} to={to} className={`navbar__drawer-link ${location.pathname === to ? 'active' : ''}`}>
            {label}
          </Link>
        ))}
        <p className="navbar__drawer-theme">Let your inner thoughts<br />be answered anonymously</p>
      </div>
    </nav>
  )
}
