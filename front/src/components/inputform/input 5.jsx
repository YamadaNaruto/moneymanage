export default function Input({value,onChange,placeholder = "金額を入力"}) {
  return (
    
    <input 
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min="0"
        />
    
  )
}
