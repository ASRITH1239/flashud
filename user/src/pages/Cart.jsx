import React from 'react';

const Cart = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-12">Your Selection</h2>
            <div className="space-y-8">
                {[1, 2].map((item) => (
                    <div key={item} className="flex gap-8 p-6 border-2 border-fashion-orange/10">
                        <div className="w-24 h-32 border-2 border-fashion-orange/20 flex items-center justify-center">
                            <div className="text-fashion-orange/20 font-bold text-[10px]">THUMB</div>
                        </div>
                        <div className="flex-1 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg uppercase tracking-widest mb-1">Luxury Piece {item}</h3>
                                <div className="text-xs opacity-50 mb-4">SIZE: MEDIUM • COLOR: DEEP BLACK</div>
                                <div className="flex items-center gap-4">
                                    <button className="text-fashion-orange font-bold font-mono">-</button>
                                    <span className="font-bold">1</span>
                                    <button className="text-fashion-orange font-bold font-mono">+</button>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-fashion-orange font-bold italic">$449.00</div>
                                <button className="text-[10px] font-bold opacity-30 hover:opacity-100 hover:text-red-500 uppercase mt-4">Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-8 border-t-2 border-fashion-orange">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="text-xs opacity-50 uppercase tracking-widest mb-1">Subtotal</div>
                        <div className="text-3xl font-black italic">$898.00</div>
                    </div>
                    <button className="px-12 py-4 bg-fashion-orange text-fashion-black font-black uppercase tracking-widest border-2 border-fashion-orange hover:bg-transparent hover:text-fashion-orange transition-all">
                        CHECKOUT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
