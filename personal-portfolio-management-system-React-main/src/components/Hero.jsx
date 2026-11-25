function Hero({ projects }) {
  return (
    <section id="home" className="hero">
      <div>
        <small>PERSONAL PORTFOLIO MANAGEMENT SYSTEM</small>

        <h1>
          Ideas into <em>digital experiences.</em>
        </h1>

        <p>
          A modern portfolio platform to showcase skills,
          projects, achievements and professional work in one place.
        </p>

        <a className="btn" href="#projects">View Projects →</a>
        <a className="btn ghost" href="#contact">Contact Me</a>

        <a
          className="btn ghost"
          href="https://www.linkedin.com/in/vishal-kumar-35aa56414/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn ↗
        </a>

        <a
          className="btn ghost"
          href="https://github.com/vishalsingh99547-design"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>

        <div className="stats">
          <div><b>{projects.length}</b><span>Projects</span></div>
          <div><b>6</b><span>Skills</span></div>
          <div><b>100%</b><span>Passion</span></div>
        </div>
      </div>

      <div className="hero-card">
        <div className="avatar">VK</div>
        <small>AVAILABLE FOR</small>
        <h2>Projects & Opportunities</h2>
        <p>● Open to collaboration</p>
        <div className="code">
          HTML • CSS • JavaScript
          <small>Creative • Responsive • Functional</small>
        </div>
      </div>
    </section>
  )
}

export default Hero