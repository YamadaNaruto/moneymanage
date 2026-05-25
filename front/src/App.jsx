
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {ROUTES} from './const'
import Home from "./pages/Home"
import Paid from "./pages/Paid"
import PaidHis from "./pages/PaidHis"
import Loan from "./pages/Loan"
import Goal from "./pages/Goal"
import { FirebaseError } from 'firebase/app'
import First from './pages/First'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.FIRST} element={<First/>}/>
        <Route path={ROUTES.HOME} element={<Home/>}/>
        <Route path={ROUTES.PAID} element={<Paid/>}/>
        <Route path={ROUTES.PAIDHIS} element={<PaidHis/>}/>
        <Route path={ROUTES.LOAN} element={<Loan/>}/>
        <Route path={ROUTES.GOAL} element={<Goal/>}/>
      </Routes>
    </BrowserRouter>
  )
}

