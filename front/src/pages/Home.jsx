import { useNavigate } from "react-router-dom"
import Button from "../components/Button/Button"
import {ROUTES} from "../const"
import { useState, useEffect } from "react"
import { auth, provider } from "../firebase"
import { signInWithPopup } from "firebase/auth"
import {useAuthState} from "react-firebase-hooks/auth"

export default function Home() {
  const [user] = useAuthState(auth);
  const [savings, setSavings] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    fetch(`http://localhost:3000/api/goal?user_id=${user.uid}`)
      .then(res => res.json())
      .then(data => setSavings(data))
  }, [user])

  if (!user) return <SignInButton/>

  const current = savings.find(item => item.type === "current")

  return (
    <>
      <UserInfo/>
      <SignOutButton/>
      <h1>お金管理</h1>
      <p>現在の貯金:{current?.amount}円</p>
      <Button onClick={() => navigate(ROUTES.PAID)}>支出登録</Button>
      <Button onClick={() => navigate(ROUTES.LOAN)}>ローン、サブスク登録</Button>
      <Button onClick={() => navigate(ROUTES.PAIDHIS)}>支出履歴</Button>
      <Button onClick={() => navigate(ROUTES.GOAL)}>目標貯金登録</Button>
    </>
  )
}

function SignInButton() {
  const navigate = useNavigate()
  const signInwithGoogle = async() => {
     const result = await signInWithPopup(auth, provider)
     if(result._tokenResponse.isNewUser){
      navigate(ROUTES.FIRST)
     }
  };
  return (
    <button onClick={signInwithGoogle}>
      <p>Googleでサインインする</p>
    </button>
  )
}

function SignOutButton() {
  return (
    <button onClick={() => auth.signOut()}>
      <p>サインアウト</p>
    </button>
  )
}

function UserInfo() {
  return (
    <div className="UserInfo">
      <img src={auth.currentUser.photoURL} alt=""/>
      <p>{auth.currentUser.displayName}</p>
    </div>
  )
}
