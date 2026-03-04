import React from 'react';

const Customers = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-fashion-orange mb-8 uppercase tracking-widest">Customer Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-6 border-2 border-fashion-orange/10 flex items-center gap-6">
                        <div className="w-16 h-16 border-2 border-fashion-orange/50 flex items-center justify-center font-bold text-2xl">
                            {String.fromCharCode(64 + i)}
                        </div>
                        <div>
                            <div className="text-xl font-bold uppercase tracking-widest">Fashionista User {i}</div>
                            <div className="text-sm opacity-50">user{i}@fashionpremium.com</div>
                            <div className="mt-2 flex gap-4">
                                <span className="text-xs font-bold text-fashion-orange">ORDERS: {10 + i}</span>
                                <span className="text-xs font-bold text-fashion-orange">STATUS: PLATINUM</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Customers;
