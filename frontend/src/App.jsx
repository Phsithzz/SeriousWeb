import React from 'react'
import{BrowserRouter,Routes,Route} from "react-router-dom"
import LayoutHome from './layouts/LayoutHome'
import NotFoundPage from './pages/NotFoundPage'
import Register from './pages/Register'
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
       <Route path="*" element={<NotFoundPage />}/>
       <Route path="/" element={<LayoutHome />}/>
       <Route path="/register" element={<Register/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App