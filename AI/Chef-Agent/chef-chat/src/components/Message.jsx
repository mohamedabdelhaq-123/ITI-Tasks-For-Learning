import styles from './Message.module.css'

export default function Message({ role, text }) {
  const isChef = role === 'chef'
  return (
    <div className={`${styles.wrapper} ${isChef ? styles.chef : styles.user}`}>
      {isChef && <div className={styles.avatar}>🍳</div>}
      <div className={styles.bubble}>
        {text.split('\n').map((line, i, arr) => (
          <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
        ))}
      </div>
    </div>
  )
}
