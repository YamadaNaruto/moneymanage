
export default function Select({ value,onChange,option,placeholder}) {
    const genres = option
  return (
    <select value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {genres.map((g)=> (
            <option key={g} value={g}>{g}</option>
        ))}

    </select>
  )
}
