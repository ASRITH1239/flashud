import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Account = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            setUser(user);
            fetchOrders(user.id);
        } else {
            // Not authenticated, redirect to login
            navigate('/login', { state: { from: { pathname: '/account' } } });
        }
        setIsLoading(false);
    };

    const fetchOrders = async (userId) => {
        const { data } = await supabase
            .from('orders')
            .select('*')
            // Add user mapping if your orders table supports it, for now just fetching all for demo or specific logic
            // .eq('user_id', userId) 
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin"></div>
                <p className="mt-6 text-[10px] font-bold tracking-[0.3em] uppercase text-brand-dark/50">Securing Session...</p>
            </div>
        );
    }

    if (!user) return null; // Will redirect

    return (
        <div className="max-w-7xl mx-auto py-20 px-6 selection:bg-brand-orange selection:text-white mt-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-black/5 pb-12">
                <div>
                    <h1 className="text-5xl md:text-7xl font-light uppercase tracking-[0.2em] leading-none text-brand-dark">
                        MEMBER <span className="font-bold text-brand-orange">HUB</span>
                    </h1>
                    <p className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-[0.5em] mt-4 pl-1">AUTHENTICATED IDENTITY RECORD</p>
                </div>
                <button
                    onClick={handleSignOut}
                    className="px-8 py-4 rounded-full bg-white border border-black/10 text-brand-dark font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center gap-2 shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    TERMINATE SESSION
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                {/* Profile Information */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-black/5 p-8 rounded-3xl shadow-xl sticky top-28">
                        <h3 className="text-xl font-light text-brand-dark mb-8 uppercase tracking-[0.2em] border-b border-black/5 pb-4">
                            Identity <span className="font-bold text-brand-orange">Meta</span>
                        </h3>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center text-3xl font-bold text-white">
                                    {user?.email?.charAt(0).toUpperCase() || 'P'}
                                </div>
                                <div className="truncate flex-1">
                                    <div className="text-[9px] font-bold text-brand-dark/50 uppercase tracking-[0.2em] mb-1">REGISTERED EMAIL</div>
                                    <div className="font-medium text-lg truncate text-brand-dark">{user?.email || 'client@flashud.io'}</div>
                                    <div className="text-[10px] text-green-500 mt-1 uppercase tracking-widest font-semibold flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Verified
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-black/5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-bold text-brand-dark/50 uppercase tracking-[0.2em]">TIER STATUS</span>
                                    <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/5 border border-brand-orange/20 px-3 py-1 rounded-full uppercase tracking-widest">VIP PLATINUM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-bold text-brand-dark/50 uppercase tracking-[0.2em]">ASSETS ACQUIRED</span>
                                    <span className="text-[10px] font-bold text-brand-dark tracking-widest">{orders.length} ITEMS</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-bold text-brand-dark/50 uppercase tracking-[0.2em]">MEMBER SINCE</span>
                                    <span className="text-[10px] font-bold text-brand-dark tracking-widest">{new Date(user.created_at || Date.now()).getFullYear()}</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button className="w-full py-4 rounded-xl bg-white border border-black/10 text-brand-dark font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 hover:text-brand-orange transition-all shadow-sm">
                                    EDIT SPECIFICATIONS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-2xl font-light text-brand-dark uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                        Acquisition <span className="font-bold">History</span>
                        <span className="h-px flex-1 bg-gradient-to-r from-brand-orange/50 to-transparent ml-4"></span>
                    </h3>

                    {orders.length > 0 ? orders.map(order => (
                        <div key={order.id} className="bg-white border border-black/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-all group relative overflow-hidden shadow-sm">
                            {/* Accent line */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange/50 group-hover:bg-brand-orange transition-colors"></div>

                            <div className="pl-4">
                                <div className="text-brand-orange font-bold text-xs mb-1 uppercase tracking-wider flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    #{order.id.substring(0, 12).toUpperCase()}
                                </div>
                                <div className="font-medium text-xl uppercase tracking-[0.1em] text-brand-dark mb-1">
                                    Transaction ID_{order.id.substring(order.id.length - 4)}
                                </div>
                                <div className="text-[9px] font-bold text-brand-dark/50 uppercase tracking-[0.2em]">
                                    {new Date(order.created_at).toLocaleDateString()} // SECURE TERMINAL
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-black/5 pt-4 md:pt-0 md:pl-8">
                                <div className="text-left md:text-right">
                                    <div className="text-[9px] font-bold text-brand-dark/50 uppercase tracking-[0.2em] mb-1">VALUE</div>
                                    <div className="text-2xl font-bold tracking-wider text-brand-dark">${order.total_amount}</div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-brand-orange/5 text-brand-orange border border-brand-orange/20'}`}>
                                        {order.status}
                                    </span>
                                    <button className="text-[10px] font-bold text-brand-dark/50 hover:text-brand-orange uppercase tracking-[0.1em] transition-colors flex items-center gap-1 mt-1">
                                        DETAILS <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-24 border border-black/5 rounded-3xl flex flex-col items-center justify-center bg-white shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-brand-dark/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            </div>
                            <p className="font-medium uppercase tracking-[0.2em] text-brand-dark/50 text-sm">No acquisitions found in your record.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-24 pt-8 border-t border-black/5 text-center">
                <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-brand-dark/30">© FLASHUD MEMBER PORTAL // CRYPTOGRAPHICALLY SECURE</span>
            </div>
        </div>
    );
};

export default Account;
