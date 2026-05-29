import { useState } from "react"
import Input from "../components/inputform/input"
import Select from "../components/Select/Select"
import Button from "../components/Button/Button"
import { auth } from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { goalType, goalTypeMap, ROUTES } from "../const"
import { useNavigate } from "react-router-dom"

const years = Array.from({ length: 35 }, (_, i) => i + 1)
const months = Array.from({ length: 12 }, (_, i) => i + 1)

export default function Goal() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState("")
  const [amountError, setAmountError] = useState("")
  const [type, setType] = useState("")
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [user] = useAuthState(auth)
  const user_id = user.uid

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setAmountError("正の数値を入力してください")
      return
    }
    setAmountError("")
    await fetch("http://localhost:3000/api/goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: goalTypeMap[type], amount, year, month, user_id }),
    })
    setAmount("")
    setType("")
    setYear("")
    setMonth("")
  }

  let form = null
  if (type === "目標貯金") {
    form = (
      <>
        <div className="form-group">
          <label className="form-label">目標金額（円）</label>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="例: 1000000" error={amountError} />
        </div>
        <div className="form-group">
          <label className="form-label">達成期間</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Select
              option={years.map(y => ({ value: y, label: `${y}年` }))}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="年を選択"
            />
            <Select
              option={months.map(m => ({ value: m, label: `${m}ヶ月` }))}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="ヶ月を選択"
            />
          </div>
        </div>
      </>
    )
  } else if (type === "現在の貯金") {
    form = (
      <div className="form-group">
        <label className="form-label">現在の貯金額（円）</label>
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="例: 500000" error={amountError} />
      </div>
    )
  } else if (type === "月の平均収入") {
    form = (
      <div className="form-group">
        <label className="form-label">月の平均収入（円）</label>
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="例: 250000" error={amountError} />
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(ROUTES.HOME)}>← 戻る</button>
        <h1 className="page-title">目標設定</h1>
        <div style={{ width: 64 }} />
      </header>

      <div className="page-content">
        <div className="card">
          <div className="form-stack">
            <div className="form-group">
              <label className="form-label">設定の種類</label>
              <Select
                option={goalType}
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="選択してください"
              />
            </div>
            {form}
            {type && <Button onClick={handleSubmit}>登録する</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}
