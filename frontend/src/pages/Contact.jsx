import React, { useState } from 'react'
import './StaticPages.css'

export default function Contact() {
  const [form, setForm] = useState({ type: 'correction', message: '', area: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => { e.preventDefault(); setSent(true) }

  return (
    <div className="static-page">
      <div className="static-page__hero">
        <div className="static-page__hero-deco">◈</div>
        <h1 className="static-page__title">Contact</h1>
        <p className="static-page__subtitle">Anonymous submissions welcome — no name required.</p>
      </div>
      <div className="static-page__content">
        <div className="contact-layout">
          <div className="contact-info">
            <h2 className="contact-info__heading">Reach Out</h2>
            <p className="contact-info__body">AS NN is a public service. If you have a correction, a new data point, or simply a question — this form is for you.</p>
            <div className="contact-reasons">
              {[{ icon: '✏️', label: 'Data Correction' }, { icon: '➕', label: 'New Data Submission' }, { icon: '🐛', label: 'Bug Report' }, { icon: '💬', label: 'General Inquiry' }].map(({ icon, label }) => (
                <div key={label} className="contact-reason"><span>{icon}</span><span>{label}</span></div>
              ))}
            </div>
            <div className="contact-note">
              <span className="contact-note__icon">🔒</span>
              <p>No personal data is required. This form is submitted anonymously.</p>
            </div>
          </div>

          {sent ? (
            <div className="contact-success">
              <span className="contact-success__icon">✓</span>
              <h3>Received</h3>
              <p>Your submission has been anonymously recorded. We'll review it shortly.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__field">
                <label className="contact-form__label">Type of Submission</label>
                <select className="contact-form__select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="correction">Data Correction</option>
                  <option value="new-data">New Data Point</option>
                  <option value="bug">Bug Report</option>
                  <option value="inquiry">General Inquiry</option>
                </select>
              </div>
              <div className="contact-form__field">
                <label className="contact-form__label">Area (optional)</label>
                <input className="contact-form__input" type="text" placeholder="e.g. Thamel, Patan, Bhaktapur…" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} />
              </div>
              <div className="contact-form__field">
                <label className="contact-form__label">Your Message</label>
                <textarea className="contact-form__textarea" placeholder="Describe the correction, new data point, or your question…" rows={6} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
              </div>
              <button type="submit" className="contact-form__submit">
                Submit Anonymously
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
