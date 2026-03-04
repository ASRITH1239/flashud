import React from 'react';

const Checkout = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8">Shipping Detail</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="FIRST NAME" className="bg-fashion-black border-2 border-fashion-orange/20 p-4 text-xs font-bold w-full outline-none focus:border-fashion-orange" />
                            <input type="text" placeholder="LAST NAME" className="bg-fashion-black border-2 border-fashion-orange/20 p-4 text-xs font-bold w-full outline-none focus:border-fashion-orange" />
                        </div>
                        <input type="email" placeholder="EMAIL ADDRESS" className="bg-fashion-black border-2 border-fashion-orange/20 p-4 text-xs font-bold w-full outline-none focus:border-fashion-orange" />
                        <input type="text" placeholder="STREET ADDRESS" className="bg-fashion-black border-2 border-fashion-orange/20 p-4 text-xs font-bold w-full outline-none focus:border-fashion-orange" />
                        <div className="grid grid-cols-3 gap-4">
                            <input type="text" placeholder="CITY" className="bg-fashion-black border-2 border-fashion-orange/20 p-4 text-xs font-bold w-full outline-none focus:border-fashion-orange" />
                            <input type="text" placeholder="POSTAL CODE" className="bg-fashion-black border-2 border-fashion-orange/20 p-4 text-xs font-bold w-full outline-none focus:border-fashion-orange" />
                            <input type="text" placeholder="COUNTRY" className="bg-fashion-black border-2 border-fashion-orange/20 p-4 text-xs font-bold w-full outline-none focus:border-fashion-orange" />
                        </div>
                    </form>
                </div>

                <div className="p-10 border-2 border-fashion-orange bg-fashion-orange/5">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8">Summary</h2>
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm">
                            <span className="opacity-50">SHIPPING</span>
                            <span className="font-bold">FREE</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="opacity-50">TAX</span>
                            <span className="font-bold">$74.20</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t-2 border-fashion-orange/20 pt-4 mt-4">
                            <span>TOTAL</span>
                            <span className="text-fashion-orange italic italic">$972.20</span>
                        </div>
                    </div>
                    <button className="w-full py-5 bg-fashion-orange text-fashion-black font-black uppercase tracking-widest border-2 border-fashion-orange hover:bg-transparent hover:text-fashion-orange transition-all">
                        COMPLETE PURCHASE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
