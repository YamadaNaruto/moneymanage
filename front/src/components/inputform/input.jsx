import "./input-module.css"

export default function Input({ value, onChange, placeholder = "金額を入力", type = "number", error }) {
  return (
    <div>
      <input
        className={`input-field${error ? " input-field--error" : ""}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
      />
      {error && <p className="input-error">{error}</p>}
    </div>
  )
}
