import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet'
import api from '../utils/api'
import './MapPage.css'

const KTM_CENTER = [27.7172, 85.3240]

function MapController({ areas }) {
  const map = useMap()
  useEffect(() => {
    if (areas.length === 0) return
    const lats = areas.map(a => a.latitude)
    const lngs = areas.map(a => a.longitude)
    map.fitBounds(
      [[Math.min(...lats) - 0.01, Math.min(...lngs) - 0.01],
       [Math.max(...lats) + 0.01, Math.max(...lngs) + 0.01]],
      { padding: [60, 60], maxZoom: 14 }
    )
  }, [areas, map])
  return null
}

function AreaDetail({ slug, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setDetail(null)
    api.get(`/api/areas/${slug}/`)
      .then(r => { setDetail(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  return (
    <aside className="map-aside">
      <button className="map-aside__close" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {loading ? (
        <div className="map-aside__loading">
          <div className="map-aside__spinner" />
          <span>Loading data…</span>
        </div>
      ) : detail ? (
        <>
          <div className="map-aside__header">
            <span className="map-aside__zone">{detail.zone?.replace(/_/g, ' ')}</span>
            <h2 className="map-aside__title">{detail.name}</h2>
            {detail.description && <p className="map-aside__desc">{detail.description}</p>}
          </div>
          <div className="map-aside__entries">
            {detail.entries?.length === 0 ? (
              <p className="map-aside__empty">No data recorded for this area yet.</p>
            ) : detail.entries?.map(entry => (
              <div key={entry.id} className="map-aside__entry">
                <div className="map-aside__entry-header">
                  <span className="map-aside__entry-icon">{entry.category.icon}</span>
                  <span className="map-aside__entry-cat">{entry.category.name}</span>
                </div>
                <div className="map-aside__entry-number">
                  <span className="map-aside__number-label">Number:</span>
                  <span className="map-aside__number-value">{entry.number.toLocaleString()}</span>
                </div>
                <p className="map-aside__entry-desc">
                  <span className="map-aside__number-label">Description:</span> {entry.description}
                </p>
                {entry.source && <p className="map-aside__entry-source">Source: {entry.source}</p>}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="map-aside__empty" style={{padding:'20px'}}>Could not load area data.</p>
      )}
    </aside>
  )
}

export default function MapPage() {
  const { query } = useParams()
  const navigate = useNavigate()
  const [inputVal, setInputVal]     = useState(query ? decodeURIComponent(query) : '')
  const [searchQ, setSearchQ]       = useState(query ? decodeURIComponent(query) : '')
  const [allAreas, setAllAreas]     = useState([])
  const [resultAreas, setResultAreas] = useState([])
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [loading, setLoading]       = useState(false)
  const [resultCount, setResultCount] = useState(null)

  // Load all areas once
  useEffect(() => {
    api.get('/api/areas/')
      .then(r => {
        const data = r.data
        setAllAreas(Array.isArray(data) ? data : (data.results ?? []))
      })
      .catch(() => {})
  }, [])

  // Search whenever searchQ changes
  useEffect(() => {
    if (!searchQ) { setResultAreas([]); setResultCount(null); return }
    setLoading(true)
    api.get(`/api/search/?q=${encodeURIComponent(searchQ)}`)
      .then(r => {
        const results = r.data.results ?? []
        const areaMap = {}
        results.forEach(res => {
          if (!areaMap[res.area_slug]) {
            areaMap[res.area_slug] = {
              slug: res.area_slug, name: res.area_name,
              latitude: res.area_lat, longitude: res.area_lng, zone: res.area_zone,
            }
          }
        })
        const unique = Object.values(areaMap)
        setResultAreas(unique)
        setResultCount(r.data.count)
        setLoading(false)
        if (unique.length === 1) setSelectedSlug(unique[0].slug)
      })
      .catch(() => setLoading(false))
  }, [searchQ])

  const handleSearch = (e) => {
    e.preventDefault()
    if (inputVal.trim()) {
      navigate(`/map/${encodeURIComponent(inputVal.trim())}`)
      setSearchQ(inputVal.trim())
      setSelectedSlug(null)
    }
  }

  const displayAreas = resultAreas.length > 0 ? resultAreas : allAreas
  const dimAreas = allAreas.filter(a => !displayAreas.find(d => d.slug === a.slug))

  return (
    <div className="mappage">
      <div className="mappage__bar">
        <form className="mappage__search" onSubmit={handleSearch}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input className="mappage__search-input" value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Search anything in Kathmandu Valley…" autoFocus />
          <button type="submit" className="mappage__search-btn">Go</button>
        </form>
        {loading && <div className="mappage__loading-bar" />}
        {resultCount !== null && !loading && (
          <div className="mappage__results-meta">
            <span className="mappage__results-count">{resultCount}</span>
            <span> result{resultCount !== 1 ? 's' : ''} for </span>
            <em>"{searchQ}"</em>
          </div>
        )}
      </div>

      <div className={`mappage__layout ${selectedSlug ? 'mappage__layout--aside' : ''}`}>
        <div className="mappage__map-wrap">
          <MapContainer center={KTM_CENTER} zoom={12} className="mappage__map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <MapController areas={displayAreas} />

            {dimAreas.map(area => (
              <CircleMarker key={area.slug} center={[area.latitude, area.longitude]}
                radius={5} pathOptions={{ fillColor: '#3d3428', fillOpacity: 0.5, color: '#5a4d3a', weight: 1 }}
                eventHandlers={{ click: () => setSelectedSlug(area.slug) }} />
            ))}

            {displayAreas.map(area => {
              const active = area.slug === selectedSlug
              return (
                <CircleMarker key={area.slug} center={[area.latitude, area.longitude]}
                  radius={active ? 14 : 9}
                  pathOptions={{
                    fillColor: active ? '#d4a843' : '#b8903a',
                    fillOpacity: active ? 1 : 0.85,
                    color: active ? '#f0e8d4' : '#d4a843',
                    weight: active ? 2.5 : 1.5,
                  }}
                  eventHandlers={{ click: () => setSelectedSlug(area.slug === selectedSlug ? null : area.slug) }}
                />
              )
            })}
          </MapContainer>

          <div className="mappage__legend">
            <div className="mappage__legend-row"><span className="mappage__legend-dot mappage__legend-dot--result" /><span>Search Results</span></div>
            <div className="mappage__legend-row"><span className="mappage__legend-dot mappage__legend-dot--selected" /><span>Selected</span></div>
            <div className="mappage__legend-row"><span className="mappage__legend-dot mappage__legend-dot--dim" /><span>Other Areas</span></div>
          </div>
        </div>

        {selectedSlug && <AreaDetail slug={selectedSlug} onClose={() => setSelectedSlug(null)} />}
      </div>

      {resultCount === 0 && !loading && (
        <div className="mappage__no-results">
          <span className="mappage__no-results-icon">🔍</span>
          <p>No data found for <em>"{searchQ}"</em></p>
          <p className="mappage__no-results-hint">Try: "bars", "temples", "ATMs", or an area name like "Thamel"</p>
        </div>
      )}
    </div>
  )
}
