function Blogs({ blogs, setSelected }) {
  return (
    <section id="blog">
      <small>THOUGHTS & LEARNING</small>
      <h2>Latest <em>articles.</em></h2>

      <div className="grid three">
        {blogs.map(blog => (
          <article
            className="blog-card"
            key={blog.id}
            onClick={() => setSelected({ ...blog, type: 'blog' })}
          >
            <span className="tag">{blog.category}</span>
            <h3>{blog.title}</h3>
            <p>{blog.description}</p>
            <span className="open-link">Read preview →</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Blogs