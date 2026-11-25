function Modals({ selected, setSelected, certificate, setCertificate }) {
  return (
    <>
      {selected && (
        <div className="detail-modal show" onClick={() => setSelected(null)}>
          <div className="detail-box" onClick={e => e.stopPropagation()}>
            <button className="detail-close" onClick={() => setSelected(null)}>
              ×
            </button>

            <small className="modal-kicker">
              {selected.type === 'project' ? 'PROJECT DETAILS' : 'ARTICLE PREVIEW'}
            </small>

            <span className="tag">{selected.category}</span>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>

            {selected.tech && (
              <div className="detail-tech">
                Technologies: {selected.tech}
              </div>
            )}
          </div>
        </div>
      )}

      {certificate && (
        <div className="certificate-modal show" onClick={() => setCertificate(null)}>
          <div className="certificate-viewer" onClick={e => e.stopPropagation()}>
            <button className="certificate-close" onClick={() => setCertificate(null)}>
              ×
            </button>

            <h3>{certificate.title}</h3>
            <img src={certificate.image} alt={certificate.title} />
          </div>
        </div>
      )}
    </>
  )
}

export default Modals