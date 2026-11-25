function Certificates({ certificates, setCertificate }) {
  return (
    <section id="achievements" className="dark achievements-section">
      <small>PROOF OF LEARNING</small>
      <h2>Achievements & <em>certificates.</em></h2>

      <div className="certificate-grid">
        {certificates.map(item => (
          <article
            className="certificate-card"
            key={item.title}
            onClick={() => setCertificate(item)}
          >
            <div className="certificate-thumb">
              <img src={item.image} alt={item.title} />
              <span>VIEW CERTIFICATE ↗</span>
            </div>

            <div className="certificate-info">
              <span className="tag">CERTIFICATE / SHOWCASE</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <small>Click to view</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Certificates