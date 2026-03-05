import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [heroImage, setHeroImage] = useState('');
    const [isSavingHero, setIsSavingHero] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        fetchHeroSetting();
    }, []);

    const fetchHeroSetting = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('name', '_HERO_IMAGE_')
            .single();
        if (data && data.images && data.images.length > 0) {
            setHeroImage(data.images[0]);
        }
    };

    const saveHeroSetting = async (e) => {
        e.preventDefault();
        setIsSavingHero(true);
        // Check if exists
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('name', '_HERO_IMAGE_')
            .single();

        try {
            if (existing) {
                const { error } = await supabase.from('products').update({
                    images: [heroImage],
                    is_archived: false
                }).eq('id', existing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('products').insert([{
                    name: '_HERO_IMAGE_',
                    description: 'Hero Image Setting',
                    original_price: 0,
                    discounted_price: 0,
                    category_id: null,
                    is_archived: false,
                    stock: { 'S': 0, 'M': 0, 'L': 0, 'XL': 0 },
                    images: [heroImage]
                }]);
                if (error) throw error;
            }
            setIsSavingHero(false);
            alert('Hero image updated successfully. Refresh the user storefront to view.');
        } catch (err) {
            setIsSavingHero(false);
            console.error('Failed to save hero setting:', err);
            alert('Error updating Hero: ' + err.message);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic check for file size (keep under 2MB for DB storage safety)
        if (file.size > 2 * 1024 * 1024) {
            alert('Please select an image smaller than 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setHeroImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch total revenue from completed orders
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('total_amount, status');

            if (ordersError) throw ordersError;

            const totalRevenue = ordersData
                .filter(o => o.status === 'completed' || o.status === 'delivered')
                .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

            // Fetch active orders count
            const activeOrders = ordersData.filter(o => o.status !== 'cancelled' && o.status !== 'delivered').length;

            // Fetch inventory count (Filter out _HERO_IMAGE_)
            const { count: productCount, error: productError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .neq('name', '_HERO_IMAGE_');

            if (productError) throw productError;

            setStats({
                revenue: totalRevenue,
                orders: activeOrders,
                products: productCount || 0
            });

            // Fetch recent orders with profiles
            const { data: recent, error: recentError } = await supabase
                .from('orders')
                .select('*, profiles(full_name)')
                .order('created_at', { ascending: false })
                .limit(5);

            if (recentError) throw recentError;
            setRecentOrders(recent || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto selection:bg-brand-orange selection:text-white pb-20">
            <div className="mb-12">
                <h2 className="text-3xl font-light text-white tracking-[0.2em] relative inline-block">
                    MISSION <span className="font-bold text-brand-orange drop-shadow-[0_0_8px_rgba(255,123,0,0.4)]">CONTROL</span>
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-brand-orange to-transparent mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,123,0,0.15)] hover:-translate-y-1 transition-all duration-300">
                    <span className="text-brand-orange text-xs font-semibold mb-3 block uppercase tracking-[0.2em] drop-shadow-md">Total Revenue (Vault)</span>
                    <span className="text-5xl font-light text-white tracking-widest">${stats.revenue.toLocaleString()}</span>
                    <div className="mt-5 text-xs font-medium text-white/50 uppercase tracking-[0.1em]">+12% FROM PREVIOUS CYCLE</div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,123,0,0.15)] hover:-translate-y-1 transition-all duration-300">
                    <span className="text-brand-orange text-xs font-semibold mb-3 block uppercase tracking-[0.2em] drop-shadow-md">Active Orders</span>
                    <span className="text-5xl font-light text-white tracking-widest">{stats.orders}</span>
                    <div className="mt-5 text-xs font-medium text-white/50 uppercase tracking-[0.1em]">REAL-TIME PROCESSING</div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,123,0,0.15)] hover:-translate-y-1 transition-all duration-300">
                    <span className="text-brand-orange text-xs font-semibold mb-3 block uppercase tracking-[0.2em] drop-shadow-md">Inventory Assets</span>
                    <span className="text-5xl font-light text-white tracking-widest">{stats.products}</span>
                    <div className="mt-5 text-xs font-medium text-white/50 uppercase tracking-[0.1em]">98% STOCK STABILITY</div>
                </div>
            </div>

            <div className="mt-12 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-light text-white mb-6 tracking-widest uppercase">
                    Storefront <span className="text-brand-orange font-bold">Hero Settings</span>
                </h3>
                <form onSubmit={saveHeroSetting} className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-2 w-full">
                            <label className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Upload Local Image OR enter URL</label>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* File Upload Input */}
                                <div className="relative flex-1 bg-black/30 border border-white/10 rounded-xl overflow-hidden hover:border-brand-orange/50 transition-all group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="px-5 py-4 text-sm font-medium text-white/40 flex items-center justify-center gap-3">
                                        <svg className="w-5 h-5 group-hover:text-brand-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                        <span className="group-hover:text-white transition-colors">CHOOSE FILE</span>
                                    </div>
                                </div>

                                <span className="text-white/20 self-center font-bold">// OR //</span>

                                {/* URL Input */}
                                <input
                                    type="url"
                                    value={heroImage?.startsWith('data:') ? '' : heroImage}
                                    onChange={(e) => setHeroImage(e.target.value)}
                                    placeholder="https://example.com/hero.jpg"
                                    className="flex-1 bg-black/30 border border-white/10 rounded-xl p-4 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:border-brand-orange/50 transition-all shadow-inner"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSavingHero}
                            className="px-8 py-4 rounded-xl bg-brand-orange text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-brand-orange/80 transition-all disabled:opacity-50 h-[54px] whitespace-nowrap"
                        >
                            {isSavingHero ? 'SAVING...' : 'UPDATE HERO'}
                        </button>
                    </div>
                </form>
                {heroImage && (
                    <div className="mt-8 relative aspect-[21/9] w-full max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-black/50">
                        <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                            <span className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase">LIVE PREVIEW</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-20">
                <h3 className="text-2xl font-light text-white mb-8 tracking-widest flex items-center gap-6">
                    Recent Intel <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                </h3>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-xl divide-y divide-white/5">
                    {recentOrders.length > 0 ? recentOrders.map((order) => (
                        <div key={order.id} className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center font-bold text-brand-orange shadow-inner">
                                    #{order.id.substring(0, 2)}
                                </div>
                                <div>
                                    <div className="font-medium text-lg uppercase tracking-wider text-white">Order {order.id.substring(0, 8)}</div>
                                    <div className="text-xs font-medium text-white/50 uppercase tracking-[0.1em] mt-1">CLIENT: {order.profiles?.full_name || 'ANONYMOUS'} <span className="mx-2 opacity-30">|</span> VALUE: ${order.total_amount}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                                <span className={`flex-1 md:flex-none px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] text-center ${order.status === 'completed' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-brand-orange/30 bg-brand-orange/10 text-brand-orange'}`}>
                                    {order.status}
                                </span>
                                <button className="px-5 py-2 rounded-full border border-white/10 text-xs font-semibold text-white uppercase tracking-wider hover:bg-white/10 transition-all">
                                    DETAILS
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="p-16 text-center">
                            <div className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
                                No recent data in the stream
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Branded Disclaimer */}
            <div className="mt-20 text-center">
                <p className="text-[10px] font-medium text-white/30 tracking-[0.3em]">
                    © FLASHUD COMMAND // AUTHORIZED PERSONNEL ONLY
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
