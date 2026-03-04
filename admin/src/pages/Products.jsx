import React from 'react';

const Products = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-fashion-orange uppercase tracking-widest">Inventory</h2>
                <button className="px-6 py-2 bg-fashion-orange text-fashion-black font-bold border-2 border-fashion-orange hover:bg-transparent hover:text-fashion-orange transition-all">
                    ADD NEW PRODUCT
                </button>
            </div>
            <div className="border-2 border-fashion-orange/20 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-fashion-orange/10">
                        <tr>
                            <th className="p-4 border-b-2 border-fashion-orange/20 uppercase text-xs tracking-widest font-bold">Product</th>
                            <th className="p-4 border-b-2 border-fashion-orange/20 uppercase text-xs tracking-widest font-bold">Category</th>
                            <th className="p-4 border-b-2 border-fashion-orange/20 uppercase text-xs tracking-widest font-bold">Stock</th>
                            <th className="p-4 border-b-2 border-fashion-orange/20 uppercase text-xs tracking-widest font-bold">Price</th>
                            <th className="p-4 border-b-2 border-fashion-orange/20 uppercase text-xs tracking-widest font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-fashion-orange/5 transition-colors">
                                <td className="p-4 border-b border-fashion-orange/10 font-bold">Luxury Silk Scarf {i}</td>
                                <td className="p-4 border-b border-fashion-orange/10 opacity-70">Accessories</td>
                                <td className="p-4 border-b border-fashion-orange/10">24 left</td>
                                <td className="p-4 border-b border-fashion-orange/10 font-mono italic">$149.00</td>
                                <td className="p-4 border-b border-fashion-orange/10">
                                    <button className="text-fashion-orange font-bold text-xs mr-4 hover:underline">EDIT</button>
                                    <button className="text-red-500 font-bold text-xs hover:underline">DELETE</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
