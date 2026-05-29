import styles from "./Select.module.css"

export default function Select({ value, onChange, option, placeholder }) {
  return (
    <select className={styles.select} value={value} onChange={onChange}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {option.map((g) => {
        if (typeof g === "object" && g !== null) {
          return <option key={g.value} value={g.value}>{g.label}</option>
        }
        return <option key={g} value={g}>{g}</option>
      })}
    </select>
  )
}
