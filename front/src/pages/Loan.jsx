import { useState } from "react"
import { auth } from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import Select from "../components/Select/Select"
import { loanorsub, ROUTES } from "../const"
import Input from "../components/inputform/input"
import Button from "../components/Button/Button"
import { useNavigate } from "react-router-dom"

const years = Array.from({ length: 35 }, (_, i) => i + 1)
const months = Array.from({ length: 12 }, (_, i) => i + 1)

export default function Loan() {
  const navigate = useNavigate()
  const [type, setType] = useState("")
  const [amount, setAmount] = useState("")
  const [amountError, setAmountError] = useState("")
  const [name, setName] = useState("")
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
    await fetch("http://localhost:3000/api/loan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name, amount, year, month, user_id }),
    })
    setAmount("")
    setName("")
    setYear("")
    setMonth("")
  }

  let form = null
  if (type === "ローン") {
    form = (
      <>
        <div className="form-group">
          <label className="form-label">ローン名</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 住宅ローン"
          />
        </div>
        <div className="form-group">
          <label className="form-label">月額（円）</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            error={amountError}
          />
        </div>
        <div className="form-group">
          <label className="form-label">残り期間</label>
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
        <Button onClick={handleSubmit}>登録する</Button>
      </>
    )
  } else if (type === "サブスク") {
    form = (
      <>
        <div className="form-group">
          <label className="form-label">サービス名</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: Netflix"
          />
        </div>
        <div className="form-group">
          <label className="form-label">月額（円）</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            error={amountError}
          />
        </div>
        <Button onClick={handleSubmit}>登録する</Button>
      </>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(ROUTES.HOME)}>← 戻る</button>
        <h1 className="page-title">ローン・サブスク登録</h1>
        <div style={{ width: 64 }} />
      </header>

      <div className="page-content">
        <div className="card">
          <div className="form-stack">
            <div className="form-group">
              <label className="form-label">種別</label>
              <Select
                placeholder="選択してください"
                option={loanorsub}
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            {form}
          </div>
        </div>
      </div>
    </div>
  )
}
