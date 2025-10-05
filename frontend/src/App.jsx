  import React from 'react'
  import{BrowserRouter,Routes,Route} from "react-router-dom"
  import LayoutHome from './layouts/LayoutHome'
  import NotFoundPage from './pages/NotFoundPage'
  import Register from './pages/Register'
  import Login from './pages/Login'
  import Home from './components/Home'
  import Product from './components/Product'
  const App = () => {
    return (
      <>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<LayoutHome />}>
            <Route index element={<Home/>}/>
            <Route path="products" element={<Product/>}/>
          </Route>
      


        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>

        <Route path="*" element={<NotFoundPage />}/>
      </Routes>
      </BrowserRouter>
      </>
    )
  }

  export default App