import React from 'react';

const Categories = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-fashion-orange mb-8 uppercase tracking-widest">Collections & Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['Outerwear', 'Evening Wear', 'Accessories', 'Limited Edition', 'Footwear', 'Resort Wear'].map((category, i) => (
                    <div key={category} className="group cursor-pointer">
                        <div className="h-48 border-2 border-fashion-orange/20 flex flex-col items-center justify-center p-8 group-hover:border-fashion-orange transition-all duration-300">
                            <div className="text-fashion-orange opacity-20 text-4xl font-black mb-2 italic">0{i + 1}</div>
                            <div className="text-2xl font-black uppercase tracking-widest group-hover:text-fashion-orange transition-colors">{category}</div>
                            <div className="mt-2 text-xs font-bold opacity-30">{(i + 1) * 12} PRODUCTS</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
