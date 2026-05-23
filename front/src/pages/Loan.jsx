import { use, useState } from "react"
import Select from "../components/Select/Select"
import { loanorsub, ROUTES } from "../const"
import Input from "../components/inputform/input"
import Button from "../components/Button/Button"
import { useNavigate } from "react-router-dom"

export default function Loan() {
  const navigate = useNavigate()
  const [type,setType] = useState("")
  const [amount,setAmount] = useState("")
  const [name, setName] = useState("")
  const years = Array.from({length: 35},(_, i) => i + 1)
  const months = Array.from({length: 12},(_, i)=> i + 1)

  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")

  const handleSubmit = async () => {
    await fetch("http://localhost:3000/api/loan",{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({type,name,amount,year,month})
    })
    setAmount("")
    setName("")
    setYear("")
    setMonth("")
  }

  let form = null
  if (type === "ローン"){
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
     <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="ローン名を入力" />
     <Input type="number"value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="金額を入力" />
     <Button onClick={handleSubmit}>登録</Button>
 </>   
  } else if (type === "サブスク") {
    
    form = 
    <>
    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="サブスク名を入力" />
    <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="金額を入力" />
    <Button onClick={handleSubmit}>登録</Button>

    </>
  }
  return (
    <>
    <h1>ローン，サブスク登録</h1>
    <Select placeholder="選択してください"option={loanorsub}  value={type} onChange={(e) => setType(e.target.value)}/>
      {form}
    <Button onClick={() =>navigate(ROUTES.HOME)}>ホーム</Button>
    </>

  )
}