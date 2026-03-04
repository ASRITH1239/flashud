import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'text-fashion-orange' : 'hover:text-fashion-orange';

    return (
        <header className="w-full h-20 bg-fashion-black border-b-2 border-fashion-orange flex items-center justify-between px-10">
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-4">
                    <div className="w-10 h-10 border-2 border-fashion-orange flex items-center justify-center font-bold text-fashion-orange text-xl">
                        F
                    </div>
                    <h1 className="text-2xl font-bold tracking-widest text-fashion-orange uppercase">
                        Fashion Store
                    </h1>
                </Link>
            </div>

            <nav className="flex items-center gap-10">
                <Link to="/shop" className={`text-sm font-medium transition-colors ${isActive('/shop')}`}>SHOP</Link>
                <Link to="/shop/category" className="text-sm font-medium hover:text-fashion-orange transition-colors">COLLECTIONS</Link>
                <div className="flex items-center gap-6">
                    <button className="text-sm font-bold text-fashion-orange hover:opacity-80">SEARCH</button>
                    <Link to="/cart" className={`text-sm font-bold transition-colors ${isActive('/cart')}`}>CART (0)</Link>
                    <Link to="/account" className={`px-5 py-2 bg-fashion-orange text-fashion-black font-bold border-2 border-fashion-orange hover:bg-transparent hover:text-fashion-orange transition-all ${isActive('/account')}`}>
                        ACCOUNT
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
