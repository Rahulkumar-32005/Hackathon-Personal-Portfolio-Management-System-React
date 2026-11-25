function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Message submitted successfully!')
    e.target.reset()
  }

  return (
    <section id="contact" className="contact contact-modern">
      <div className="contact-copy">
        <small>GET IN TOUCH</small>
        <h2>Let's build something <em>worth showing.</em></h2>
        <p>
          Have a project idea, collaboration thought or feedback?
          Send a message.
        </p>
      </div>

      <form className="contact-card" onSubmit={handleSubmit}>
        <h3>Start a conversation</h3>

        <label>Name<input required placeholder="Your name" /></label>
        <label>Email<input type="email" required placeholder="Your email" /></label>
        <label>Subject<input required placeholder="Subject" /></label>
        <label>Message<textarea rows="5" required placeholder="Your message"></textarea></label>

        <button className="btn" type="submit">Send Message →</button>
      </form>
    </section>
  )
}

export default Contact