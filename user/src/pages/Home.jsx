import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import CollectionsGallery from '../components/CollectionsGallery';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [heroImage, setHeroImage] = useState(null);

    useEffect(() => {
        fetchFeatured();
        fetchHero();
    }, []);

    const fetchHero = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('name', '_HERO_IMAGE_')
            .single();
        if (data && data.images && data.images.length > 0) {
            setHeroImage(data.images[0]);
        }
    };

    const fetchFeatured = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('is_archived', false)
            .neq('name', '_HERO_IMAGE_')
            .limit(4);
        if (data) setFeaturedProducts(data);
    };

    return (
        <div className="mx-auto selection:bg-brand-orange selection:text-white pb-20 bg-white">
            {/* Hero Section */}
            <section className="relative w-full h-[100vh] overflow-hidden mb-12 md:mb-24 shadow-sm group">
                <div className="absolute inset-0 w-full h-full">
                    {heroImage ? (
                        <img src={heroImage} alt="Flashud Hero" className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full bg-black/5 flex items-center justify-center">
                            <span className="text-brand-dark/20 uppercase tracking-[0.2em] font-medium">Awaiting Hero Identity</span>
                        </div>
                    )}
                </div>

                {/* Hero Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-4xl md:text-8xl font-light mb-6 md:mb-8 tracking-[0.1em] leading-tight md:leading-none text-white uppercase drop-shadow-lg">
                        UPGRADE <span className="font-bold text-brand-orange">YOUR</span> IDENTITY
                    </h1>
                    <p className="text-[10px] md:text-sm font-medium tracking-[0.2em] mb-8 md:mb-12 text-white/90 uppercase max-w-2xl mx-auto drop-shadow-md">
                        Premium formal wear for the digital vanguard. Curated for those who demand excellence in every fiber. Step into the future of luxury.
                    </p>
                    <Link to="/shop" className="inline-block px-10 md:px-14 py-4 md:py-5 rounded-full bg-white text-brand-dark font-bold uppercase tracking-widest text-[10px] md:text-sm hover:bg-brand-orange hover:text-white hover:-translate-y-1 transition-all shadow-xl">
                        ENTER THE ARCHIVE
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-12 right-12 font-medium text-[10px] text-white/70 uppercase tracking-[0.3em] hidden md:block drop-shadow-sm">
                    AUTHENTIC // INNOVATIVE // REFINED
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6">
                {/* Collections Gallery */}
                <CollectionsGallery />

                {/* Featured Grid */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 border-b border-black/5 pb-6">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[0.2em] text-brand-dark">FEATURED <span className="font-bold text-brand-orange">DROPS</span></h2>
                            <p className="text-[9px] md:text-[10px] font-semibold text-brand-dark/50 uppercase tracking-[0.2em] mt-3">Limited availability / Zero compromise</p>
                        </div>
                        <Link to="/shop" className="text-[10px] font-bold text-brand-dark/60 hover:text-brand-orange transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                            View All
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {featuredProducts.length > 0 ? featuredProducts.map((product) => (
                            <Link to={`/product/${product.id}`} key={product.id} className="group bg-white border border-black/5 rounded-2xl p-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500">
                                <div className="aspect-[3/4] bg-black/5 rounded-xl mb-6 relative overflow-hidden shadow-inner">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-medium opacity-20 uppercase tracking-[0.2em] text-xs">Awaiting Asset</div>
                                    )}
                                    {/* Updated New Drop Logic: Check if is_new_in is true AND new_in_until is in the future */}
                                    {product.is_new_in && product.new_in_until && new Date(product.new_in_until) > new Date() && (
                                        <div className="absolute top-3 left-3 bg-brand-orange/10 border border-brand-orange/30 backdrop-blur-md text-brand-orange px-3 py-1.5 rounded-full font-bold text-[8px] uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(255,123,0,0.1)]">
                                            NEW DROP
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-start px-1">
                                    <div className="max-w-[65%]">
                                        <h3 className="font-medium uppercase tracking-[0.1em] text-sm text-brand-dark group-hover:text-brand-orange transition-colors truncate">{product.name}</h3>
                                        <p className="text-[9px] font-semibold text-brand-dark/50 uppercase tracking-[0.2em] mt-2">PREMIUM QUALITY</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold tracking-wider text-brand-orange">${product.discounted_price}</div>
                                        <div className="text-[10px] text-brand-dark/40 line-through mt-1">${product.original_price}</div>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            [1, 2, 3, 4].map((i) => (
                                <div key={i} className="animate-pulse bg-white border border-black/5 rounded-2xl p-4">
                                    <div className="aspect-[3/4] bg-black/5 rounded-xl mb-6"></div>
                                    <div className="h-4 bg-black/10 rounded-full w-3/4 mb-3"></div>
                                    <div className="h-3 bg-black/5 rounded-full w-1/4"></div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Footer Branding (Temporary before real Global Footer) */}
                <div className="mt-32 pt-10 border-t border-black/5 text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.5em] text-brand-dark/30">© FLASHUD STOREFRONT // SECURE LUXURY COMMERCE</span>
                </div>
            </div>
        </div>
    );
};

export default Home;
