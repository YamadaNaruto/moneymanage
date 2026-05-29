import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import Input from "../components/inputform/input"
import Select from "../components/Select/Select"
import Button from "../components/Button/Button"
import { paidjunre, ROUTES } from "../const"
import Addpicture from "../components/addpiture/addpicture"

export default function Paid() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState("")
  const [amountError, setAmountError] = useState("")
  const [junre, setJunre] = useState("")
  const [file, setFile] = useState(null)
  const [user] = useAuthState(auth)
  const user_id = user.uid

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setAmountError("正の数値を入力してください")
      return
    }
    setAmountError("")
    const formData = new FormData()
    formData.append("amount", amount)
    formData.append("junre", junre)
    formData.append("image", file)
    formData.append("user_id", user_id)
    await fetch("http://localhost:3000/api/paid", {
      method: "POST",
      body: formData,
    })
    await fetch("http://localhost:3000/api/savings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, user_id }),
    })
    setAmount("")
    setJunre("")
    setFile(null)
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(ROUTES.HOME)}>← 戻る</button>
        <h1 className="page-title">支出登録</h1>
        <div style={{ width: 64 }} />
      </header>

      <div className="page-content">
        <div className="card">
          <div className="form-stack">
            <div className="form-group">
              <label className="form-label">ジャンル</label>
              <Select
                option={paidjunre}
                value={junre}
                onChange={(e) => setJunre(e.target.value)}
                placeholder="選択してください"
              />
            </div>
            <div className="form-group">
              <label className="form-label">金額（円）</label>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" error={amountError} />
            </div>
            <div className="form-group">
              <label className="form-label">写真（任意）</label>
              <Addpicture file={file} onChange={setFile} />
            </div>
            <Button onClick={handleSubmit}>登録する</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
