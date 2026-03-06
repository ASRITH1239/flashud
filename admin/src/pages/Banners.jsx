import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { STORAGE_BUCKET } from '../lib/constants';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [newBanner, setNewBanner] = useState({ image_url: '', title: '', subtitle: '', link_url: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `banners/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, file);

            if (uploadError) {
                if (uploadError.message.includes('Bucket not found')) {
                    alert(`CRITICAL ERROR: Supabase bucket "${STORAGE_BUCKET}" not found. Please create it in your Supabase Dashboard.`);
                }
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath);

            setNewBanner(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading banner: ' + error.message);
        } finally {
            setIsUploading(false);
        }
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Banner Asset</label>

                            <div className="relative h-14 bg-black/30 border border-white/10 rounded-xl overflow-hidden hover:border-brand-orange/50 transition-all group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={isUploading}
                                />
                                <div className="px-5 py-4 text-[10px] font-bold text-white/40 flex items-center justify-center gap-3">
                                    {isUploading ? (
                                        <span className="animate-pulse tracking-widest uppercase">Uploading Asset...</span>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 group-hover:text-brand-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            <span className="group-hover:text-white transition-colors tracking-widest uppercase">Choose Local Image</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-white/5"></div>
                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">OR URL</span>
                                <div className="h-px flex-1 bg-white/5"></div>
                            </div>

                            <input
                                type="text"
                                placeholder="IMAGE URL (E.G. HTTPS://...)"
                                value={newBanner.image_url}
                                onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all placeholder:text-white/30"
                                required
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Destination URL</label>
                                <input
                                    type="text"
                                    placeholder="TARGET URL (DESTINATION)"
                                    value={newBanner.link_url}
                                    onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all placeholder:text-white/30"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Main Heading</label>
                                    <input
                                        type="text"
                                        placeholder="TITLE"
                                        value={newBanner.title}
                                        onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                                        className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all placeholder:text-white/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Subtitle</label>
                                    <input
                                        type="text"
                                        placeholder="SUBTITLE"
                                        value={newBanner.subtitle}
                                        onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                                        className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all placeholder:text-white/30"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {newBanner.image_url && (
                        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                            <img src={newBanner.image_url} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Live Preview</span>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSaving || isUploading}
                        className="w-full py-4 rounded-xl bg-brand-gradient text-white font-bold uppercase tracking-[0.2em] shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'DEPLOYING...' : 'SAVE TO CAROUSEL'}
                    </button>
                </form>
            </div>

            {/* Banner List */}
            <div className="grid grid-cols-1 gap-8">
                {isLoading ? (
                    <div className="p-20 text-center text-white/50 animate-pulse uppercase tracking-widest">Scanning Vault...</div>
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
                    <div className="p-20 text-center bg-white/5 rounded-3xl border border-white/10 text-white/30 uppercase tracking-[0.2em]">No Active Banners Found</div>
                )}
            </div>
        </div>
    );
};

export default Banners;

