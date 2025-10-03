import React from 'react'
import{BrowserRouter,Routes,Route} from "react-router-dom"
import LayoutHome from './layouts/LayoutHome'
import NotFoundPage from './pages/NotFoundPage'
import Register from './pages/Register'
import Login from './pages/Login'
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
       <Route path="*" element={<NotFoundPage />}/>
       <Route path="/" element={<LayoutHome />}/>
       <Route path="/register" element={<Register/>}/>
       <Route path="/login" element={<Login/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App