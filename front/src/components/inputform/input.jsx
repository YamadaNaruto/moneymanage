export default function Input({value, onChange, placeholder = "金額を入力", type = "number"}) {
  return (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        />
  )
}
