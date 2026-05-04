import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const {user, logOut} = useContext(AuthContext);

    return (
        <nav className='navbar'>
           <div className='navbar-container'>
            <Link to='/' className='navbar-brand'>OneShop</Link>

            <div className='navbar-links'>
                <Link to='/' className='navbar-link' >Home</Link>
                <Link to='/checkout' className='navbar-link'>Cart</Link>
            </div>

            <div className='navbar-auth'>
               {!user ? <div className='navbar-auth-links'>
                    <Link to='/auth' className='btn btn-secondary'>Login</Link>
                    <Link to='/auth' className='btn btn-primary'>Signup</Link>
                </div> : (
                    <div className='navbar-user'>
                        <span className='navbar-greeting'>Welcome, {user.email}!</span>
                        <button className='btn btn-secondary' onClick={logOut}>Logout</button>
                    </div>
                )}
            </div>
           </div>
        </nav>
    )
}