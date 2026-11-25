function About() {
  const details = [
    ['01', 'Who I Am', 'Computer Science student interested in web development and practical software projects.'],
    ['02', 'What I Do', 'I create responsive interfaces and interactive web applications.'],
    ['03', 'My Goal', 'To improve technical skills by building useful real-world solutions.']
  ]

  return (
    <section id="about">
      <small>ABOUT ME</small>
      <h2>Turning learning into <em>real projects.</em></h2>

      <div className="grid three">
        {details.map(item => (
          <article key={item[0]}>
            <b>{item[0]}</b>
            <h3>{item[1]}</h3>
            <p>{item[2]}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default About