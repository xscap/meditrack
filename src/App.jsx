import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Welcome from './WelcomePage/Welcome.jsx'
import Login from './LoginPage/Login.jsx'
import Register from './RegisterPage/Register.jsx'
import Dashboard from './DashboardPage/main.jsx'
import ForgotPassword from './ForgotPw/ForgotPW.jsx'
import UserMedForm from './UserMedMgmt/UserForm.jsx'
import AuthSessionTimeout from './Services/AuthSessionTimeout.jsx'
import ProtectedRoute from './Services/ProtectedRoute.jsx'
function App() {
  

  return (
    <>
      
      <Router>
        <AuthSessionTimeout />
        <Routes>
          <Route path='/' element={<Welcome/>}/> 
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/user-med-form' element={<UserMedForm/>}/>
          </Route>
        </Routes>
      </Router>
      
      
    </>
  )
}

export default App
