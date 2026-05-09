import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import History from './pages/History'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/map"        element={<MapPage />} />
        <Route path="/map/:query" element={<MapPage />} />
        <Route path="/history"    element={<History />} />
        <Route path="/about"      element={<AboutUs />} />
        <Route path="/contact"    element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}
