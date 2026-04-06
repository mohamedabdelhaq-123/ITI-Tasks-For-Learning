import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './Components/NavBar'
import Footer from './Components/Footer'
import ProductDetails from './Components/ProductDetails'
import Products from './Components/Products'
import NotFound from './Components/NotFound'
import Cart from './Components/Cart'
import Register from './Components/Register'
import ContactUs from './Components/ContactUs'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
    <NavBar />
    <Routes>
        <Route path='/'  element={<Navigate to="/products" replace/>}/>
         <Route path='/register' element={<Register/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/contact' element={<ContactUs/>}/>
        <Route path='/products/:id' element={<ProductDetails/>}/> 
        <Route path='/cart' element={<Cart/>}/>
        <Route path='*' element={<NotFound/>}/>       
    </Routes>
    <Footer/>
    </div>
  )
}

export default App

// replace => replace the current entry in the histroy in the histroy api