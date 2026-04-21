import { useState, useRef } from 'react'
import styles from './ChatInput.module.css'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const [creativity, setCreativity] = useState(0.7)
  const [showSlider, setShowSlider] = useState(false)
  const textareaRef = useRef(null)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed, creativity)
    setText('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const creativityLabel = creativity < 0.35 ? 'Precise' : creativity < 0.65 ? 'Balanced' : creativity < 0.85 ? 'Creative' : 'Wild'

  return (
    <div className={styles.container}>
      {showSlider && (
        <div className={styles.sliderPanel}>
          <label className={styles.sliderLabel}>
            <span>Creativity</span>
            <span className={styles.sliderValue}>{creativityLabel} ({creativity.toFixed(1)})</span>
          </label>
          <input type="range" min="0" max="1" step="0.05" value={creativity}
            onChange={(e) => setCreativity(parseFloat(e.target.value))} className={styles.slider} />
        </div>
      )}
      <div className={styles.inputRow}>
        <button className={`${styles.iconBtn} ${showSlider ? styles.active : ''}`}
          onClick={() => setShowSlider(p => !p)} title="Adjust creativity">✦</button>
        <textarea ref={textareaRef} className={styles.textarea} placeholder="Tell me your ingredients…"
          value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} rows={1} disabled={disabled} />
        <button className={styles.sendBtn} onClick={handleSend} disabled={disabled || !text.trim()}>↑</button>
      </div>
    </div>
  )
}
