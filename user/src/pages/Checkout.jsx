import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        country: 'USA',
        phone: ''
    });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (storedCart.length === 0) navigate('/shop');
        setCartItems(storedCart);
    }, [navigate]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    // Simple mock calculation, can be dynamic
    const totalBeforeTax = subtotal - discount;
    const tax = totalBeforeTax * 0.08;
    const total = totalBeforeTax + tax;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Get current user if logged in
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id || null;

            // 1. Create Order in Supabase
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    total_amount: total,
                    status: 'pending',
                    // Assuming your schema allows user_id to be nullable for guests, or you require auth
                    // user_id: userId
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = cartItems.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Clear Cart
            localStorage.removeItem('cart');
            setOrderSuccess(true);
            setTimeout(() => navigate('/account'), 3000);

        } catch (error) {
            alert('ORDER ERROR: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 selection:bg-brand-orange selection:text-white">
                <div className="w-24 h-24 bg-green-50 border border-green-200 text-green-500 flex items-center justify-center text-4xl rounded-full mb-8 animate-bounce shadow-sm">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-4xl font-light uppercase tracking-[0.2em] mb-4 text-brand-dark text-center">TRANSACTION <span className="font-bold text-brand-orange">VERIFIED</span></h2>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping"></div>
                    <p className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-[0.3em]">Redirecting to encrypted portal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-20 px-6 selection:bg-brand-orange selection:text-white">
            <div className="mb-16 border-b border-black/5 pb-8">
                <h1 className="text-5xl md:text-7xl font-light uppercase tracking-[0.2em] leading-none text-brand-dark">
                    SECURE <span className="font-bold text-brand-orange">CHECKOUT</span>
                </h1>
                <div className="flex items-center gap-4 mt-6">
                    <span className="w-10 h-px bg-brand-orange"></span>
                    <span className="text-[10px] font-semibold text-brand-dark/50 uppercase tracking-[0.3em]">COMMERCIAL TRANSACTION GATEWAY</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Shipping Details */}
                <div>
                    <h2 className="text-xl font-light uppercase tracking-[0.2em] mb-8 text-brand-dark flex items-center gap-4">
                        LOGISTICS <span className="font-bold">DETAIL</span>
                        <span className="h-px flex-1 bg-gradient-to-r from-brand-orange/50 to-transparent"></span>
                    </h2>

                    <form onSubmit={handlePlaceOrder} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark/50">GIVEN NAME</label>
                                <input name="firstName" required value={formData.firstName} onChange={handleInputChange} type="text" placeholder="FIRST" className="w-full bg-white border border-black/10 rounded-xl p-4 text-sm font-medium text-brand-dark placeholder-brand-dark/30 shadow-sm uppercase focus:outline-none focus:border-brand-orange/50 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark/50">SURNAME</label>
                                <input name="lastName" required value={formData.lastName} onChange={handleInputChange} type="text" placeholder="LAST" className="w-full bg-white border border-black/10 rounded-xl p-4 text-sm font-medium text-brand-dark placeholder-brand-dark/30 shadow-sm uppercase focus:outline-none focus:border-brand-orange/50 transition-all" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark/50">IDENTITY (EMAIL)</label>
                                <input name="email" required value={formData.email} onChange={handleInputChange} type="email" placeholder="UNIT@EXAMPLE.COM" className="w-full bg-white border border-black/10 rounded-xl p-4 text-sm font-medium text-brand-dark placeholder-brand-dark/30 shadow-sm uppercase focus:outline-none focus:border-brand-orange/50 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark/50">COMM SEC (PHONE)</label>
                                <input name="phone" required value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-white border border-black/10 rounded-xl p-4 text-sm font-medium text-brand-dark placeholder-brand-dark/30 shadow-sm uppercase focus:outline-none focus:border-brand-orange/50 transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark/50">PHYSICAL COORDINATES (ADDRESS)</label>
                            <input name="address" required value={formData.address} onChange={handleInputChange} type="text" placeholder="STREET ADDRESS" className="w-full bg-white border border-black/10 rounded-xl p-4 text-sm font-medium text-brand-dark placeholder-brand-dark/30 shadow-sm uppercase focus:outline-none focus:border-brand-orange/50 transition-all" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark/50">SECTOR (CITY)</label>
                                <input name="city" required value={formData.city} onChange={handleInputChange} type="text" placeholder="CITY" className="w-full bg-white border border-black/10 rounded-xl p-4 text-sm font-medium text-brand-dark placeholder-brand-dark/30 shadow-sm uppercase focus:outline-none focus:border-brand-orange/50 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark/50">REGION (COUNTRY)</label>
                                <input name="country" required value={formData.country} onChange={handleInputChange} type="text" placeholder="COUNTRY" className="w-full bg-white border border-black/10 rounded-xl p-4 text-sm font-medium text-brand-dark placeholder-brand-dark/30 shadow-sm uppercase focus:outline-none focus:border-brand-orange/50 transition-all" />
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark/50">ZONE (ZIP)</label>
                                <input name="zip" required value={formData.zip} onChange={handleInputChange} type="text" placeholder="ZIP" className="w-full bg-white border border-black/10 rounded-xl p-4 text-sm font-medium text-brand-dark placeholder-brand-dark/30 shadow-sm uppercase focus:outline-none focus:border-brand-orange/50 transition-all" />
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 rounded-full bg-brand-orange text-white font-bold uppercase tracking-[0.2em] text-sm transition-all hover:bg-brand-dark hover:-translate-y-1 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        AUTHORIZING TRANSACTION...
                                    </>
                                ) : (
                                    <>
                                        <span>AUTHORIZE PAYMENT (COD)</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Summary Panel */}
                <div>
                    <div className="bg-white border border-black/5 p-8 md:p-10 rounded-3xl shadow-xl sticky top-28">
                        <h2 className="text-xl font-light uppercase tracking-[0.2em] mb-8 text-brand-dark border-b border-black/5 pb-4">ORDER <span className="font-bold">RECAP</span></h2>

                        <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center gap-4 bg-white p-3 rounded-xl border border-black/5 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-16 bg-black/5 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-20 text-[6px] text-brand-dark">IMG</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium tracking-[0.1em] text-brand-dark truncate max-w-[150px] uppercase">{item.name}</div>
                                            <div className="text-[9px] font-bold text-brand-dark/50 uppercase tracking-[0.2em] mt-1">SPEC: {item.size} // QTY: {item.quantity}</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-sm text-brand-orange">${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="opacity-40 tracking-[0.2em] uppercase text-brand-dark/50">LOGISTICS (SHIPPING)</span>
                                <span className="text-green-500 tracking-wider">COMPLIMENTARY</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold border-b border-black/5 pb-6">
                                <span className="opacity-40 tracking-[0.2em] uppercase text-brand-dark/50">VAT / DUTIES</span>
                                <span className="text-brand-dark">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-sm font-bold tracking-[0.1em] uppercase text-brand-dark/70">TOTAL DEBIT</span>
                                <span className="text-3xl font-bold tracking-wider text-brand-orange">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 p-4 rounded-xl border border-brand-orange/20 bg-brand-orange/5 text-[9px] font-medium text-brand-orange/80 leading-relaxed text-center tracking-[0.1em] uppercase">
                            <div className="flex justify-center mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            BY CLICKING "AUTHORIZE", YOU AGREE TO OUR TERMS OF SERVICE AND REFUND POLICY. DATA IS ENCRYPTED VIA SECURE CHANNEL.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
