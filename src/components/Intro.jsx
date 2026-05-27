import { useState, useEffect } from 'react'
import { INTRO_IMAGES } from '../constants'

const SLIDE_DURATION = 400
const HEADLINE_HOLD  = 1800
const FLASH_DURATION = 80

export default function Intro({ onComplete }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [phase, setPhase] = useState('slides')
  const [showHeadline, setShowHeadline] = useState(false)
  const [flashing, setFlashing] = useState(false)

  useEffect(() => {
    INTRO_IMAGES.forEach(src => { const img = new Image(); img.src = src })
  }, [])

  function triggerFlare(cb) {
    setFlashing(true)
    setTimeout(() => {
      setFlashing(false)
      cb()
    }, FLASH_DURATION)
  }

  useEffect(() => {
    if (phase !== 'slides') return
    if (slideIndex < INTRO_IMAGES.length - 1) {
      const t = setTimeout(() => {
        triggerFlare(() => setSlideIndex(i => i + 1))
      }, SLIDE_DURATION)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setPhase('headline'), SLIDE_DURATION)
      return () => clearTimeout(t)
    }
  }, [slideIndex, phase])

  useEffect(() => {
    if (phase !== 'headline') return
    const t1 = setTimeout(() => setShowHeadline(true), 50)
    const t2 = setTimeout(() => setPhase('fadeout'), HEADLINE_HOLD)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase])

  useEffect(() => {
    if (phase !== 'fadeout') return
    const t = setTimeout(() => onComplete(), 700)
    return () => clearTimeout(t)
  }, [phase, onComplete])

  return (
    <div className={`intro${phase === 'fadeout' ? ' fade-out' : ''}`}>

      {/* Slides */}
      {INTRO_IMAGES.map((src, i) => (
        <div
          key={src}
          className={`intro-slide${slideIndex === i && phase === 'slides' ? ' visible' : ''}`}
          style={{ backgroundImage: `url("${encodeURI(src)}")` }}
        />
      ))}

      {/* Flash bloom */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 40%, transparent 70%)',
        opacity: flashing ? 1 : 0,
        transition: flashing ? 'opacity 0.04s ease' : 'opacity 0.12s ease',
        pointerEvents: 'none',
        zIndex: 5,
      }} />

      {/* Dark overlay for headline */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.78)',
        opacity: phase === 'headline' || phase === 'fadeout' ? 1 : 0,
        transition: 'opacity 0.6s ease',
        zIndex: 7,
      }} />

      {/* Headline */}
      <div className={`intro-headline${showHeadline ? ' show' : ''}`} style={{ zIndex: 8 }}>
        NEW BRAND<br /><span>DOWNLOADING...</span>
      </div>

    </div>
  )
}
