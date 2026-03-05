import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path
        ? 'text-brand-orange drop-shadow-[0_0_8px_rgba(255,123,0,0.5)]'
        : 'text-gray-400 hover:text-white transition-colors';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('adminEmail');
        navigate('/login');
    };

    return (
        <header className="w-full h-20 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-10 sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(255,123,0,0.4)] group-hover:shadow-[0_0_25px_rgba(255,123,0,0.6)] transition-shadow">
                        <img src="/flashudlogo.png" alt="Flashud" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                </Link>
            </div>

            <nav className="flex items-center gap-6">
                <Link to="/" className={`text-sm font-medium tracking-wide transition-all ${isActive('/')}`}>DASHBOARD</Link>
                <Link to="/products" className={`text-sm font-medium tracking-wide transition-all ${isActive('/products')}`}>INVENTORY</Link>
                <Link to="/banners" className={`text-sm font-medium tracking-wide transition-all ${isActive('/banners')}`}>BANNERS</Link>
                <Link to="/sales-management" className={`text-sm font-medium tracking-wide transition-all ${isActive('/sales-management')}`}>SALES</Link>
                <Link to="/orders" className={`text-sm font-medium tracking-wide transition-all ${isActive('/orders')}`}>ORDERS</Link>
                <Link to="/customers" className={`text-sm font-medium tracking-wide transition-all ${isActive('/customers')}`}>CUSTOMERS</Link>
                <Link to="/categories" className={`text-sm font-medium tracking-wide transition-all ${isActive('/categories')}`}>CATEGORIES</Link>
                <Link to="/coupons" className={`text-sm font-medium tracking-wide transition-all ${isActive('/coupons')}`}>COUPONS</Link>
                <Link to="/settings" className={`text-sm font-medium tracking-wide transition-all ${isActive('/settings')}`}>SETTINGS</Link>
                <Link to="/admin-management" className={`text-sm font-medium tracking-wide transition-all ${isActive('/admin-management')}`}>ADMINS</Link>

                <div className="w-px h-6 bg-white/20 mx-2"></div>

                <button
                    onClick={handleLogout}
                    className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium tracking-wide hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,123,0,0.4)]"
                >
                    LOGOUT
                </button>
            </nav>
        </header>
    );
};

export default Header;
