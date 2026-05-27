import { useState, useEffect } from 'react'
import { INTRO_IMAGES } from '../constants'

const SLIDE_DURATION = 1200
const HEADLINE_HOLD  = 1800

export default function Intro({ onComplete }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [phase, setPhase] = useState('slides')
  const [showHeadline, setShowHeadline] = useState(false)

  useEffect(() => {
    INTRO_IMAGES.forEach(src => { const img = new Image(); img.src = src })
  }, [])

  useEffect(() => {
    if (phase !== 'slides') return
    if (slideIndex < INTRO_IMAGES.length - 1) {
      const t = setTimeout(() => setSlideIndex(i => i + 1), SLIDE_DURATION)
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
      {INTRO_IMAGES.map((src, i) => (
        <div
          key={src}
          className={`intro-slide${slideIndex === i && phase === 'slides' ? ' visible' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        opacity: phase === 'headline' || phase === 'fadeout' ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }} />

      <div className={`intro-headline${showHeadline ? ' show' : ''}`}>
        WHAT DO YOU THINK<br />OF OUR <span>NEW LOOK?</span>
      </div>
    </div>
  )
}
