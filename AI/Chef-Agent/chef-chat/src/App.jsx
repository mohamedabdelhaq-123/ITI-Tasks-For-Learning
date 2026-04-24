import { useState } from 'react'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import { sendMessage } from './api/chat'
import styles from './App.module.css'

export default function App() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addMessage = (role, text) =>
    setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, role, text }])

  const handleSend = async (text, creativity) => {
    setError(null)
    addMessage('user', text)
    setLoading(true)
    try {
      const reply = await sendMessage(text, creativity)
      addMessage('chef', reply)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>👨‍🍳</span>
          <span className={styles.logoText}>Chef<em>AI</em></span>
        </div>
        <p className={styles.sidebarDesc}>Share your ingredients and I'll guide you step-by-step to a great meal.</p>
        <div className={styles.steps}>
          {[['1','Share ingredients'],['2','Explore cuisines'],['3','Pick a dish'],['4','Get the recipe']].map(([n,label]) => (
            <div key={n} className={styles.step}>
              <span className={styles.stepNum}>{n}</span><span>{label}</span>
            </div>
          ))}
        </div>
        <button className={styles.clearBtn} onClick={() => { setMessages([]); setError(null) }}>New conversation</button>
      </aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <span className={styles.headerTitle}>Chef Assistant</span>
          <span className={styles.headerStatus}><span className={styles.dot}/>Online</span>
        </header>
        <ChatWindow messages={messages} loading={loading} />
        {error && <div className={styles.error}>⚠️ {error}</div>}
        <ChatInput onSend={handleSend} disabled={loading} />
      </main>
    </div>
  )
}
