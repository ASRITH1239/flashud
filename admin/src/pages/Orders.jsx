import React from 'react';

const Orders = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-fashion-orange mb-8 uppercase tracking-widest">Customer Orders</h2>
            <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-8 border-2 border-fashion-orange/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="text-fashion-orange font-bold text-lg mb-1 italic">#ORD-902{i}</div>
                            <div className="font-bold text-xl uppercase tracking-wider">Premium Cashmere Coat</div>
                            <div className="text-sm opacity-50 mt-1 uppercase tracking-tighter">Customer: Julian Vane • Date: Oct 2{i}, 2026</div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className="text-2xl font-bold">$599.00</div>
                                <div className="text-xs font-bold uppercase text-fashion-orange">PAID</div>
                            </div>
                            <button className="px-6 py-2 border-2 border-fashion-orange text-fashion-orange font-bold hover:bg-fashion-orange hover:text-fashion-black transition-all">
                                VIEW DETAILS
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
