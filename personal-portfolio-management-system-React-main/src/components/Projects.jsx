function Projects({ projects, filteredProjects, filter, setFilter, search, setSearch, setSelected }) {
  return (
    <section id="projects">
      <small>SELECTED WORK</small>
      <h2>Featured <em>projects.</em></h2>

      <div className="project-tools">
        <div className="searchbox">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filters">
          {['All', 'Web', 'JavaScript'].map(item => (
            <button
              key={item}
              className={filter === item ? 'active' : ''}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid three">
        {filteredProjects.map((project, index) => (
          <article
            className="project-card"
            key={project.id}
            onClick={() => setSelected({ ...project, type: 'project' })}
          >
            <div className="pic">
              <span>0{index + 1}</span>
              <small>VIEW CASE</small>
            </div>

            <div className="body">
              <span className="tag">{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech">{project.tech}</div>
              <span className="open-link">View details →</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects