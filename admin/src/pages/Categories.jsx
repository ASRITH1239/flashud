import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (data) setCategories(data);
        setIsLoading(false);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name) return;

        const slug = newCategory.name.toLowerCase().replace(/ /g, '-');

        const { error } = await supabase
            .from('categories')
            .insert([{ name: newCategory.name, slug }]);

        if (error) {
            alert('Error creating collection: ' + error.message);
        } else {
            setNewCategory({ name: '', slug: '' });
            fetchCategories();
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Delete this collection? This may affect linked products.')) return;

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) alert('Error deleting category');
        else fetchCategories();
    };

    return (
        <div className="max-w-4xl mx-auto selection:bg-brand-orange selection:text-white pb-20">
            <div className="mb-12">
                <h2 className="text-3xl font-light text-white tracking-[0.2em] relative inline-block">
                    COLLECTION <span className="font-bold text-brand-orange drop-shadow-[0_0_8px_rgba(255,123,0,0.4)]">MATRIX</span>
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-brand-orange to-transparent mt-4"></div>
                <p className="text-xs font-medium text-white/50 uppercase tracking-[0.1em] mt-3">
                    Categorize your luxury inventory
                </p>
            </div>

            {/* Add Category Form */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl mb-16">
                <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="NEW COLLECTION NAME (E.G. SUMMER '25)"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="flex-1 px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-white/30"
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 rounded-xl bg-brand-gradient text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,123,0,0.3)] hover:shadow-[0_0_30px_rgba(255,123,0,0.5)] hover:-translate-y-0.5 transition-all"
                    >
                        INITIALIZE
                    </button>
                </form>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
                <h3 className="text-lg font-light text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-6">
                    Active Collections <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                </h3>

                {isLoading ? (
                    <div className="p-10 text-center font-medium uppercase tracking-[0.2em] text-white/50">Scanning Database...</div>
                ) : categories.length > 0 ? categories.map((cat) => (
                    <div key={cat.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex justify-between items-center group hover:bg-white/10 hover:shadow-[0_4px_20px_0_rgba(255,123,0,0.1)] transition-all duration-300">
                        <div>
                            <div className="font-medium text-xl text-white uppercase tracking-wider mb-1 group-hover:text-brand-orange transition-colors">
                                {cat.name}
                            </div>
                            <code className="text-xs font-medium text-white/40 uppercase tracking-[0.1em]">SLUG: {cat.slug}</code>
                        </div>
                        <button
                            onClick={() => deleteCategory(cat.id)}
                            className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:bg-red-500/20 hover:border-red-500/30 hover:text-white transition-all group-hover:border-white/20"
                        >
                            <span className="text-xl leading-none">×</span>
                        </button>
                    </div>
                )) : (
                    <div className="p-20 text-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                        <div className="font-medium text-white/40 uppercase tracking-[0.2em]">EMPTY MATRIX</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
