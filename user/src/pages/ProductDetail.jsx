import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (data) {
            setProduct(data);
            // Select first available size by default
            const firstSize = Object.entries(data.stock || {}).find(([size, qty]) => qty > 0);
            if (firstSize) setSelectedSize(firstSize[0]);
        }
        setIsLoading(false);
    };

    const addToCart = () => {
        if (!selectedSize) {
            alert('PLEASE SELECT A SIZE VARIANT');
            return;
        }

        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.discounted_price,
            size: selectedSize,
            image: product.images?.[0],
            quantity: 1
        };

        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        existingCart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(existingCart));

        navigate('/cart');
    };

    if (isLoading) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin mb-6"></div>
            <p className="font-medium text-[10px] text-brand-dark/50 uppercase tracking-[0.3em]">Accessing Asset File...</p>
        </div>
    );
    if (!product) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-4xl font-light text-brand-dark mb-4 tracking-[0.1em] uppercase">Asset <span className="text-brand-orange font-bold">Not Found</span></h2>
            <p className="font-medium uppercase tracking-[0.2em] text-brand-dark/50 text-xs">The requested item may have been archived or removed from the vault.</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-20 px-6 selection:bg-brand-orange selection:text-white mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <div className="aspect-[3/4] border border-black/5 rounded-2xl bg-black/5 shadow-inner overflow-hidden relative group backdrop-blur-sm">
                        {product.images?.[activeImage] ? (
                            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-dark/20 font-medium uppercase tracking-[0.2em] text-sm">NO PREVIEW AVAILABLE</div>
                        )}

                        {product.images?.length > 1 && (
                            <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md border border-black/5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-brand-orange px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
                                ASSET {activeImage + 1} OF {product.images.length}
                            </div>
                        )}
                    </div>

                    {product.images?.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-brand-orange shadow-[0_0_15px_rgba(255,123,0,0.3)] -translate-y-1' : 'border-black/5 opacity-60 hover:opacity-100 hover:border-black/20'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="px-3 py-1.5 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-[8px] font-bold rounded-full uppercase tracking-[0.3em] flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                            PREMIUM SERIES
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-black/10 to-transparent"></div>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light uppercase tracking-[0.1em] mb-4 text-brand-dark leading-tight">
                        {product.name}
                    </h1>

                    <div className="flex items-baseline gap-6 mb-12">
                        <span className="text-4xl font-bold tracking-wider text-brand-orange">${product.discounted_price}</span>
                        {product.original_price > product.discounted_price && (
                            <>
                                <span className="text-lg font-medium text-brand-dark/40 line-through tracking-wider">${product.original_price}</span>
                                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full ml-auto uppercase tracking-[0.2em]">
                                    SAVE {Math.round((1 - product.discounted_price / product.original_price) * 100)}%
                                </span>
                            </>
                        )}
                    </div>

                    <p className="text-sm font-medium text-brand-dark/70 uppercase tracking-[0.15em] leading-loose mb-14 border-l border-brand-orange/50 pl-6 border-black/5 max-w-xl">
                        {product.description}
                    </p>

                    <div className="mb-14">
                        <div className="flex justify-between items-end mb-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-dark/50">Select Specification (Size)</h3>
                            <button className="text-[10px] font-semibold text-brand-orange uppercase tracking-[0.2em] hover:text-brand-dark transition-colors underline decoration-brand-orange/30 underline-offset-4">Size Guide</button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {product.stock && Object.entries(product.stock).map(([size, qty]) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    disabled={qty === 0}
                                    className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${qty === 0 ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' : (selectedSize === size ? 'bg-brand-orange text-white scale-105' : 'bg-white border border-black/10 text-brand-dark hover:border-brand-orange hover:bg-gray-50 hover:text-brand-orange')}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 flex h-6 items-center">
                            {selectedSize && product.stock[selectedSize] > 0 ? (
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    AVAILABLE: {product.stock[selectedSize]} IN VAULT
                                </p>
                            ) : selectedSize ? (
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    CURRENTLY OUT OF STOCK
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={addToCart}
                            className="w-full py-5 rounded-full bg-brand-dark hover:bg-black text-white font-bold uppercase tracking-[0.2em] text-sm transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                ADD TO ARCHIVE
                            </span>
                        </button>
                    </div>

                    {/* Secondary Info */}
                    <div className="mt-16 grid grid-cols-2 gap-8 border-t border-black/5 pt-10">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-brand-orange flex-shrink-0 shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <div>
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark/50 block mb-1">AUTHENTICITY</span>
                                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-brand-dark/80">100% QUALITY GUARANTEED</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-brand-orange flex-shrink-0 shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark/50 block mb-1">SHIPPING</span>
                                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-brand-dark/80">EXPRESS GLOBAL LOGISTICS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
