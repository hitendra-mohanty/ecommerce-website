import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logOut();
        navigate('/');
    }

    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <Link to='/' className='navbar-brand'>OneShop</Link>

                <div className='navbar-links'>
                    <Link to='/' className='navbar-link'>Home</Link>
                    <Link to='/checkout' className='navbar-link'>Cart</Link>
                    {user?.role === 'seller' && (
                        <Link to='/seller' className='navbar-link'>Seller Dashboard</Link>
                    )}
                </div>

                <div className='navbar-auth'>
                    {!user ? (
                        <div className='navbar-auth-links'>
                            <Link to='/auth?mode=login' className='btn btn-secondary'>Login</Link>
                            <Link to='/auth?mode=signup' className='btn btn-primary'>Signup</Link>
                        </div>
                    ) : (
                        <div className='navbar-user'>
                            <span className='navbar-greeting'>Welcome, {user.email}!</span>
                            <button className='btn btn-secondary' onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}