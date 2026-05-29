import { useState, useEffect } from "react"
import { paidjunre, ROUTES } from "../const"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import Button from "../components/Button/Button"
import Select from "../components/Select/Select"

const today = new Date()
const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)

export function usePaidSummary(year, month, junre) {
  const [user] = useAuthState(auth)
  const [expenses, setExpenses] = useState([])
  const [loans, setLoans] = useState([])
  useEffect(() => {
    if (!user) return
    fetch(
      `http://localhost:3000/api/paidhis?year=${year}&month=${month}&junre=${junre}&user_id=${user.uid}`
    )
      .then(res => res.json())
      .then(data => {
        setExpenses(data.expenses)
        setLoans(data.loans)
      })
  }, [year, month, junre, user])
  const expensesTotal = expenses.reduce((sum, item) => sum + item.amount, 0)
  const loansTotal = loans.reduce((sum, item) => sum + item.amount, 0)
  const total = expensesTotal + loansTotal
  return { expenses, loans, expensesTotal, loansTotal, total }
}

export default function PaidHis() {
  const navigate = useNavigate()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [junre, setJunre] = useState("")
  const { expenses, loans, expensesTotal, loansTotal, total } = usePaidSummary(year, month, junre)
  const [openIds, setOpenIds] = useState(new Set())

  const toggle = (id) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const fmt = (n) => Number(n).toLocaleString("ja-JP")

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(ROUTES.HOME)}>← 戻る</button>
        <h1 className="page-title">支出履歴</h1>
        <div style={{ width: 64 }} />
      </header>

      <div className="page-content">
        {/* Filter */}
        <div className="card">
          <p className="section-title" style={{ marginBottom: 12 }}>期間・絞り込み</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="form-group">
              <label className="form-label">年</label>
              <Select
                option={years.map(y => ({ value: y, label: `${y}年` }))}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">月</label>
              <Select
                option={months.map(m => ({ value: m, label: `${m}月` }))}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 10 }}>
            <label className="form-label">ジャンル</label>
            <Select
              option={paidjunre}
              value={junre}
              onChange={(e) => setJunre(e.target.value)}
              placeholder="指定なし"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="card">
          <p className="section-title" style={{ marginBottom: 12 }}>{year}年{month}月の合計</p>
          <div className="total-row" style={{ marginBottom: 8 }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>支出合計</span>
            <span style={{ fontWeight: 600, color: "var(--danger)" }}>¥{fmt(expensesTotal)}</span>
          </div>
          <div className="total-row" style={{ marginBottom: 8 }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>ローン・サブスク</span>
            <span style={{ fontWeight: 600, color: "var(--warning)" }}>¥{fmt(loansTotal)}</span>
          </div>
          <div className="divider" />
          <div className="total-row">
            <span className="total-label">合計</span>
            <span className="total-amount">¥{fmt(total)}</span>
          </div>
        </div>

        {/* Expenses */}
        {expenses.length > 0 && (
          <div className="card">
            <p className="section-title" style={{ marginBottom: 12 }}>支出明細</p>
            {expenses.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  paddingBottom: 12,
                  marginBottom: idx < expenses.length - 1 ? 12 : 0,
                  borderBottom: idx < expenses.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span className="badge badge-red" style={{ marginBottom: 4 }}>{item.junre}</span>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "var(--danger)" }}>
                      ¥{fmt(item.amount)}
                    </p>
                  </div>
                  {item.image_path && (
                    <Button variant="ghost" size="small" onClick={() => toggle(item.id)}>
                      {openIds.has(item.id) ? "隠す" : "写真"}
                    </Button>
                  )}
                </div>
                {openIds.has(item.id) && (
                  <img
                    src={`http://localhost:3000/${item.image_path}`}
                    alt=""
                    style={{ width: "100%", borderRadius: 8, marginTop: 10, objectFit: "cover" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Loans */}
        {loans.length > 0 && (
          <div className="card">
            <p className="section-title" style={{ marginBottom: 4 }}>ローン・サブスク</p>
            {loans.map(item => (
              <div key={item.id} className="list-item">
                <div>
                  <span className="badge badge-yellow" style={{ marginBottom: 4 }}>{item.type}</span>
                  <p className="list-item-label">{item.name}</p>
                </div>
                <span style={{ fontWeight: 600, color: "var(--warning)" }}>¥{fmt(item.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {expenses.length === 0 && loans.length === 0 && (
          <div className="empty-state">
            <p>この期間の記録はありません</p>
          </div>
        )}
      </div>
    </div>
  )
}
