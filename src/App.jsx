import React from 'react';
import "./App.css";
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Auth from './pages/Auth';
import CheckoutPage from './pages/CheckoutPage';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import AuthProvider from './context/AuthContext';
import NotFoundPage from './pages/NotFoundPage';
import CartProvider from './context/CartContext';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/products/:id' element={<ProductDetails />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </div>
       </CartProvider>
    </AuthProvider>
  )
}

export default App
