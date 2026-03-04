import React from 'react';

const Shop = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-2">The Collection</h2>
                    <p className="text-sm opacity-50 uppercase tracking-widest">Browse our complete archive of formal luxury</p>
                </div>
                <div className="flex gap-4">
                    <select className="bg-fashion-black border-2 border-fashion-orange/20 p-2 text-xs font-bold uppercase tracking-widest outline-none focus:border-fashion-orange">
                        <option>CATEGORY: ALL</option>
                        <option>OUTERWEAR</option>
                        <option>EVENING</option>
                    </select>
                    <select className="bg-fashion-black border-2 border-fashion-orange/20 p-2 text-xs font-bold uppercase tracking-widest outline-none focus:border-fashion-orange">
                        <option>SORT: FEATURED</option>
                        <option>PRICE: LOW-HIGH</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="aspect-[3/4] border-2 border-fashion-orange/10 mb-4 flex items-center justify-center grayscale group-hover:grayscale-0 group-hover:border-fashion-orange transition-all duration-500">
                            <div className="text-fashion-orange/20 font-bold text-xs uppercase tracking-widest">ITEM_{i}</div>
                        </div>
                        <div className="font-bold uppercase tracking-wider mb-1 text-sm">Luxury Item {i}</div>
                        <div className="text-fashion-orange font-mono text-xs italic">$399.00</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;
