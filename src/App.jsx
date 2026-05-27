import { useState, useCallback } from 'react'
import { supabase } from './lib/supabase'
import { LOGO_OPTIONS, ILLUS_OPTIONS, COLOR_OPTIONS } from './constants'
import Intro from './components/Intro'
import TagGrid from './components/TagGrid'

const TOTAL_STEPS = 6

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const [titleReveal, setTitleReveal] = useState(false)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [likes, setLikes] = useState([])
  const [likeOther, setLikeOther] = useState('')
  const [dislikes, setDislikes] = useState([])
  const [dislikeOther, setDislikeOther] = useState('')
  const [logo, setLogo] = useState(null)
  const [colors, setColors] = useState([])
  const [illustrations, setIllustrations] = useState([])
  const [rawThoughts, setRawThoughts] = useState('')

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
    setTimeout(() => setTitleReveal(true), 100)
  }, [])

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function goTo(next) { setStep(next); scrollTop() }

  function toggleColor(val) {
    if (colors.includes(val)) { setColors(colors.filter(v => v !== val)); return }
    if (colors.length >= 2) return
    setColors([...colors, val])
  }

  function toggleIllus(val) {
    if (illustrations.includes(val)) { setIllustrations(illustrations.filter(v => v !== val)); return }
    if (illustrations.length >= 3) return
    setIllustrations([...illustrations, val])
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError('')
    const { error } = await supabase.from('survey_responses').insert([{
      likes,
      like_other: likeOther,
      dislikes,
      dislike_other: dislikeOther,
      logo,
      colors,
      illustrations,
      raw_thoughts: rawThoughts,
    }])
    if (error) {
      setSubmitError('Something went wrong. Please try again.')
      setSubmitting(false)
    } else {
      setSubmitted(true)
      scrollTop()
    }
  }

  if (!introComplete) return <Intro onComplete={handleIntroComplete} />

  if (submitted) return (
    <>
      <div className="stripe-bar" />
      <div className="wrap">
        <div className="thankyou">
          <span className="ty-mark">✦</span>
          <div className="ty-title">Thanks for<br />weighing in.</div>
          <p className="ty-sub">Your feedback genuinely shapes where this goes next.<br />We appreciate you taking the time.</p>
        </div>
      </div>
    </>
  )

  return (
    <>
      <div className="stripe-bar" />
      <div className="wrap">

        <div className="header">
          <div className="eyebrow">Southeast Students · Brand Survey</div>
          <h1 className={`site-title${titleReveal ? ' reveal' : ''}`}>
            What do you<br />think of our<br /><span>new look?</span>
          </h1>
          <p className={`header-sub${titleReveal ? ' reveal' : ''}`}>
            Six quick questions. Your input helps us nail the direction that feels most like us.
          </p>
        </div>

        <div className="progress-wrap">
          <div className="progress-dots">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className={`dot${i + 1 === step ? ' active' : i + 1 < step ? ' done' : ''}`} />
            ))}
          </div>
          <div className="progress-label">Question {step} of {TOTAL_STEPS}</div>
        </div>

        {step === 1 && (
          <div className="card" key="q1">
            <div className="q-number">Question 01</div>
            <div className="q-text">Select the top 3 things you like most about this brand guide.</div>
            <div className="max-hint"><em>{likes.length}</em>/3 selected</div>
            <TagGrid type="like" selected={likes} otherText={likeOther} onChange={setLikes} onOtherChange={setLikeOther} />
            <div className="nav-row">
              <span />
              <button className="btn btn-next" disabled={likes.length < 3} onClick={() => goTo(2)}>Next →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card" key="q2">
            <div className="q-number">Question 02</div>
            <div className="q-text">Select the 3 things you least like in the brand guide.</div>
            <div className="max-hint"><em>{dislikes.length}</em>/3 selected</div>
            <TagGrid type="dislike" selected={dislikes} otherText={dislikeOther} onChange={setDislikes} onOtherChange={setDislikeOther} />
            <div className="nav-row">
              <button className="btn btn-back" onClick={() => goTo(1)}>← Back</button>
              <button className="btn btn-next" disabled={dislikes.length < 3} onClick={() => goTo(3)}>Next →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card" key="q3">
            <div className="q-number">Question 03</div>
            <div className="q-text">Of the six logos, which one do you like most?</div>
            <div className="q-sub">Think about what you'd want on a shirt, a social post, or the stage screen.</div>
            <div className="logo-grid">
              {LOGO_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`logo-opt${logo === opt.value ? ' sel' : ''}`}
                  onClick={() => setLogo(opt.value)}
                >
                  <div className="opt-badge">{opt.value}</div>
                  <div className="logo-img-wrap">
                    <img src={opt.img} alt={opt.label} />
                  </div>
                  <div className="opt-name">{opt.label}</div>
                  <div className="opt-desc">{opt.desc}</div>
                </div>
              ))}
            </div>
            <div className="nav-row">
              <button className="btn btn-back" onClick={() => goTo(2)}>← Back</button>
              <button className="btn btn-next" disabled={!logo} onClick={() => goTo(4)}>Next →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card" key="q4">
            <div className="q-number">Question 04</div>
            <div className="q-text">Choose your top 2 preferred brand colors.</div>
            <div className="max-hint"><em>{colors.length}</em>/2 selected</div>
            <div className="color-grid">
              {COLOR_OPTIONS.map(opt => {
                const isSel = colors.includes(opt.value)
                const isMaxed = colors.length >= 2 && !isSel
                return (
                  <div
                    key={opt.value}
                    className={`color-opt${isSel ? ' sel' : ''}${isMaxed ? ' maxed' : ''}`}
                    onClick={() => toggleColor(opt.value)}
                  >
                    <div className="color-swatch" style={{ background: opt.hex, border: opt.border ? '1px solid #333' : 'none' }} />
                    <div className="color-name">{opt.label}</div>
                    <div className="color-sub">{opt.hex.toUpperCase()}</div>
                  </div>
                )
              })}
            </div>
            <div className="nav-row">
              <button className="btn btn-back" onClick={() => goTo(3)}>← Back</button>
              <button className="btn btn-next" disabled={colors.length < 2} onClick={() => goTo(5)}>Next →</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="card" key="q5">
            <div className="q-number">Question 05</div>
            <div className="q-text">Choose your top 3 illustrations.</div>
            <div className="max-hint"><em>{illustrations.length}</em>/3 selected</div>
            <div className="illus-grid">
              {ILLUS_OPTIONS.map((opt, i) => {
                const isSel = illustrations.includes(opt.value)
                const isMaxed = illustrations.length >= 3 && !isSel
                return (
                  <div
                    key={opt.value}
                    className={`illus-opt${isSel ? ' sel' : ''}${isMaxed ? ' maxed' : ''}`}
                    onClick={() => toggleIllus(opt.value)}
                  >
                    <div className="illus-badge">{i + 1}</div>
                    <div className="illus-img-wrap">
                      <img src={opt.img} alt={opt.label} />
                    </div>
                    <div className="illus-name">{opt.label}</div>
                  </div>
                )
              })}
            </div>
            <div className="nav-row">
              <button className="btn btn-back" onClick={() => goTo(4)}>← Back</button>
              <button className="btn btn-next" disabled={illustrations.length < 3} onClick={() => goTo(6)}>Next →</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="card" key="q6">
            <div className="q-number">Question 06</div>
            <div className="q-text">Raw thoughts: Anything else you want to let us know?</div>
            <div className="q-sub">Totally optional — even a few words help.</div>
            <div className="char-wrap">
              <textarea
                maxLength={500}
                placeholder="Type your thoughts here..."
                value={rawThoughts}
                onChange={e => setRawThoughts(e.target.value)}
              />
              <div className={`char-count${rawThoughts.length >= 500 ? ' at' : rawThoughts.length >= 400 ? ' near' : ''}`}>
                {rawThoughts.length} / 500
              </div>
            </div>
            {submitError && <div className="submit-error">{submitError}</div>}
            <div className="nav-row">
              <button className="btn btn-back" onClick={() => goTo(5)}>← Back</button>
              <button className="btn btn-submit" disabled={submitting} onClick={handleSubmit}>
                {submitting ? 'Submitting...' : 'Submit ✦'}
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
