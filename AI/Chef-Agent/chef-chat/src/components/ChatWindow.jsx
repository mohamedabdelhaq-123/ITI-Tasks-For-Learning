import { useEffect, useRef } from 'react'
import Message from './Message'
import styles from './ChatWindow.module.css'

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  return (
    <div className={styles.window}>
      {messages.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🍽️</span>
          <p className={styles.emptyTitle}>Ready to cook?</p>
          <p className={styles.emptyHint}>Tell me what ingredients you have and I'll guide you to a delicious meal.</p>
        </div>
      )}
      <div className={styles.messages}>
        {messages.map((msg) => <Message key={msg.id} role={msg.role} text={msg.text} />)}
        {loading && <div className={styles.typing}><span/><span/><span/></div>}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
