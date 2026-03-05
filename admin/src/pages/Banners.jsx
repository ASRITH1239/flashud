import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [newBanner, setNewBanner] = useState({ image_url: '', title: '', subtitle: '', link_url: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setIsLoading(true);
        const { data } = await supabase
            .from('banners')
            .select('*')
            .order('display_order', { ascending: true });
        if (data) setBanners(data);
        setIsLoading(false);
    };

    const handleAddBanner = async (e) => {
        e.preventDefault();
        if (!newBanner.image_url) return;
        setIsSaving(true);
        const { error } = await supabase
            .from('banners')
            .insert([newBanner]);

        if (error) {
            alert('UPLOAD ERROR: ' + error.message);
        } else {
            setNewBanner({ image_url: '', title: '', subtitle: '', link_url: '' });
            fetchBanners();
        }
        setIsSaving(false);
    };

    const deleteBanner = async (id) => {
        if (!window.confirm('Remove this banner from circulation?')) return;
        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (error) alert('Error');
        else fetchBanners();
    };

    return (
        <div className="max-w-5xl mx-auto selection:bg-brand-orange selection:text-white pb-20">
            <div className="mb-12">
                <h2 className="text-3xl font-light text-white tracking-[0.2em] relative inline-block">
                    HERO <span className="font-bold text-brand-orange drop-shadow-[0_0_8px_rgba(255,123,0,0.4)]">CAROUSEL</span>
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-brand-orange to-transparent mt-4"></div>
            </div>

            {/* Add Banner Form */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl mb-16">
                <h3 className="text-lg font-light text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                    Deploy New Asset <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                </h3>
                <form onSubmit={handleAddBanner} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="IMAGE URL (E.G. HTTPS://...)"
                            value={newBanner.image_url}
                            onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
                            className="px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all placeholder:text-white/30"
                            required
                        />
                        <input
                            type="text"
                            placeholder="TARGET URL (DESTINATION)"
                            value={newBanner.link_url}
                            onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                            className="px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all placeholder:text-white/30"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="PRIMARY TITLE (OPTIONAL)"
                            value={newBanner.title}
                            onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                            className="px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all placeholder:text-white/30"
                        />
                        <input
                            type="text"
                            placeholder="SUBTITLE / CALL TO ACTION"
                            value={newBanner.subtitle}
                            onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                            className="px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all placeholder:text-white/30"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-4 rounded-xl bg-brand-gradient text-white font-bold uppercase tracking-[0.2em] shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        {isSaving ? 'UPLOADING...' : 'SAVE TO CAROUSEL'}
                    </button>
                </form>
            </div>

            {/* Banner List */}
            <div className="grid grid-cols-1 gap-8">
                {isLoading ? (
                    <div className="p-20 text-center text-white/50 animate-pulse">Scanning Vault...</div>
                ) : banners.length > 0 ? banners.map((banner) => (
                    <div key={banner.id} className="relative aspect-[21/9] rounded-3xl overflow-hidden group border border-white/10 shadow-2xl">
                        <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                            <h4 className="text-3xl font-bold text-white uppercase tracking-wider mb-2">{banner.title}</h4>
                            <p className="text-white/70 uppercase tracking-widest text-sm">{banner.subtitle}</p>
                            <div className="absolute top-6 right-6">
                                <button
                                    onClick={() => deleteBanner(banner.id)}
                                    className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="p-20 text-center bg-white/5 rounded-3xl border border-white/10 text-white/30 uppercase tracking-[0.2em]">No Active Banners</div>
                )}
            </div>
        </div>
    );
};

export default Banners;
