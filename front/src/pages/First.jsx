import { useState } from "react"
import Button from "../components/Button/Button"
import Input from "../components/inputform/input"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../const"
import { auth } from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth"

export default function First() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState("")
  const [amountError, setAmountError] = useState("")
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
      body: JSON.stringify({ type: "current", amount, year: null, month: null, user_id }),
    })
    setAmount("")
    navigate(ROUTES.HOME)
  }

  return (
    <div className="page" style={{ justifyContent: "center" }}>
      <div className="page-content" style={{ justifyContent: "center" }}>
        <div className="card">
          <h2 style={{ marginBottom: 6, fontSize: 20 }}>はじめに</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            現在の貯金額を入力してください。<br />あとから変更できます。
          </p>
          <div className="form-stack">
            <div className="form-group">
              <label className="form-label">現在の貯金額（円）</label>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="例: 500000"
                error={amountError}
              />
            </div>
            <Button onClick={handleSubmit}>登録して始める</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
