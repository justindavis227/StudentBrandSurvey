import { useRef } from 'react'
import { TAG_OPTIONS } from '../constants'

export default function TagGrid({ type, selected, otherText, onChange, onOtherChange }) {
  const selClass = type === 'like' ? 'sel-like' : 'sel-dislike'
  const inputRef = useRef(null)

  function toggle(value) {
    if (value === 'other') {
      if (selected.includes('other')) {
        onChange(selected.filter(v => v !== 'other'))
        onOtherChange('')
      } else {
        if (selected.length >= 3) return
        onChange([...selected, 'other'])
        setTimeout(() => inputRef.current?.focus(), 50)
      }
      return
    }
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      if (selected.length >= 3) return
      onChange([...selected, value])
    }
  }

  const isOtherSel = selected.includes('other')
  const atMax = selected.length >= 3

  return (
    <div className="tag-grid">
      {TAG_OPTIONS.map(opt => {
        const isSel = selected.includes(opt.value)
        const isMaxed = atMax && !isSel
        return (
          <div
            key={opt.value}
            className={`tag${isSel ? ' ' + selClass : ''}${isMaxed ? ' maxed' : ''}`}
            onClick={() => toggle(opt.value)}
          >
            {opt.label}
          </div>
        )
      })}

      <div className="other-wrap">
        <div
          className={`tag other-tag${isOtherSel ? ' ' + selClass : ''}${atMax && !isOtherSel ? ' maxed' : ''}`}
          onClick={() => toggle('other')}
        >
          Other
        </div>
        <input
          ref={inputRef}
          className={`other-input${isOtherSel ? ' open ' + type : ''}`}
          type="text"
          maxLength={80}
          placeholder="Type here..."
          value={otherText}
          onChange={e => onOtherChange(e.target.value)}
        />
      </div>
    </div>
  )
}
