import { useState, useEffect, useRef } from 'react'
import { INTRO_IMAGES } from '../constants'

const SLIDE_DURATION = 600
const HEADLINE_HOLD  = 1800
const FLASH_DURATION = 120
const STREAK_DURATION = 200

export default function Intro({ onComplete }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [phase, setPhase] = useState('slides')
  const [showHeadline, setShowHeadline] = useState(false)
  const [flashing, setFlashing] = useState(false)
  const [streaking, setStreaking] = useState(false)
  const streakRef = useRef({ angle: 45, x: 50 })

  useEffect(() => {
    INTRO_IMAGES.forEach(src => { const img = new Image(); img.src = src })
  }, [])

  function triggerFlare(cb) {
    // Randomize streak angle and position each time
    streakRef.current = {
      angle: 30 + Math.random() * 60,
      x: 20 + Math.random() * 60,
    }
    setFlashing(true)
    setStreaking(true)
    setTimeout(() => setFlashing(false), FLASH_DURATION)
    setTimeout(() => {
      setStreaking(false)
      cb()
    }, STREAK_DURATION)
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

  const { angle, x } = streakRef.current

  return (
    <div className={`intro${phase === 'fadeout' ? ' fade-out' : ''}`}>

      {/* Slides */}
      {INTRO_IMAGES.map((src, i) => (
        <div
          key={src}
          className={`intro-slide${slideIndex === i && phase === 'slides' ? ' visible' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      {/* Flash bloom */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)',
        opacity: flashing ? 1 : 0,
        transition: flashing ? 'opacity 0.04s ease' : 'opacity 0.12s ease',
        pointerEvents: 'none',
        zIndex: 5,
      }} />

      {/* Light streak */}
      <div style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 6,
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: `${x}%`,
          width: '3px',
          height: '140%',
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.9) 30%, rgba(255,255,240,1) 50%, rgba(255,255,255,0.9) 70%, transparent)',
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'center center',
          opacity: streaking ? 1 : 0,
          transition: streaking ? 'opacity 0.03s ease' : 'opacity 0.18s ease',
          filter: 'blur(1px)',
          boxShadow: '0 0 12px 4px rgba(255,255,220,0.6), 0 0 30px 8px rgba(255,255,200,0.3)',
        }} />
        {/* Secondary thinner streak offset slightly */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: `${x + 1.5}%`,
          width: '1px',
          height: '140%',
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 60%, transparent)',
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'center center',
          opacity: streaking ? 0.7 : 0,
          transition: streaking ? 'opacity 0.03s ease' : 'opacity 0.18s ease',
          filter: 'blur(0.5px)',
        }} />
      </div>

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
        WHAT DO YOU THINK<br />OF OUR <span>NEW LOOK?</span>
      </div>

    </div>
  )
}
