import React from 'react';

const ProductDetail = () => {
    return (
        <div className="max-w-7xl mx-auto py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="aspect-[4/5] border-2 border-fashion-orange flex items-center justify-center">
                    <div className="text-fashion-orange/20 font-bold text-6xl italic">EXCLUSIVE</div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="text-fashion-orange font-bold text-sm tracking-[0.5em] uppercase mb-4 italic italic">Limited Release</div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-6 leading-none">Midnight Velvet Tuxedo Blazer</h1>
                    <p className="text-2xl font-mono text-fashion-orange mb-8 italic">$895.00</p>
                    <div className="text-sm opacity-70 leading-relaxed mb-10 max-w-md">
                        Hand-crafted in our workshop with the finest Italian velvet. Features a tailored slim fit, silk satin lapels, and custom monogrammed lining. A definitive piece for the modern formalist.
                    </div>
                    <div className="flex gap-4 mb-10">
                        {['S', 'M', 'L', 'XL'].map(size => (
                            <button key={size} className="w-12 h-12 border-2 border-fashion-orange/20 font-bold hover:border-fashion-orange transition-all">{size}</button>
                        ))}
                    </div>
                    <button className="w-full py-5 bg-fashion-orange text-fashion-black font-black uppercase tracking-widest border-2 border-fashion-orange hover:bg-transparent hover:text-fashion-orange transition-all">
                        ADD TO BAG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
