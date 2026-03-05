import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartDrawer from './CartDrawer';

const Header = () => {
    const location = useLocation();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    // Is the current page Home where we need transparent header initially?
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            // Apply white background if scrolled more than 50px OR if not on home page
            setScrolled(window.scrollY > 50 || !isHome);
        };

        handleScroll(); // Check initial state
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    // Update cart count from localStorage
    useEffect(() => {
        const checkCart = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(count);
        };

        checkCart();
        window.addEventListener('storage', checkCart);
        return () => window.removeEventListener('storage', checkCart);
    }, [isCartOpen]);

    // Dynamic styling based on scroll/page state
    const headerClasses = `w-full h-20 fixed top-0 z-50 transition-all duration-700 ease-in-out flex items-center justify-between px-10 ${scrolled
        ? 'bg-white text-brand-dark shadow-sm'
        : 'bg-transparent text-brand-dark' // Can be white text if hero requires, but image reference has dark text on light sky
        }`;

    // SVG Icons
    const GlobeIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>;
    const PinIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
    const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
    const UserIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
    const BookmarkIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>;
    const BagIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
    const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" /></svg>;

    return (
        <>
            {/* If home, make space for fixed header. Actually hero image will be underneath. */}
            {!isHome && <div className="h-20 w-full" />}

            <header className={headerClasses}>
                {/* Left Side: Links */}
                <nav className="flex items-center gap-8 w-1/3">
                    <Link to="/shop?sort=newest" className="text-sm font-medium tracking-wide hover:text-brand-orange transition-colors">New in</Link>
                    <Link to="/shop/category" className="text-sm font-medium tracking-wide hover:text-brand-orange transition-colors">Collections</Link>
                </nav>

                {/* Center: Brand Logo */}
                <div className="flex justify-center w-1/3">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/flashudlogo.png" alt="Flashud" className="h-8 object-contain" />
                        <h1 className="text-3xl tracking-wide font-kindred leading-none mt-1 lowercase">
                            flashud
                        </h1>
                    </Link>
                </div>

                {/* Right Side: Icons */}
                <div className="flex justify-end items-center gap-6 w-1/3">
                    {/* Circle Wrapper for Globe (to match reference) */}
                    <button className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white hover:bg-brand-orange transition-colors shrink-0">
                        <GlobeIcon />
                    </button>

                    <button className="hover:text-brand-orange transition-colors shrink-0"><PinIcon /></button>
                    <button className="hover:text-brand-orange transition-colors shrink-0"><SearchIcon /></button>
                    <Link to="/account" className="hover:text-brand-orange transition-colors shrink-0"><UserIcon /></Link>
                    <button className="hover:text-brand-orange transition-colors shrink-0"><BookmarkIcon /></button>

                    <button onClick={() => setIsCartOpen(true)} className="hover:text-brand-orange transition-colors relative shrink-0">
                        <BagIcon />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-orange text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <button className="hover:text-brand-orange transition-colors ml-2 shrink-0"><MenuIcon /></button>
                </div>
            </header>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Header;
