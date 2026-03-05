import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_bill_amount: '',
        is_active: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setIsLoading(true);
        const { data } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setCoupons(data);
        setIsLoading(false);
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('coupons')
                .insert([{
                    ...newCoupon,
                    discount_value: parseFloat(newCoupon.discount_value),
                    min_bill_amount: parseFloat(newCoupon.min_bill_amount || 0)
                }]);

            if (error) throw error;
            alert('PROMO CODE GENERATED');
            setNewCoupon({ code: '', discount_type: 'percentage', discount_value: '', min_bill_amount: '', is_active: true });
            fetchCoupons();
        } catch (error) {
            alert('ERROR: ' + error.message);
        }
    };

    const deleteCoupon = async (id) => {
        const { error } = await supabase.from('coupons').delete().eq('id', id);
        if (error) alert('Error');
        else fetchCoupons();
    };

    return (
        <div className="max-w-5xl mx-auto selection:bg-brand-orange selection:text-white pb-20">
            <div className="mb-12">
                <h2 className="text-3xl font-light text-white tracking-[0.2em] relative inline-block">
                    PROMO <span className="font-bold text-brand-orange drop-shadow-[0_0_8px_rgba(255,123,0,0.4)]">ENGINE</span>
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-brand-orange to-transparent mt-4"></div>
                <p className="text-xs font-medium text-white/50 uppercase tracking-[0.1em] mt-3">
                    Generate strategic discounts for the platform
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Coupon Creator */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl sticky top-28">
                        <h3 className="text-lg font-light text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                            Generator <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                        </h3>
                        <form onSubmit={handleCreateCoupon} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2">Promo Code</label>
                                <input
                                    type="text"
                                    placeholder="E.G. FLASH20"
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                    className="w-full px-5 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-widest focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-white/30"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2">Discount Type</label>
                                <select
                                    value={newCoupon.discount_type}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
                                    className="w-full px-5 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all [&>option]:bg-brand-dark"
                                >
                                    <option value="percentage">PERCENTAGE (%)</option>
                                    <option value="fixed">FIXED AMOUNT ($)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2">Value</label>
                                <input
                                    type="number"
                                    placeholder="20"
                                    value={newCoupon.discount_value}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: e.target.value })}
                                    className="w-full px-5 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-white/30"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2">Threshold (Min Bill $)</label>
                                <input
                                    type="number"
                                    placeholder="100"
                                    value={newCoupon.min_bill_amount}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, min_bill_amount: e.target.value })}
                                    className="w-full px-5 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-white/30"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-brand-gradient text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,123,0,0.3)] hover:shadow-[0_0_30px_rgba(255,123,0,0.5)] hover:-translate-y-0.5 transition-all mt-4"
                            >
                                DEPLOY PROMO
                            </button>
                        </form>
                    </div>
                </div>

                {/* Coupons List */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-light text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-6">
                        Active Campaigns <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </h3>
                    {isLoading ? (
                        <div className="p-10 text-center font-medium uppercase tracking-[0.2em] text-white/50">Syncing...</div>
                    ) : coupons.length > 0 ? coupons.map(coupon => (
                        <div key={coupon.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex justify-between items-center group shadow-[0_4px_20px_0_rgba(0,0,0,0.2)] hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-center gap-8">
                                <div className="text-4xl font-light text-brand-orange tracking-widest border-r border-white/20 pr-8 drop-shadow-sm">
                                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}
                                </div>
                                <div>
                                    <div className="text-2xl font-medium text-white uppercase tracking-wider mb-2 group-hover:text-brand-orange transition-colors">
                                        {coupon.code}
                                    </div>
                                    <div className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                        MINIMUM BILL: ${coupon.min_bill_amount} <span className="opacity-30">|</span> {coupon.is_active ? <span className="text-green-400">ENABLED</span> : <span className="text-red-400">DISABLED</span>}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteCoupon(coupon.id)}
                                className="w-12 h-12 rounded-full border border-white/10 text-white/50 hover:bg-red-500/20 hover:border-red-500/30 hover:text-white transition-all text-2xl flex items-center justify-center leading-none"
                            >
                                ×
                            </button>
                        </div>
                    )) : (
                        <div className="p-20 text-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                            <div className="font-medium text-white/40 uppercase tracking-[0.2em]">NO ACTIVE CAMPAIGNS</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Coupons;
