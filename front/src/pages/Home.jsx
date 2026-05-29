import { useNavigate } from "react-router-dom"
import { ROUTES } from "../const"
import { useState, useEffect } from "react"
import { auth, provider } from "../firebase"
import { signInWithPopup } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"
import Button from "../components/Button/Button"

export default function Home() {
  const [user] = useAuthState(auth)
  const [savings, setSavings] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    fetch(`http://localhost:3000/api/goal?user_id=${user.uid}`)
      .then(res => res.json())
      .then(data => setSavings(data))
  }, [user])

  if (!user) return <SignInPage />

  const current = savings.find(item => item.type === "current")
  const formatted = current?.amount
    ? Number(current.amount).toLocaleString("ja-JP")
    : "---"

  return (
    <div className="page">
      <header className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img className="user-avatar" src={auth.currentUser.photoURL} alt="" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{auth.currentUser.displayName}</span>
        </div>
        <button className="icon-btn" onClick={() => auth.signOut()}>
          サインアウト
        </button>
      </header>

      <div className="page-content">
        <div className="card" style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>現在の貯金</p>
          <p style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.5px" }}>
            ¥{formatted}
          </p>
        </div>

        <div className="nav-grid">
          <button className="nav-card" onClick={() => navigate(ROUTES.PAID)}>
            <div className="nav-card-icon" style={{ background: "#fee2e2", color: "#dc2626" }}>支</div>
            <span className="nav-card-label">支出登録</span>
          </button>
          <button className="nav-card" onClick={() => navigate(ROUTES.LOAN)}>
            <div className="nav-card-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>ロ</div>
            <span className="nav-card-label">ローン・サブスク</span>
          </button>
          <button className="nav-card" onClick={() => navigate(ROUTES.PAIDHIS)}>
            <div className="nav-card-icon" style={{ background: "#dbeafe", color: "#2563eb" }}>履</div>
            <span className="nav-card-label">支出履歴</span>
          </button>
          <button className="nav-card" onClick={() => navigate(ROUTES.GOAL)}>
            <div className="nav-card-icon" style={{ background: "#d1fae5", color: "#059669" }}>目</div>
            <span className="nav-card-label">目標設定</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function SignInPage() {
  const navigate = useNavigate()
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider)
    if (result._tokenResponse.isNewUser) {
      navigate(ROUTES.FIRST)
    }
  }
  return (
    <div className="signin-page">
      <h1 className="signin-app-title">お金管理</h1>
      <p className="signin-subtitle">支出を記録して<br />目標貯金を達成しよう</p>
      <div style={{ width: "100%", marginTop: 8 }}>
        <Button onClick={signInWithGoogle}>Googleでサインイン</Button>
      </div>
    </div>
  )
}
