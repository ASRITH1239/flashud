import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartDrawer from './CartDrawer';

const Header = () => {
    const location = useLocation();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    // Is the current page Home where we need transparent header initially?
    const isHome = location.pathname === '/';
    const isTransparent = isHome && !scrolled && !isMenuOpen;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    // Dynamic styling based on scroll state
    const headerClasses = `w-full h-20 md:h-24 fixed top-0 z-[60] transition-all duration-700 ease-in-out flex items-center justify-between px-6 md:px-10 ${isTransparent
        ? 'bg-transparent text-white'
        : 'bg-white/95 backdrop-blur-md text-brand-dark shadow-sm'
        }`;

    // SVG Icons
    const GlobeIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>;
    const PinIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
    const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
    const UserIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
    const BookmarkIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>;
    const BagIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
    const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" /></svg>;
    const XIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

    return (
        <>
            <header className={headerClasses}>
                {/* Left Side: Links (Hidden on mobile) */}
                <nav className="hidden md:flex items-center gap-8 w-1/3">
                    <Link to="/shop?sort=newest" className={`text-sm font-medium tracking-wide transition-colors ${isTransparent ? 'hover:text-white/70' : 'hover:text-brand-orange'}`}>New in</Link>
                    <Link to="/shop/category" className={`text-sm font-medium tracking-wide transition-colors ${isTransparent ? 'hover:text-white/70' : 'hover:text-brand-orange'}`}>Collections</Link>
                </nav>

                {/* Mobile Menu Button (Visible on mobile) */}
                <div className="flex items-center w-1/3 md:hidden">
                    <button onClick={() => setIsMenuOpen(true)} className="hover:text-brand-orange transition-colors">
                        <MenuIcon />
                    </button>
                </div>

                {/* Center: Brand Logo */}
                <div className="flex justify-center w-1/3">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src="/flashudlogo.png"
                            alt="Flashud"
                            className="h-6 md:h-8 object-contain transition-all duration-500"
                        />
                        <h1 className="text-2xl md:text-3xl tracking-wide font-kindred leading-none mt-1 lowercase">
                            flashud
                        </h1>
                    </Link>
                </div>

                {/* Right Side: Icons */}
                <div className="flex justify-end items-center gap-4 md:gap-6 w-1/3">
                    <div className="hidden md:flex items-center gap-6">
                        <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${isTransparent ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-brand-dark text-white hover:bg-brand-orange'}`}>
                            <GlobeIcon />
                        </button>
                        <button className="hover:text-brand-orange transition-colors shrink-0"><PinIcon /></button>
                        <button className="hover:text-brand-orange transition-colors shrink-0"><SearchIcon /></button>
                        <Link to="/account" className="hover:text-brand-orange transition-colors shrink-0"><UserIcon /></Link>
                    </div>

                    <button onClick={() => setIsCartOpen(true)} className="hover:text-brand-orange transition-colors relative shrink-0">
                        <BagIcon />
                        {cartCount > 0 && (
                            <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 text-white text-[8px] font-bold rounded-full flex items-center justify-center ${isTransparent ? 'bg-white/20' : 'bg-brand-orange'}`}>
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar Drawer */}
            <div className={`fixed inset-0 z-[100] transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                <div className={`absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-between items-center p-6 border-b border-black/5">
                        <h2 className="text-xl font-kindred lowercase tracking-wide">flashud</h2>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <XIcon />
                        </button>
                    </div>

                    <nav className="flex-grow py-8 px-6 space-y-6">
                        <Link to="/shop?sort=newest" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-light tracking-widest uppercase hover:text-brand-orange transition-colors">New in</Link>
                        <Link to="/shop/category" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-light tracking-widest uppercase hover:text-brand-orange transition-colors">Collections</Link>
                        <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-light tracking-widest uppercase hover:text-brand-orange transition-colors">Enter Archive</Link>
                        <div className="pt-8 border-t border-black/5 space-y-4">
                            <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 text-sm font-medium uppercase tracking-widest hover:text-brand-orange transition-colors">
                                <UserIcon /> Account
                            </Link>
                            <button onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 text-sm font-medium uppercase tracking-widest hover:text-brand-orange transition-colors w-full text-left">
                                <SearchIcon /> Search
                            </button>
                            <button onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 text-sm font-medium uppercase tracking-widest hover:text-brand-orange transition-colors w-full text-left">
                                <PinIcon /> Stores
                            </button>
                        </div>
                    </nav>

                    <div className="p-6 bg-black text-white">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">Identity // Premium</span>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <GlobeIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Header;
