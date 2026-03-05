import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const UploadProducts = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        original_price: '',
        discounted_price: '',
        stock: {
            'S': 0,
            'M': 0,
            'L': 0,
            'XL': 0
        },
        images: ['', '', '', ''],
        is_archived: false,
        category_id: null,
        is_new_in: false,
        new_in_duration: 7
    });
    const [newSize, setNewSize] = useState('');
    const [uploadingIndex, setUploadingIndex] = useState(null);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
        if (editId) {
            fetchProductForEdit();
        }
    }, [editId]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
    };

    const fetchProductForEdit = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', editId)
            .single();

        if (data) {
            setFormData({
                ...data,
                images: data.images || ['', '', '', ''],
                is_new_in: data.is_new_in || false,
                new_in_duration: data.new_in_until
                    ? Math.max(0, Math.ceil((new Date(data.new_in_until) - new Date()) / (1000 * 60 * 60 * 24)))
                    : 7
            });
        }
        setIsLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStockChange = (size, value) => {
        setFormData(prev => ({
            ...prev,
            stock: {
                ...prev.stock,
                [size]: parseInt(value) || 0
            }
        }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({
            ...prev,
            images: newImages
        }));
    };

    const handleFileUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingIndex(index);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            handleImageChange(index, publicUrl);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploadingIndex(null);
        }
    };

    const addCustomSize = () => {
        if (!newSize.trim()) return;
        setFormData(prev => ({
            ...prev,
            stock: {
                ...prev.stock,
                [newSize.toUpperCase()]: 0
            }
        }));
        setNewSize('');
    };

    const removeSize = (size) => {
        setFormData(prev => {
            const newStock = { ...prev.stock };
            delete newStock[size];
            return { ...prev, stock: newStock };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            ...formData,
            original_price: parseFloat(formData.original_price),
            discounted_price: parseFloat(formData.discounted_price),
            images: formData.images.filter(img => img.trim() !== ''),
            new_in_until: formData.is_new_in
                ? new Date(Date.now() + formData.new_in_duration * 24 * 60 * 60 * 1000).toISOString()
                : null
        };

        // Remove helper field from payload
        delete payload.new_in_duration;

        if (payload.images.length < 4) {
            alert('STRATEGIC REQUIREMENT: Please provide AT LEAST 4 product image URLs for a premium appearance.');
            setIsLoading(false);
            return;
        }

        try {
            let result;
            if (editId) {
                result = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', editId);
            } else {
                result = await supabase
                    .from('products')
                    .insert([payload]);
            }

            if (result.error) throw result.error;

            alert(editId ? 'ASSET UPDATED SUCCESSFULLY' : 'ASSET UPLOADED TO VAULT');
            navigate('/products');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('VAULT ERROR: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto selection:bg-brand-orange selection:text-white pb-20">
            <div className="mb-12">
                <h1 className="text-3xl font-light text-white tracking-[0.2em] relative inline-block">
                    {editId ? 'UPDATE' : 'UPLOAD'} <span className="font-bold text-brand-orange drop-shadow-[0_0_8px_rgba(255,123,0,0.4)]">ASSET</span>
                </h1>
                <div className="h-px w-24 bg-gradient-to-r from-brand-orange to-transparent mt-4"></div>
                <p className="text-xs font-medium text-white/50 uppercase tracking-[0.1em] mt-3">
                    {editId ? `Editing Product ID: ${editId}` : 'Onboarding new inventory item'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Visual Identity (Images) */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                    <h2 className="text-lg font-light text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                        Asset Gallery (Max 4) <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {formData.images.map((imgUrl, index) => (
                            <div key={index} className="space-y-3">
                                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] ml-1">
                                    IMAGE SLOT {index + 1} {index === 0 && <span className="text-brand-orange ml-2 tracking-widest bg-brand-orange/10 px-2 py-0.5 rounded text-[8px]">(PRIMARY)</span>}
                                </label>
                                <div className="space-y-3">
                                    <div className="relative h-12 bg-black/30 border border-white/10 rounded-xl overflow-hidden hover:border-brand-orange/50 transition-all group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(index, e)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            disabled={uploadingIndex === index}
                                        />
                                        <div className="px-4 py-3 text-[10px] font-bold text-white/40 flex items-center justify-center gap-3">
                                            {uploadingIndex === index ? (
                                                <span className="animate-pulse">UPLOADING...</span>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 group-hover:text-brand-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                    <span className="group-hover:text-white transition-colors uppercase tracking-widest">CHOOSE LOCAL FILE</span>
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
                                        placeholder="https://example.com/image.jpg"
                                        value={imgUrl}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all text-sm placeholder:text-white/30 shadow-inner"
                                    />
                                </div>
                                {imgUrl && (
                                    <div className="w-full h-48 rounded-xl bg-black/40 border border-white/10 overflow-hidden mt-3 shadow-inner relative group/preview">
                                        <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleImageChange(index, '')}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity hover:bg-red-500"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technical Specifications */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                    <h2 className="text-lg font-light text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                        Specifications <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Asset Nomenclature (Name)</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Strategic Overview (Description)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Category</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all [&>option]:bg-brand-dark"
                                >
                                    <option value="">SELECT COLLECTION</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-6">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_archived}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_archived: e.target.checked }))}
                                            className="w-6 h-6 rounded-md border border-white/30 bg-black/20 appearance-none cursor-pointer checked:bg-brand-orange checked:border-brand-orange transition-all peer"
                                        />
                                        <span className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100 font-bold transition-opacity">✓</span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.2em] group-hover:text-white transition-colors">ARCHIVE ASSET</span>
                                </label>

                                <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_new_in}
                                                onChange={(e) => setFormData(prev => ({ ...prev, is_new_in: e.target.checked }))}
                                                className="w-6 h-6 rounded-md border border-white/30 bg-black/20 appearance-none cursor-pointer checked:bg-brand-orange checked:border-brand-orange transition-all peer"
                                            />
                                            <span className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100 font-bold transition-opacity">✓</span>
                                        </div>
                                        <span className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.2em] group-hover:text-white transition-colors">MARK AS "NEW IN"</span>
                                    </label>

                                    {formData.is_new_in && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            <label className="block text-[8px] font-bold text-brand-orange uppercase tracking-[0.2em] mb-2 ml-1">DURATION (DAYS)</label>
                                            <input
                                                type="number"
                                                value={formData.new_in_duration}
                                                onChange={(e) => setFormData(prev => ({ ...prev, new_in_duration: parseInt(e.target.value) || 0 }))}
                                                min="1"
                                                className="w-24 px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-orange transition-all"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stock Distribution */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                    <h2 className="text-lg font-light text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                        Stock Allocation <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </h2>

                    <div className="space-y-8">
                        {/* Dynamic Size Inputs */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {Object.entries(formData.stock).map(([size, qty]) => (
                                <div key={size} className="relative group/size">
                                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">SIZE {size}</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={qty}
                                            onChange={(e) => handleStockChange(size, e.target.value)}
                                            min="0"
                                            className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all text-center"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSize(size)}
                                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover/size:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Custom Size UI */}
                        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-end gap-4">
                            <div className="flex-1 w-full">
                                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Add Custom Size Key</label>
                                <input
                                    type="text"
                                    placeholder="e.g. XXL, UK 10, ONE SIZE"
                                    value={newSize}
                                    onChange={(e) => setNewSize(e.target.value.toUpperCase())}
                                    className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 text-white font-medium focus:outline-none focus:border-brand-orange transition-all uppercase"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addCustomSize}
                                className="px-6 py-3 rounded-xl bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-orange transition-all whitespace-nowrap h-[46px]"
                            >
                                + ADD SIZE
                            </button>
                        </div>
                    </div>
                </div>

                {/* Financial Engineering (Pricing) */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                    <h2 className="text-lg font-light text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                        Commercial Pricing <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">MSRP (Original Price $)</label>
                            <input
                                type="number"
                                name="original_price"
                                value={formData.original_price}
                                onChange={handleInputChange}
                                step="0.01"
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Flash Price (Discounted $)</label>
                            <input
                                type="number"
                                name="discounted_price"
                                value={formData.discounted_price}
                                onChange={handleInputChange}
                                step="0.01"
                                className="w-full px-5 py-4 rounded-xl bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-bold tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Final Verification */}
                <div className="flex flex-col md:flex-row gap-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-5 rounded-full bg-brand-gradient text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,123,0,0.3)] hover:shadow-[0_0_30px_rgba(255,123,0,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                        {isLoading ? 'EXECUTING TRANSACTION...' : (editId ? 'COMMIT ASSET UPDATE' : 'ONBOARD ASSET TO VAULT')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/products')}
                        className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/10 hover:text-brand-orange transition-all"
                    >
                        ABORT
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadProducts;