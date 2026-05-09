import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import './StaticPages.css'

export default function History() {
  const navigate = useNavigate()
  const [recent, setRecent] = useState([])

  useEffect(() => {
    api.get('/api/recent-searches/')
      .then(r => setRecent(r.data.recent || []))
      .catch(() => {})
  }, [])

  return (
    <div className="static-page">
      <div className="static-page__hero">
        <div className="static-page__hero-deco">◈</div>
        <h1 className="static-page__title">History</h1>
        <p className="static-page__subtitle">Anonymous search traces — no identities, only curiosity.</p>
      </div>

      <div className="static-page__content">
        <section className="history-section">
          <h2 className="history-section__heading">
            <span>Recent Searches</span>
            <span className="history-section__badge">Anonymous</span>
          </h2>
          <p className="history-section__intro">
            These are the questions the Valley has been whispering about. No users, no tracking — only the questions themselves.
          </p>
          {recent.length === 0 ? (
            <div className="history-empty">
              <span className="history-empty__icon">🌫</span>
              <p>No searches recorded yet. Be the first to ask.</p>
            </div>
          ) : (
            <ul className="history-list">
              {recent.map((q, i) => (
                <li key={i} className="history-item" onClick={() => navigate(`/map/${encodeURIComponent(q)}`)}
                    style={{ animationDelay: `${i * 0.07}s` }}>
                  <span className="history-item__num">0{i + 1}</span>
                  <span className="history-item__query">{q}</span>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="history-section">
          <h2 className="history-section__heading"><span>About This Feature</span></h2>
          <p className="history-section__text">
            AS NN logs only the text of your search query and the number of results returned — nothing else. No IP addresses, no session IDs, no fingerprints.
          </p>
          <p className="history-section__text">
            The History page reflects the collective curiosity of all visitors, giving you a sense of what others are wondering about Kathmandu Valley.
          </p>
        </section>
      </div>
    </div>
  )
}
