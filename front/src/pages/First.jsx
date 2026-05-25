import { useState } from "react"
import Button from "../components/Button/Button"
import Input from "../components/inputform/input"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../const"
import {auth} from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth"

export default function First() {
    const navigate = useNavigate()
    const [amount,setAmount] = useState("")
    const [user] = useAuthState(auth)
    const user_id = user.uid
    const handleSubmit = async () => {
        if(!amount){
            window.alert("正しく入力してください")
            return
        }
        await fetch("http://localhost:3000/api/goal", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({type: "current", amount, year:null, month:null,user_id})
        })
       setAmount("")
       navigate(ROUTES.HOME)
      }
  return (
    <div>
      <h1>現在の貯金額を登録してください</h1>
       <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="現在の貯金額を入力" />
       <Button onClick={handleSubmit}>登録</Button>
       
    </div>
  )
}
