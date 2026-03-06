import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ORDER_STATUSES } from '../lib/constants';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

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

    const fetchOrderDetails = async (order) => {
        setSelectedOrder(order);
        const { data, error } = await supabase
            .from('order_items')
            .select('*, products(name, images)')
            .eq('order_id', order.id);

        if (data) setOrderItems(data);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        setIsUpdating(true);
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            alert('Status Update Failed: ' + error.message);
        } else {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            }
        }
        setIsUpdating(false);
    };

    return (
        <div className="max-w-7xl mx-auto selection:bg-brand-orange selection:text-white pb-20">
            <div className="mb-12">
                <h2 className="text-3xl font-light text-white tracking-[0.2em] relative inline-block">
                    TRANSACTION <span className="font-bold text-brand-orange drop-shadow-[0_0_8px_rgba(255,123,0,0.4)]">STREAM</span>
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-brand-orange to-transparent mt-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Orders List */}
                <div className={`${selectedOrder ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6 transition-all duration-500`}>
                    {isLoading ? (
                        <div className="p-20 text-center font-medium uppercase tracking-[0.2em] text-white/50">Intercepting Data...</div>
                    ) : orders.length > 0 ? orders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => fetchOrderDetails(order)}
                            className={`bg-white/5 backdrop-blur-md border ${selectedOrder?.id === order.id ? 'border-brand-orange shadow-[0_0_30px_rgba(255,123,0,0.2)]' : 'border-white/10'} rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 cursor-pointer hover:bg-white/10 transition-all duration-300`}
                        >
                            <div className="flex-1">
                                <div className="text-brand-orange text-[10px] font-bold mb-2 uppercase tracking-[0.3em] opacity-80">#{order.id.substring(0, 12)}</div>
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
                                    <div className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2">Debit Value</div>
                                    <div className="text-3xl font-light text-white tracking-widest">${order.total_amount}</div>
                                </div>

                                <div className="flex flex-col gap-3 w-full md:w-auto">
                                    <span className={`px-6 py-2 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] text-center ${ORDER_STATUSES.find(s => s.value === order.status)?.color || 'border-white/10 text-white/50'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-20 text-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                            <div className="font-medium text-white/40 uppercase tracking-[0.2em]">NO TRANSACTIONS DETECTED</div>
                        </div>
                    )}
                </div>

                {/* Order Details Panel */}
                {selectedOrder && (
                    <div className="lg:col-span-1 border-l border-white/10 pl-8 space-y-8 animate-in slide-in-from-right-10 duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white uppercase tracking-widest">Order Details</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-white/40 hover:text-white text-2xl">×</button>
                        </div>

                        <div className="bg-white/5 rounded-3xl border border-white/10 p-6 space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] block mb-4">Lifecycle Status</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {ORDER_STATUSES.map(status => (
                                        <button
                                            key={status.value}
                                            disabled={isUpdating}
                                            onClick={() => updateOrderStatus(selectedOrder.id, status.value)}
                                            className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${selectedOrder.status === status.value ? status.color + ' ring-1 ring-brand-orange' : 'border-white/5 text-white/30 hover:bg-white/5'}`}
                                        >
                                            {status.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] block mb-4">Inventory Breakdown</label>
                                <div className="space-y-4">
                                    {orderItems.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center bg-black/20 p-3 rounded-2xl border border-white/5">
                                            <div className="w-12 h-16 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                                                {item.products?.images?.[0] ? (
                                                    <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[8px] text-white/20">NO IMG</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[11px] font-medium text-white uppercase tracking-wider mb-1 truncate w-40">
                                                    {item.products?.name || 'Unknown Product'}
                                                </div>
                                                <div className="text-[10px] font-bold text-brand-orange uppercase leading-none">
                                                    QTY: {item.quantity} <span className="mx-2 text-white/20">|</span> ${item.price}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {orderItems.length === 0 && (
                                        <div className="text-[10px] text-white/30 uppercase tracking-widest py-4 text-center italic">Scanning Items...</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-4 rounded-full border border-brand-orange text-brand-orange font-bold uppercase tracking-widest text-xs hover:bg-brand-orange hover:text-white transition-all">
                            GENERATE MANIFEST (PDF)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;

