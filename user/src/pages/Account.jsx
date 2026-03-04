import React from 'react';

const Account = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-black uppercase tracking-tighter italic">My Profile</h2>
                <button className="text-xs font-bold text-fashion-orange hover:underline">SIGN OUT</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b-2 border-fashion-orange/10 pb-2">Order History</h3>
                    <div className="space-y-4">
                        {[1, 2].map(order => (
                            <div key={order} className="p-6 border-2 border-fashion-orange/10 flex justify-between items-center">
                                <div>
                                    <div className="font-bold uppercase tracking-wide">ORDER #XF-9032{order}</div>
                                    <div className="text-xs opacity-50 mt-1">Oct {10 + order}, 2026 • 2 Items</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold italic italic">$549.00</div>
                                    <div className="text-[10px] font-bold text-fashion-orange uppercase">SHIPPED</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b-2 border-fashion-orange/10 pb-2">Information</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="text-xs opacity-50 uppercase tracking-widest mb-1">Email</div>
                            <div className="font-bold">user_prime@fashion.com</div>
                        </div>
                        <div>
                            <div className="text-xs opacity-50 uppercase tracking-widest mb-1">Address</div>
                            <div className="font-bold">Vanity Boulevard 101, Paris, France</div>
                        </div>
                        <button className="w-full py-3 border-2 border-fashion-orange text-fashion-orange font-bold text-xs uppercase tracking-widest hover:bg-fashion-orange hover:text-fashion-black transition-all">
                            EDIT PROFILE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
