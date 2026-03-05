import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Settings = () => {
    const [storeInfo, setStoreInfo] = useState({ name: '', email: '', phone: '', address: '' });
    const [seoMetadata, setSeoMetadata] = useState({ title: '', description: '', keywords: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        const { data } = await supabase.from('settings').select('*');
        if (data) {
            const info = data.find(s => s.key === 'store_info');
            const seo = data.find(s => s.key === 'seo_metadata');
            if (info) setStoreInfo(info.value);
            if (seo) setSeoMetadata(seo.value);
        }
        setIsLoading(false);
    };

    const handleSave = async (key, value) => {
        setIsSaving(true);
        const { error } = await supabase
            .from('settings')
            .upsert({ key, value, updated_at: new Date().toISOString() });

        if (error) {
            alert('SAVE ERROR: ' + error.message);
        } else {
            alert('CONFIGURATION UPDATED IN VAULT');
        }
        setIsSaving(false);
    };

    if (isLoading) return <div className="p-20 text-center text-white/50 uppercase tracking-widest">Loading Configuration...</div>;

    return (
        <div className="max-w-4xl mx-auto selection:bg-brand-orange selection:text-white pb-20">
            <div className="mb-12">
                <h2 className="text-3xl font-light text-white tracking-[0.2em] relative inline-block">
                    SYSTEM <span className="font-bold text-brand-orange drop-shadow-[0_0_8px_rgba(255,123,0,0.4)]">CONFIG</span>
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-brand-orange to-transparent mt-4"></div>
            </div>

            <div className="space-y-10">
                {/* Store Info */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                    <h3 className="text-lg font-light text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                        Store Identity <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Brand Name</label>
                            <input
                                type="text"
                                value={storeInfo.name}
                                onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Contact Email</label>
                            <input
                                type="email"
                                value={storeInfo.email}
                                onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => handleSave('store_info', storeInfo)}
                        disabled={isSaving}
                        className="mt-8 px-8 py-3 rounded-full bg-brand-gradient text-white font-bold uppercase tracking-widest text-xs hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        Save Identity
                    </button>
                </div>

                {/* SEO Metadata */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                    <h3 className="text-lg font-light text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                        SEO Strategy <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Meta Title</label>
                            <input
                                type="text"
                                value={seoMetadata.title}
                                onChange={(e) => setSeoMetadata({ ...seoMetadata, title: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Meta Description</label>
                            <textarea
                                value={seoMetadata.description}
                                onChange={(e) => setSeoMetadata({ ...seoMetadata, description: e.target.value })}
                                rows="3"
                                className="w-full px-5 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:border-brand-orange focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => handleSave('seo_metadata', seoMetadata)}
                        disabled={isSaving}
                        className="mt-8 px-8 py-3 rounded-full bg-brand-orange/20 border border-brand-orange text-brand-orange font-bold uppercase tracking-widest text-xs hover:bg-brand-orange hover:text-white transition-all disabled:opacity-50"
                    >
                        Apply SEO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
