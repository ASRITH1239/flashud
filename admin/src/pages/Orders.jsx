import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*, profiles(full_name, email)')
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setIsLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto selection:bg-brand-orange selection:text-white pb-20">
            <div className="mb-12">
                <h2 className="text-3xl font-light text-white tracking-[0.2em] relative inline-block">
                    TRANSACTION <span className="font-bold text-brand-orange drop-shadow-[0_0_8px_rgba(255,123,0,0.4)]">STREAM</span>
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-brand-orange to-transparent mt-4"></div>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <div className="p-20 text-center font-medium uppercase tracking-[0.2em] text-white/50">Intercepting Data...</div>
                ) : orders.length > 0 ? orders.map((order) => (
                    <div key={order.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_8px_32px_0_rgba(255,123,0,0.15)] transition-all duration-300">
                        <div className="flex-1">
                            <div className="text-brand-orange font-semibold text-lg mb-2 uppercase tracking-widest drop-shadow-sm">#{order.id.substring(0, 12)}</div>
                            <div className="font-medium text-white text-2xl uppercase tracking-wider leading-none mb-4">
                                {order.profiles?.full_name || 'Anonymous Client'}
                            </div>
                            <div className="flex pl-4 py-1 border-l-2 border-white/20">
                                <span className="text-[10px] font-medium text-white/50 uppercase tracking-[0.1em] leading-none">
                                    {new Date(order.created_at).toLocaleString()} <span className="mx-2 opacity-50">|</span> {order.profiles?.email || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-10 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
                            <div className="text-center md:text-right">
                                <div className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em] mb-2">Total Value</div>
                                <div className="text-3xl font-light text-white tracking-widest">${order.total_amount}</div>
                            </div>

                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                <span className={`px-6 py-2 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] text-center ${order.status === 'completed' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-brand-orange/30 bg-brand-orange/10 text-brand-orange'}`}>
                                    {order.status}
                                </span>
                                <button className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white uppercase tracking-wider hover:bg-white/10 transition-all">
                                    INSPECT
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="p-20 text-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                        <div className="font-medium text-white/40 uppercase tracking-[0.2em]">NO TRANSACTIONS DETECTED</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
