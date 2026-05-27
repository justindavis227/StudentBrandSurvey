import { useState, useEffect } from 'react'
import { INTRO_IMAGES } from '../constants'

const SLIDE_DURATION = 1050
const MELT_DURATION  = 850
const HEADLINE_HOLD  = 2400
const FADE_DURATION  = 800

export default function Intro({ onComplete }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [phase, setPhase] = useState('slides') // slides | melt | headline | fadeout
  const [showHeadline, setShowHeadline] = useState(false)

  useEffect(() => {
    INTRO_IMAGES.forEach(src => { const img = new Image(); img.src = src })
  }, [])

  // Advance slides slowly; last slide hands off to the melt transition.
  useEffect(() => {
    if (phase !== 'slides') return
    if (slideIndex < INTRO_IMAGES.length - 1) {
      const t = setTimeout(() => setSlideIndex(i => i + 1), SLIDE_DURATION)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setPhase('melt'), SLIDE_DURATION)
    return () => clearTimeout(t)
  }, [slideIndex, phase])

  useEffect(() => {
    if (phase !== 'melt') return
    const t = setTimeout(() => setPhase('headline'), MELT_DURATION)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'headline') return
    const t1 = setTimeout(() => setShowHeadline(true), 60)
    const t2 = setTimeout(() => setPhase('fadeout'), HEADLINE_HOLD)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase])

  useEffect(() => {
    if (phase !== 'fadeout') return
    const t = setTimeout(() => onComplete(), FADE_DURATION)
    return () => clearTimeout(t)
  }, [phase, onComplete])

  const slidesActive = phase === 'slides' || phase === 'melt'
  const frameNum = String(Math.min(slideIndex + 1, INTRO_IMAGES.length)).padStart(2, '0')
  const totalNum = String(INTRO_IMAGES.length).padStart(2, '0')

  return (
    <div className={`intro${phase === 'fadeout' ? ' fade-out' : ''}`}>

      {/* SVG liquify-melt filter (animates only during the melt phase) */}
      <svg className="intro-svg" aria-hidden="true">
        <filter id="intro-melt">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.016" numOctaves="2" seed="7" result="noise">
            {phase === 'melt' && (
              <animate attributeName="baseFrequency" dur="0.85s"
                values="0.012 0.016; 0.02 0.06; 0.04 0.09" fill="freeze" />
            )}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="R" yChannelSelector="G" scale="0">
            {phase === 'melt' && (
              <animate attributeName="scale" dur="0.85s" values="0; 40; 120" fill="freeze" />
            )}
          </feDisplacementMap>
        </filter>
      </svg>

      {/* Slides */}
      <div className={`intro-stage${phase === 'melt' ? ' melting' : ''}`}>
        {INTRO_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`intro-slide${slideIndex === i && slidesActive ? ' visible' : ''}`}
            style={{ backgroundImage: `url("${encodeURI(src)}")` }}
          />
        ))}
      </div>

      {/* Film grain */}
      <div className="intro-grain" />

      {/* Scan-bar glitch — replays on each cut via keyed remount */}
      {phase === 'slides' && <div className="intro-scanbar" key={slideIndex} />}

      {/* Metadata readout */}
      {slidesActive && (
        <div className="intro-meta">
          SE.BRAND&nbsp;//&nbsp;REV&nbsp;2.6<br />
          LOADING&nbsp;·&nbsp;FRAME&nbsp;{frameNum}/{totalNum}
        </div>
      )}

      {/* Dark overlay behind the headline */}
      <div className={`intro-darken${phase === 'headline' || phase === 'fadeout' ? ' on' : ''}`} />

      {/* Headline */}
      <div className={`intro-headline${showHeadline ? ' show' : ''}`}>
        NEW BRAND<br /><span className="glitch" data-text="DOWNLOADING...">DOWNLOADING...</span>
      </div>

    </div>
  )
}
