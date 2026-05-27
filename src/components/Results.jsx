import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { TAG_OPTIONS, LOGO_OPTIONS, COLOR_OPTIONS, ILLUS_OPTIONS } from '../constants'

function tally(responses, field, options) {
  const counts = Object.fromEntries(options.map(o => [o.value, 0]))
  for (const r of responses) {
    const v = r[field]
    if (Array.isArray(v)) v.forEach(x => { if (x in counts) counts[x]++ })
    else if (v != null && v in counts) counts[v]++
  }
  return options
    .map(o => ({ ...o, count: counts[o.value] }))
    .sort((a, b) => b.count - a.count)
}

function OtherDropdown({ items }) {
  const [open, setOpen] = useState(false)
  if (items.length === 0) return null
  return (
    <div className="other-drop">
      <button className="raw-toggle" onClick={() => setOpen(o => !o)}>
        <span>"Other" answers ({items.length})</span>
        <span className={`raw-caret${open ? ' open' : ''}`}>▾</span>
      </button>
      {open && (
        <ul className="other-list-results">
          {items.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      )}
    </div>
  )
}

function BarChart({ rows, accent }) {
  const max = Math.max(1, ...rows.map(r => r.count))
  return (
    <div className="bar-chart">
      {rows.map(r => (
        <div className="bar-row" key={r.value}>
          <div className="bar-label">
            {r.swatch && <span className="bar-swatch" style={{ background: r.swatch }} />}
            {r.label}
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(r.count / max) * 100}%`, background: r.count ? accent : 'transparent' }}
            />
          </div>
          <div className="bar-count">{r.count}</div>
        </div>
      ))}
    </div>
  )
}

export default function Results() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [rawOpen, setRawOpen] = useState(false)
  const [summary, setSummary] = useState('')
  const [summaryState, setSummaryState] = useState('idle') // idle | loading | done | unavailable

  useEffect(() => {
    let mounted = true
    supabase
      .from('survey_responses')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!mounted) return
        setResponses(data || [])
        setLoading(false)
      })

    const channel = supabase
      .channel('survey_responses_live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'survey_responses' },
        payload => setResponses(prev =>
          prev.some(r => r.id === payload.new.id) ? prev : [payload.new, ...prev]
        )
      )
      .subscribe()

    return () => { mounted = false; supabase.removeChannel(channel) }
  }, [])

  // Generate an AI summary of raw responses when the section is opened.
  // Cached by response count so it only regenerates when new responses arrive.
  useEffect(() => {
    if (!rawOpen) return
    const raws = responses.map(r => (r.raw_thoughts || '').trim()).filter(Boolean)
    if (raws.length === 0) { setSummaryState('idle'); return }

    const cacheKey = `rawSummary:${raws.length}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) { setSummary(cached); setSummaryState('done'); return }

    let active = true
    setSummaryState('loading')
    fetch('/api/summarize', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ responses: raws }),
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        if (!active) return
        if (d.summary) {
          setSummary(d.summary)
          setSummaryState('done')
          sessionStorage.setItem(cacheKey, d.summary)
        } else {
          setSummaryState('unavailable')
        }
      })
      .catch(() => { if (active) setSummaryState('unavailable') })

    return () => { active = false }
  }, [rawOpen, responses.length])

  const total = responses.length

  if (loading) {
    return <div className="results-status">Loading results…</div>
  }

  if (total === 0) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="q-text">No responses yet.</div>
        <p className="q-sub" style={{ marginTop: 8 }}>Results will appear here live as people weigh in.</p>
      </div>
    )
  }

  const colorRows = tally(responses, 'colors', COLOR_OPTIONS).map(r => ({ ...r, swatch: r.hex }))
  const otherLikes = responses.map(r => (r.like_other || '').trim()).filter(Boolean)
  const otherDislikes = responses.map(r => (r.dislike_other || '').trim()).filter(Boolean)
  const raws = responses.map(r => (r.raw_thoughts || '').trim()).filter(Boolean)

  return (
    <div className="results">
      <div className="results-status">
        <span className="live-dot" />
        {total} {total === 1 ? 'response' : 'responses'} · updates live
      </div>

      <div className="card result-card">
        <div className="q-number">Question 01</div>
        <div className="q-text">Things people like most</div>
        <BarChart rows={tally(responses, 'likes', TAG_OPTIONS)} accent="var(--ember)" />
        <OtherDropdown items={otherLikes} />
      </div>

      <div className="card result-card">
        <div className="q-number">Question 02</div>
        <div className="q-text">Things people like least</div>
        <BarChart rows={tally(responses, 'dislikes', TAG_OPTIONS)} accent="var(--blue-rasp)" />
        <OtherDropdown items={otherDislikes} />
      </div>

      <div className="card result-card">
        <div className="q-number">Question 03</div>
        <div className="q-text">Favorite logo</div>
        <BarChart rows={tally(responses, 'logo', LOGO_OPTIONS)} accent="var(--ember)" />
      </div>

      <div className="card result-card">
        <div className="q-number">Question 04</div>
        <div className="q-text">Favorite colors</div>
        <BarChart rows={colorRows} accent="var(--ember)" />
      </div>

      <div className="card result-card">
        <div className="q-number">Question 05</div>
        <div className="q-text">Favorite illustrations</div>
        <BarChart rows={tally(responses, 'illustrations', ILLUS_OPTIONS)} accent="var(--ember)" />
      </div>

      <div className="card result-card">
        <button className="raw-toggle" onClick={() => setRawOpen(o => !o)}>
          <span>Raw responses ({raws.length})</span>
          <span className={`raw-caret${rawOpen ? ' open' : ''}`}>▾</span>
        </button>
        {rawOpen && (
          <div className="raw-list">
            {raws.length === 0
              ? <p className="raw-empty">No written thoughts submitted.</p>
              : (
                <>
                  {summaryState !== 'idle' && (
                    <div className="ai-summary">
                      <div className="ai-summary-label">✦ AI summary of responses</div>
                      {summaryState === 'loading' && <p className="ai-summary-text dim">Summarizing the responses…</p>}
                      {summaryState === 'done' && <p className="ai-summary-text">{summary}</p>}
                      {summaryState === 'unavailable' && <p className="ai-summary-text dim">Summary unavailable right now.</p>}
                    </div>
                  )}
                  {raws.map((t, i) => <p className="raw-item" key={i}>“{t}”</p>)}
                </>
              )}
          </div>
        )}
      </div>
    </div>
  )
}
