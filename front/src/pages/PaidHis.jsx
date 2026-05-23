import { useState, useEffect } from "react"
import { paidjunre, ROUTES } from "../const"
import { data, useNavigate } from "react-router-dom"
import Button from "../components/Button/Button"
import Select from "../components/Select/Select"

  const today = new Date
  const years = Array.from({length:5},(_, i) =>  today.getFullYear()-i)
  const months = Array.from({length: 12},(_, i)=> i + 1)
export function usePaidSummary(year,month,junre) {

  const [expenses, setExpenses] = useState([])
  const [loans, setLoans] = useState([])
  useEffect(() => {
    fetch(`http://localhost:3000/api/paidhis?year=${year}&month=${month}&junre=${junre}`)
    .then(res => res.json())
    .then(data => {
      setExpenses(data.expenses)
      setLoans(data.loans)
    })


  },[year,month,junre])
  const expensesTotal = expenses.reduce((sum,item) => sum + item.amount,0)
  const loansTotal = loans.reduce((sum, item) => sum + item.amount, 0)
  const total = expensesTotal + loansTotal
  return { expenses, loans, expensesTotal, loansTotal, total }
}
export default function PaidHis() {
  const navigate = useNavigate()
  const [year, setYear] = useState(today.getFullYear())
  const [month,setMonth]=useState((new Date().getMonth()+1))
  const [junre, setJunre] = useState("")
  const {expenses, loans, expensesTotal, loansTotal, total} = usePaidSummary(year, month, junre)
  const [openIds, setOpenIds] = useState(new Set())
  const toggle = (id) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  
  return (
    
    <>
    <p>過去の支出</p>
    <Select option={years} value={year} onChange={(e) => setYear(Number(e.target.value))} />
    <Select option={months}  value={month} onChange={(e) => setMonth(Number(e.target.value))}/>
    <p>ジャンル指定</p>
    <Select option={paidjunre} value={junre} onChange={(e) => setJunre(e.target.value)} placeholder="指定なし" />
    <h1>支出履歴({year}年{month}月分)</h1>
    {expenses.map(item => (
      <div key={item.id}><h3>{item.junre}: {item.amount}円</h3>
      <Button onClick={() => toggle(item.id)}>
        {openIds.has(item.id) ? "隠す" : "写真を表示"}
      </Button>
      {openIds.has(item.id) && (
        
        
          <img
          src={`http://localhost:3000/${item.image_path}`}
          alt=""
          style={{maxWidth: 400}}
          />
          
      )}
      </div>
    ))}
    <p>支出合計:{expensesTotal}円</p>
    <h2>サブスク，ローン</h2>
    {loans.map(item => (
      <h3 key={item.id}>{item.name}: {item.amount}円</h3>
    ))}
    <p>ローン，サブスク合計:{loansTotal}円</p>
    <h2>合計: {total}円</h2>
    <Button onClick={() =>navigate(ROUTES.HOME)}>ホーム</Button>
    </>
  )
}
