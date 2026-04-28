import React from 'react';
import "./App.css";
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Auth from './pages/Auth';
import CheckoutPage from './pages/CheckoutPage';
import Navbar from './components/Navbar';
import AuthProvider from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/checkout' element={<CheckoutPage />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
