import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#beranda" className="brand" onClick={closeMenu}>
          <span className="brand-mark">
            <span className="brand-mark-line" />
            <span className="brand-mark-dot" />
          </span>

          <span>
            <strong>SIAKAD</strong>
            <small>SMA</small>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Buka menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-menu ${menuOpen ? 'is-open' : ''}`}>
          <a href="#beranda" onClick={closeMenu}>Beranda</a>
          <a href="#fitur" onClick={closeMenu}>Fitur</a>
          <a href="#tentang" onClick={closeMenu}>Tentang</a>
          <a href="/login" className="nav-login" onClick={closeMenu}>
            Masuk ke SIAKAD
            <span>↗</span>
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar