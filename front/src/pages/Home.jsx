import { useNavigate } from "react-router-dom"
import Button from "../components/Button/Button"
import {ROUTES} from "../const"
import { usePaidSummary } from "./PaidHis"
import { use } from "react"
import { useState } from "react"
import { useEffect } from "react"
export default function Home() {
  const today = new Date
  const [savings,setSavings] = useState([])
  const navigate = useNavigate()
  const current = savings.find(item => item.type === "現在の貯金")
   useEffect(() => {
      fetch("http://localhost:3000/api/goal")
      .then(res => res.json())
      .then(data => setSavings(data))
  
  
    },[])
  
  return(
  <>
   <h1>お金管理</h1>
   <p>現在の貯金:{current?.amount}円</p>
   <Button onClick={() =>navigate(ROUTES.PAID)}>支出登録</Button>
   <Button onClick={() =>navigate(ROUTES.LOAN)}>ローン、サブスク登録</Button>
   <Button onClick={() =>navigate(ROUTES.PAIDHIS)}>支出履歴</Button>
   <Button onClick={() =>navigate(ROUTES.GOAL)}>目標貯金登録</Button>

  </>
  )
}
