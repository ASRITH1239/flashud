import { supabase } from '../lib/supabaseClient';
import { STORAGE_BUCKET } from '../lib/constants';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', thumbnail_url: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

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
            .insert([{ name: newCategory.name, slug, thumbnail_url: newCategory.thumbnail_url }]);

        if (error) {
            alert('Error creating collection: ' + error.message);
        } else {
            setNewCategory({ name: '', slug: '', thumbnail_url: '' });
            fetchCategories();
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `categories/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, file);

            if (uploadError) {
                if (uploadError.message.includes('Bucket not found')) {
                    alert(`CRITICAL ERROR: Supabase bucket "${STORAGE_BUCKET}" not found. Please create it in your Supabase Dashboard under Storage -> New Bucket.`);
                }
                console.error('SUPABASE STORAGE ERROR:', uploadError);
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath);


            setNewCategory(prev => ({ ...prev, thumbnail_url: publicUrl }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading thumbnail: ' + error.message);
        } finally {
            setIsUploading(false);
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
                <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="NEW COLLECTION NAME (E.G. SUMMER '25)"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            className="flex-1 px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-white/30"
                            required
                        />
                        <div className="flex-1 space-y-4">
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
                                        <span className="animate-pulse tracking-widest">UPLOADING ASSET...</span>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 group-hover:text-brand-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            <span className="group-hover:text-white transition-colors tracking-widest">CHOOSE LOCAL THUMBNAIL</span>
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
                                placeholder="THUMBNAIL URL (HTTP://...)"
                                value={newCategory.thumbnail_url}
                                onChange={(e) => setNewCategory({ ...newCategory, thumbnail_url: e.target.value })}
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white font-medium tracking-wide focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-white/30"
                            />
                        </div>
                    </div>
                    {newCategory.thumbnail_url && (
                        <div className="w-full h-32 rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                            <img src={newCategory.thumbnail_url} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-brand-gradient text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,123,0,0.3)] hover:shadow-[0_0_30px_rgba(255,123,0,0.5)] hover:-translate-y-0.5 transition-all"
                    >
                        INITIALIZE COLLECTION
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
                        <div className="flex items-center gap-6">
                            {cat.thumbnail_url && (
                                <div className="w-16 h-16 rounded-xl border border-white/10 overflow-hidden flex-shrink-0">
                                    <img src={cat.thumbnail_url} alt={cat.name} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div>
                                <div className="font-medium text-xl text-white uppercase tracking-wider mb-1 group-hover:text-brand-orange transition-colors">
                                    {cat.name}
                                </div>
                                <code className="text-xs font-medium text-white/40 uppercase tracking-[0.1em]">SLUG: {cat.slug}</code>
                            </div>
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
