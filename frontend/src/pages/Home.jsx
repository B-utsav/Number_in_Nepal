import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const SLIDES = [
  { id: 'patan',      label: 'Patan',      subtitle: 'Lalitpur',         image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80' },
  { id: 'basantapur', label: 'Basantapur', subtitle: 'Kathmandu Durbar', image: 'https://images.unsplash.com/photo-1585521374518-b20c41f32a4b?w=1600&q=80' },
  { id: 'bhaktapur',  label: 'Bhaktapur',  subtitle: 'City of Devotees', image: 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=1600&q=80' },
]

const SUGGESTIONS = [
  'How many street lights are in Thamel?',
  'Number of bars in Patan',
  'Temples in Bhaktapur',
  'ATMs near Baneshwor',
  'Police checkpoints in Kalanki',
  'Hospitals in Lalitpur',
]

export default function Home() {
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5200)
    return () => clearInterval(t)
  }, [])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/map/${encodeURIComponent(query.trim())}`)
  }, [query, navigate])

  const handleSuggestion = (s) => {
    setQuery(s)
    navigate(`/map/${encodeURIComponent(s)}`)
  }

  return (
    <div className="home">
      <div className="home__slides">
        {SLIDES.map((s, i) => (
          <div key={s.id} className={`home__slide ${i === slide ? 'home__slide--active' : ''}`}
               style={{ backgroundImage: `url(${s.image})` }} />
        ))}
        <div className="home__overlay" />
        <div className="home__overlay-bottom" />
      </div>

      <div className="home__slide-label">
        <span className="home__slide-label-main">{SLIDES[slide].label}</span>
        <span className="home__slide-label-sub">{SLIDES[slide].subtitle}</span>
      </div>

      <div className="home__dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`home__dot ${i === slide ? 'home__dot--active' : ''}`} onClick={() => setSlide(i)} />
        ))}
      </div>

      <div className="home__hero">
        <div className="home__hero-inner">
          <div className="home__eyebrow">
            <span className="home__eyebrow-line" />
            <span>Kathmandu Valley</span>
            <span className="home__eyebrow-line" />
          </div>

          <h1 className="home__title">
            <span className="home__title-asnn">AS NN</span>
            <span className="home__title-full">Numbers in Nepal</span>
          </h1>

          <p className="home__theme">Let your inner thoughts be answered anonymously</p>

          <form className={`home__search ${focused ? 'home__search--focused' : ''}`} onSubmit={handleSearch}>
            <div className="home__search-inner">
              <svg className="home__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text" className="home__search-input"
                placeholder="What do you want to know? e.g. bars in Thamel…"
                value={query} onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                autoComplete="off"
              />
              <button type="submit" className="home__search-btn">
                <span>Discover</span>
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {focused && (
              <ul className="home__suggestions">
                <li className="home__suggestions-label">Popular queries</li>
                {SUGGESTIONS.map((s, i) => (
                  <li key={i}>
                    <button type="button" className="home__suggestion-btn" onMouseDown={() => handleSuggestion(s)}>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
                        <circle cx="7" cy="7" r="5.5" /><path d="m12.5 12.5 2 2" />
                      </svg>
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="home__stats">
            {[{ value: '20+', label: 'Locations' }, { value: '12', label: 'Categories' }, { value: '34', label: 'Data Points' }, { value: '∞', label: 'Curiosity' }].map(({ value, label }) => (
              <div key={label} className="home__stat">
                <span className="home__stat-value">{value}</span>
                <span className="home__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home__scroll-hint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <span>Explore the Valley</span>
      </div>
    </div>
  )
}
