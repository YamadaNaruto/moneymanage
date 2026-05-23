import styles from "./Button.module.css"
export default function Button({children,onClick}) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <span>{children}</span>
    </button>
  )
}
