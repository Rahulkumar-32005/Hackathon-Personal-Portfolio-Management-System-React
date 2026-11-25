function Footer() {
  return (
    <footer>
      <a className="brand" href="#home">
        <b>V</b> Vishal
      </a>

      <span>
        Personal Portfolio Management System • © 2026
      </span>

      <button
        className="backtop"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </footer>
  )
}

export default Footer