import React from 'react'
import './StaticPages.css'

export default function AboutUs() {
  return (
    <div className="static-page">
      <div className="static-page__hero">
        <div className="static-page__hero-deco">◈</div>
        <h1 className="static-page__title">About AS NN</h1>
        <p className="static-page__subtitle">Numbers in Nepal — the anonymous fact-checker for Kathmandu Valley.</p>
      </div>
      <div className="static-page__content">
        <section className="about-grid">
          {[
            { icon: '🔢', title: 'What is AS NN?', body: 'AS NN (Numbers in Nepal) is a public data explorer for Kathmandu Valley. It answers numerical questions about the city — from how many street lights exist in Thamel to how many temples stand in Bhaktapur.' },
            { icon: '🗺️', title: 'How It Works', body: 'Search for any topic or location. The system maps matching areas across the valley and lets you click on any location to reveal the specific number and its context — sourced, verified, and presented plainly.' },
            { icon: '🔒', title: 'Anonymous by Design', body: 'There are no accounts, no cookies, no tracking. The site\'s theme — "Let your inner thoughts be answered anonymously" — is not just a tagline; it is an architectural commitment.' },
            { icon: '📡', title: 'Data Sources', body: 'Data is gathered from municipal records, UNESCO surveys, Nepal government open data, local journalism, and field research. All entries are dated and source-attributed where possible.' },
            { icon: '🛕', title: 'Why Kathmandu Valley?', body: 'The valley contains three UNESCO World Heritage cities — Kathmandu, Patan, and Bhaktapur — and is among the densest concentrations of cultural and civic life in South Asia.' },
            { icon: '🤝', title: 'Contribute', body: 'Think a number is wrong? Have a source we missed? Use the Contact page to submit a correction. All contributions are reviewed before being added to the public record.' },
          ].map(({ icon, title, body }) => (
            <div key={title} className="about-card">
              <span className="about-card__icon">{icon}</span>
              <h3 className="about-card__title">{title}</h3>
              <p className="about-card__body">{body}</p>
            </div>
          ))}
        </section>
        <div className="about-theme-block">
          <blockquote className="about-theme-quote">"Let your inner thoughts be answered anonymously."</blockquote>
          <p className="about-theme-attr">— AS NN, Numbers in Nepal</p>
        </div>
      </div>
    </div>
  )
}
