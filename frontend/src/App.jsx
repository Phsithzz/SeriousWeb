import React from 'react'
import{BrowserRouter,Routes,Route} from "react-router-dom"
import LayoutHome from './layouts/LayoutHome'
import NotFoundPage from './pages/NotFoundPage'
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
       <Route path="*" element={<NotFoundPage />}/>
       <Route path="/" element={<LayoutHome />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App