import styles from "./Button.module.css"

export default function Button({ children, onClick, variant = "primary", size, className = "" }) {
  const sizeClass = size === "small" ? styles.small : ""
  return (
    <button
      type="button"
      className={`${styles.button} ${styles[variant] ?? styles.primary} ${sizeClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
