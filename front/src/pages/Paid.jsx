import { useEffect, useState } from "react"
import Input from "../components/inputform/input"
import Select from "../components/Select/Select"
import Button from "../components/Button/Button"

import {paidjunre, ROUTES} from "../const"
import { useNavigate } from "react-router-dom"
import Addpicture from "../components/addpiture/addpicture"


export default function Paid() {
  //写真アップロードするための処理
 

  //ジャンル指定、何円使ったか入力して登録する
  //sqlとの接続が必要
  const navigate = useNavigate()
  const [amount, setAmount] = useState("")
  const [junre, setJunre] = useState("")
  const [file, setFile] = useState(null)
  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append("amount",amount)
    formData.append("junre",junre)
    formData.append("image",file)
    await fetch("http://localhost:3000/api/paid",{
      method: "POST",
      body: formData
    })
    await fetch("http://localhost:3000/api/savings",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({amount})
    })
    setAmount("")
    setJunre("")
    setFile(null)

    }
  

  return (
    <>
    <h1>a</h1>
    <Select option={paidjunre}  value={junre} onChange={(e) => setJunre(e.target.value)}/>
    <Input value={amount} onChange={(e) => setAmount(e.target.value)}/>
    <Addpicture file={file} onChange={setFile}/>
    <Button onClick={handleSubmit}>登録</Button>
    <Button onClick={() =>navigate(ROUTES.HOME)}>ホーム</Button>
    </>
   
    


  )
}
