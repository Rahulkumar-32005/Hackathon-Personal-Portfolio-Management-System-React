function Navbar({ menuOpen, setMenuOpen, ThemeButton }) {
  return (
    <header>
      <a className="brand" href="#home">
        <b>V</b> Vishal
      </a>

      <button id="menu" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <nav className={menuOpen ? 'mobile-open' : ''}>
        <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#skills" onClick={() => setMenuOpen(false)}>Skills</a>
        <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
        <a href="#achievements" onClick={() => setMenuOpen(false)}>Achievements</a>
        <a href="#blog" onClick={() => setMenuOpen(false)}>Blog</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        <a className="login" href="/login">Login</a>
        <ThemeButton />
      </nav>
    </header>
  )
}

export default Navbar