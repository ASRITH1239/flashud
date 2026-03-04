import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path ? 'text-fashion-orange' : 'hover:text-fashion-orange';

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('adminEmail');
        navigate('/login');
    };

    return (
        <header className="w-full h-20 bg-fashion-black border-b-2 border-fashion-orange flex items-center justify-between px-10">
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-fashion-orange flex items-center justify-center font-bold text-fashion-black text-xl">
                        F
                    </div>
                    <h1 className="text-2xl font-bold tracking-widest text-fashion-orange uppercase">
                        Fashion Admin
                    </h1>
                </Link>
            </div>

            <nav className="flex items-center gap-8">
                <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/')}`}>DASHBOARD</Link>
                <Link to="/products" className={`text-sm font-medium transition-colors ${isActive('/products')}`}>INVENTORY</Link>
                <Link to="/sales-management" className={`text-sm font-medium transition-colors ${isActive('/sales-management')}`}>SALES</Link>
                <Link to="/orders" className={`text-sm font-medium transition-colors ${isActive('/orders')}`}>ORDERS</Link>
                <Link to="/customers" className={`text-sm font-medium transition-colors ${isActive('/customers')}`}>CUSTOMERS</Link>
                <Link to="/categories" className={`text-sm font-medium transition-colors ${isActive('/categories')}`}>CATEGORIES</Link>
                <Link to="/admin-management" className={`text-sm font-medium transition-colors ${isActive('/admin-management')}`}>ADMINS</Link>
                <div className="w-px h-6 bg-fashion-orange opacity-30 mx-2"></div>
                <button 
                    onClick={handleLogout}
                    className="px-5 py-2 border-2 border-fashion-orange text-fashion-orange font-bold hover:bg-fashion-orange hover:text-fashion-black transition-all"
                >
                    LOGOUT
                </button>
            </nav>
        </header>
    );
};

export default Header;
