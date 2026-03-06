import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useSearchParams } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const catParam = searchParams.get('category');
        if (catParam) {
            setSelectedCategory(catParam);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchData();
    }, [selectedCategory, sortBy]);

    const fetchData = async () => {
        setIsLoading(true);

        // Fetch Categories
        const { data: catData } = await supabase.from('categories').select('*');
        if (catData) setCategories(catData);

        // Fetch Products
        let query = supabase.from('products').select('*').eq('is_archived', false);

        if (selectedCategory !== 'all') {
            query = query.eq('category_id', selectedCategory);
        }

        if (sortBy === 'price-low') query = query.order('discounted_price', { ascending: true });
        else if (sortBy === 'price-high') query = query.order('discounted_price', { ascending: false });
        else query = query.order('created_at', { ascending: false });

        const { data: prodData } = await query;
        if (prodData) {
            // Filter out internal setting products like _HERO_IMAGE_
            setProducts(prodData.filter(p => p.name !== '_HERO_IMAGE_'));
        }

        setIsLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto selection:bg-brand-orange selection:text-white pb-20 px-6 pt-32">
            {/* Shop Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-black/5 pb-8">
                <div>
                    <h1 className="text-5xl md:text-7xl font-light uppercase tracking-[0.1em] leading-none text-brand-dark">
                        THE <span className="font-bold text-brand-orange">ARCHIVE</span>
                    </h1>
                    <p className="text-[10px] font-semibold text-brand-dark/50 uppercase tracking-[0.4em] mt-4 flex items-center gap-3">
                        <span className="w-8 h-px bg-brand-orange"></span> PREMIUM PRODUCT CURATION
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-6 py-3.5 bg-white border border-black/5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] text-brand-dark shadow-sm focus:outline-none focus:border-brand-orange/50 transition-all appearance-none cursor-pointer pr-12 hover:bg-gray-50"
                        >
                            <option value="all" className="bg-white text-brand-dark">ALL COLLECTIONS</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-white text-brand-dark">{cat.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-orange">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    <div className="relative flex-1 md:flex-initial">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-6 py-3.5 bg-white border border-black/5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] text-brand-dark shadow-sm focus:outline-none focus:border-brand-orange/50 transition-all appearance-none cursor-pointer pr-12 hover:bg-gray-50"
                        >
                            <option value="newest" className="bg-white text-brand-dark">SORT: NEWEST</option>
                            <option value="price-low" className="bg-white text-brand-dark">PRICE: LOW-HIGH</option>
                            <option value="price-high" className="bg-white text-brand-dark">PRICE: HIGH-LOW</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-orange">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
                <div className="py-32 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-2 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin mb-6"></div>
                    <p className="font-medium text-[10px] text-brand-dark/50 uppercase tracking-[0.3em]">Decrypting Inventory Database...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="py-32 text-center border border-black/5 rounded-3xl bg-white shadow-sm">
                    <p className="font-medium uppercase tracking-[0.2em] text-brand-dark/50 text-sm">No assets found matching current parameters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <Link to={`/product/${product.id}`} key={product.id} className="group bg-white border border-black/5 rounded-2xl p-4 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] block">
                            <div className="aspect-[3/4] bg-black/5 rounded-xl mb-6 relative overflow-hidden shadow-inner">
                                {product.images?.[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-medium opacity-20 uppercase tracking-[0.2em] text-xs">Awaiting Asset</div>
                                )}
                            </div>
                            <div className="space-y-2 px-1">
                                <h3 className="font-medium uppercase tracking-[0.1em] text-sm text-brand-dark group-hover:text-brand-orange transition-colors truncate">{product.name}</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold tracking-wider text-brand-orange">${product.discounted_price}</span>
                                        <span className="text-[10px] font-semibold text-brand-dark/40 line-through">${product.original_price}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {/* Updated New Drop Logic for Shop Grid */}
                                        {product.is_new_in && product.new_in_until && new Date(product.new_in_until) > new Date() && (
                                            <span className="text-[8px] font-bold tracking-widest text-brand-orange bg-brand-orange/10 px-2 py-1 rounded-full uppercase border border-brand-orange/20 mr-1">New In</span>
                                        )}
                                        {product.stock && Object.entries(product.stock).some(([size, qty]) => qty > 0) ? (
                                            <span className="text-[8px] font-bold tracking-widest text-green-400 bg-green-400/10 px-2 py-1 rounded-full uppercase border border-green-400/20">In Stock</span>
                                        ) : (
                                            <span className="text-[8px] font-bold tracking-widest text-red-400 bg-red-400/10 px-2 py-1 rounded-full uppercase border border-red-400/20">Sold Out</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;
