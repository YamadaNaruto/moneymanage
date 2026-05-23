import { useState } from "react"
import Input from "../components/inputform/input"
import Select from "../components/Select/Select"
import Button from "../components/Button/Button"
import { goalType, goalTypeMap, ROUTES } from "../const"
import { useNavigate } from "react-router-dom"

export default function Goal() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("")
  const years = Array.from({length: 35},(_, i) => i + 1)
  const months = Array.from({length: 12},(_, i)=> i + 1)
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")

  const handleSubmit = async () => {
    await fetch("http://localhost:3000/api/goal", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({type: goalTypeMap[type], amount, year, month})
    })
    setAmount("")
    setType("")
    setYear("")
    setMonth("")
  }

  let form = null
  if (type === "目標貯金") {
    form = 
    <>
    <p>残り年数</p>
    <select value={year} onChange={(e) => setYear(e.target.value)}>
      <option value="">年を選択</option>
      {years.map(y => <option key={y} value={y}>{y}年</option>)}
    </select>

    <select value={month} onChange={(e) => setMonth(e.target.value)}>
      <option value="">ヶ月を選択</option>
      {months.map(m => <option key={m} value={m}>{m}ヶ月</option>)}
    </select>
    <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="目標金額を入力" />
    </>
  } else if (type === "現在の貯金") {
    form = <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="現在の貯金額を入力" />
  }else if (type === "月の平均収入") {
    form = <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="平均収入を入力" />
  }

  return (
    <>
      <Select option={goalType} value={type} onChange={(e) => setType(e.target.value)} />
      {form}
      {type && <Button onClick={handleSubmit}>登録</Button>}
      <Button onClick={() =>navigate(ROUTES.HOME)}>ホーム</Button>
    </>
  )
}