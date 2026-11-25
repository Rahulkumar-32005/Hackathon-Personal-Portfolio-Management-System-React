function Skills({ skills }) {
  return (
    <section id="skills" className="dark skills-section">
      <small>EXPERTISE</small>
      <h2>Skills, tools & <em>technologies.</em></h2>

      <div className="skill-showcase">
        <div className="skill-groups">
          {skills.map((skill, index) => (
            <article className="skill-card" key={skill[0]}>
              <div className="skill-number">0{index + 1}</div>

              <div className="skill-card-head">
                <div>
                  <span className="skill-category">{skill[2]}</span>
                  <h3>{skill[0]}</h3>
                </div>
                <strong>{skill[3]}</strong>
              </div>

              <p>{skill[1]}</p>

              <div className="bar">
                <i style={{ width: skill[3] }}></i>
              </div>

              <div className="skill-foot">
                <span>Project-ready</span>
                <span>↗</span>
              </div>
            </article>
          ))}
        </div>

        <aside className="toolkit-card">
          <small>MY TOOLKIT</small>
          <h3>Building clean interfaces with purpose.</h3>
          <p>
            I combine structure, visual design and JavaScript
            interactions to create useful web experiences.
          </p>

          <div className="tech-cloud">
            {['HTML5', 'CSS3', 'JavaScript', 'React', 'Git & GitHub', 'LocalStorage'].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Skills