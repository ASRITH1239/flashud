import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(storedCart);
    }, []);

    const updateQuantity = (index, delta) => {
        const newCart = [...cartItems];
        newCart[index].quantity = Math.max(1, newCart[index].quantity + delta);
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeItem = (index) => {
        const newCart = cartItems.filter((_, i) => i !== index);
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const applyCoupon = async () => {
        if (!couponCode) return;
        setIsApplying(true);

        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', couponCode.toUpperCase())
            .eq('is_active', true)
            .single();

        if (data) {
            if (subtotal < data.min_bill_amount) {
                alert(`MINIMUM BILL OF $${data.min_bill_amount} REQUIRED FOR THIS PROMO`);
                setCouponDiscount(null);
            } else {
                setCouponDiscount(data);
                alert('PROMO APPLIED SUCCESSFULLY');
            }
        } else {
            alert('INVALID OR EXPIRED PROMO CODE');
            setCouponDiscount(null);
        }
        setIsApplying(false);
    };

    const calculateDiscount = () => {
        if (!couponDiscount) return 0;
        if (couponDiscount.discount_type === 'percentage') {
            return (subtotal * couponDiscount.discount_value) / 100;
        } else {
            return couponDiscount.discount_value;
        }
    };

    const total = subtotal - calculateDiscount();

    return (
        <div className="max-w-5xl mx-auto py-20 px-6 selection:bg-brand-orange selection:text-white mt-10">
            <div className="mb-16 border-b border-black/5 pb-8">
                <h2 className="text-5xl md:text-7xl font-light uppercase tracking-[0.1em] leading-none text-brand-dark">
                    YOUR <span className="font-bold text-brand-orange">SELECTION</span>
                </h2>
                <div className="flex items-center gap-4 mt-6">
                    <span className="w-10 h-px bg-brand-orange"></span>
                    <span className="text-[10px] font-semibold text-brand-dark/50 uppercase tracking-[0.3em]">SECURE CHECKOUT // ENCRYPTED SESSION</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.length > 0 ? cartItems.map((item, index) => (
                        <div key={index} className="flex gap-6 p-4 bg-white border border-black/5 rounded-2xl group shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300">
                            <div className="w-28 h-36 bg-black/5 rounded-xl overflow-hidden relative shadow-inner flex-shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-medium opacity-20 uppercase tracking-[0.2em] text-[8px] text-center px-2">Awaiting Asset</div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-lg uppercase tracking-[0.1em] text-brand-dark group-hover:text-brand-orange transition-colors">{item.name}</h3>
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-brand-dark/40 hover:bg-red-50 hover:text-red-500 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="text-[9px] font-bold text-brand-dark/50 bg-black/5 px-2 py-1 rounded-full uppercase tracking-[0.2em]">SPEC: {item.size}</span>
                                        <span className="text-[9px] font-bold text-green-500/80 bg-green-50 border border-green-200 px-2 py-1 rounded-full uppercase tracking-[0.2em]">READY</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex items-center bg-white border border-black/10 rounded-full h-9 shadow-sm">
                                        <button onClick={() => updateQuantity(index, -1)} className="w-9 h-full flex items-center justify-center font-medium hover:text-brand-orange transition-colors">-</button>
                                        <span className="w-8 text-center font-bold text-sm text-brand-dark">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(index, 1)} className="w-9 h-full flex items-center justify-center font-medium hover:text-brand-orange transition-colors">+</button>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold tracking-wider text-brand-orange">${(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-24 border border-black/5 rounded-3xl flex flex-col items-center justify-center bg-white shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-brand-dark/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            </div>
                            <p className="font-medium uppercase tracking-[0.2em] text-brand-dark/50 text-sm mb-8">Asset selection is empty</p>
                            <Link to="/shop" className="px-10 py-4 rounded-full bg-brand-dark text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:-translate-y-1 transition-all">
                                RETURN TO ARCHIVE
                            </Link>
                        </div>
                    )}
                </div>

                {/* Summary & Checkout */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-black/5 p-8 rounded-3xl sticky top-28 shadow-xl">
                        <h3 className="text-xl font-light mb-8 tracking-[0.2em] uppercase text-brand-dark border-b border-black/5 pb-4">SUMMARY</h3>

                        <div className="space-y-5 mb-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-brand-dark/50 tracking-[0.1em] uppercase">SUBTOTAL</span>
                                <span className="font-bold tracking-wider text-brand-dark">${subtotal.toFixed(2)}</span>
                            </div>

                            {/* Promo Code Input */}
                            <div className="pt-4 border-t border-black/5">
                                <label className="block text-[9px] font-bold tracking-[0.2em] uppercase text-brand-dark/50 mb-3">ENCRYPTED PROMO CODE</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="FLASH20"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-white border border-black/10 rounded-xl font-medium text-sm focus:outline-none focus:border-brand-orange/50 transition-all text-brand-dark placeholder-brand-dark/30 uppercase shadow-sm"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        disabled={isApplying || !couponCode}
                                        className="w-12 rounded-xl bg-brand-dark text-white font-bold border border-brand-dark hover:bg-brand-orange hover:border-brand-orange transition-all disabled:opacity-30 disabled:hover:bg-brand-dark flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </button>
                                </div>
                            </div>

                            {couponDiscount && (
                                <div className="flex justify-between items-center bg-brand-orange/10 border border-brand-orange/20 rounded-xl p-3 text-brand-orange mt-4">
                                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        PROMO: {couponDiscount.code}
                                    </span>
                                    <span className="font-bold">-${calculateDiscount().toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-6 border-t border-black/5 mt-6">
                                <span className="text-sm font-semibold tracking-[0.1em] uppercase text-brand-dark/70">TOTAL PAYABLE</span>
                                <span className="text-3xl font-bold tracking-wider text-brand-orange">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            disabled={cartItems.length === 0}
                            className="w-full py-5 rounded-full bg-brand-orange text-white font-bold uppercase tracking-[0.2em] text-sm transition-all hover:bg-brand-dark hover:-translate-y-1 disabled:opacity-30 disabled:grayscale disabled:hover:-translate-y-0 disabled:hover:shadow-none flex justify-center items-center gap-2"
                        >
                            <span>FINALIZE ORDER</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>

                        <p className="text-[8px] font-medium text-brand-dark/40 mt-6 flex items-center justify-center gap-2 tracking-[0.2em] uppercase">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            ENCRYPTED SECURE CHECKOUT
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
