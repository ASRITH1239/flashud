import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import inventoryManager from '../utils/inventoryManager';

const UploadProducts = () => {
    const navigate = useNavigate();
    
    // Form state
    const [formData, setFormData] = useState({
        productName: '',
        productDescription: '',
        actualPrice: '',
        discountedPrice: '',
        couponCode: '',
        sizes: [
            { size: 'S', stock: 0 },
            { size: 'M', stock: 0 },
            { size: 'L', stock: 0 },
            { size: 'XL', stock: 0 }
        ],
        images: {
            static: [true, true, true, true], // 4 pre-defined images
            dynamic: [] // User uploaded images
        }
    });

    // Static image placeholders
    const staticImagePlaceholders = [
        'https://picsum.photos/seed/product1/300/300.jpg',
        'https://picsum.photos/seed/product2/300/300.jpg',
        'https://picsum.photos/seed/product3/300/300.jpg',
        'https://picsum.photos/seed/product4/300/300.jpg'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...formData.sizes];
        if (field === 'size') {
            newSizes[index].size = value;
        } else if (field === 'stock') {
            newSizes[index].stock = parseInt(value) || 0;
        }
        setFormData(prev => ({
            ...prev,
            sizes: newSizes
        }));
    };

    const addSizeOption = () => {
        setFormData(prev => ({
            ...prev,
            sizes: [...prev.sizes, { size: '', stock: 0 }]
        }));
    };

    const removeSizeOption = (index) => {
        const newSizes = formData.sizes.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            sizes: newSizes
        }));
    };

    const toggleStaticImage = (index) => {
        const newStatic = [...formData.images.static];
        newStatic[index] = !newStatic[index];
        setFormData(prev => ({
            ...prev,
            images: {
                ...prev.images,
                static: newStatic
            }
        }));
    };

    const handleDynamicImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newDynamicImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        
        setFormData(prev => ({
            ...prev,
            images: {
                ...prev.images,
                dynamic: [...prev.images.dynamic, ...newDynamicImages]
            }
        }));
    };

    const removeDynamicImage = (index) => {
        const newDynamic = formData.images.dynamic.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            images: {
                ...prev.images,
                dynamic: newDynamic
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate that at least one size has stock
        const validSizes = formData.sizes.filter(s => s.size.trim() !== '' && parseInt(s.stock) > 0);
        if (validSizes.length === 0) {
            alert('Please add at least one size with stock quantity');
            return;
        }

        // Prepare data for submission
        const productData = {
            ...formData,
            actualPrice: parseFloat(formData.actualPrice),
            discountedPrice: parseFloat(formData.discountedPrice),
            sizes: formData.sizes.filter(s => s.size.trim() !== ''),
            images: {
                static: formData.images.static.map((enabled, index) => 
                    enabled ? staticImagePlaceholders[index] : null
                ).filter(Boolean),
                dynamic: formData.images.dynamic.map(img => img.file)
            }
        };

        try {
            // Save product using inventory manager
            const savedProduct = inventoryManager.addProduct(productData);
            console.log('Product saved successfully:', savedProduct);
            
            alert('Product uploaded successfully!');
            navigate('/products');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-fashion-orange uppercase tracking-widest mb-2">Upload New Product</h1>
                <p className="text-gray-400">Add a new product to your inventory</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="border-2 border-fashion-orange/20 p-6">
                    <h2 className="text-xl font-bold text-fashion-orange mb-4">Basic Information</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Product Description</label>
                            <textarea
                                name="productDescription"
                                value={formData.productDescription}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white resize-none"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Size Options and Stock */}
                <div className="border-2 border-fashion-orange/20 p-6">
                    <h2 className="text-xl font-bold text-fashion-orange mb-4">Size Options & Stock</h2>
                    
                    <div className="space-y-3">
                        {formData.sizes.map((sizeOption, index) => (
                            <div key={index} className="flex gap-4 items-center">
                                <input
                                    type="text"
                                    value={sizeOption.size}
                                    onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                                    placeholder="Size (e.g., S, M, L, XL)"
                                    className="flex-1 px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white"
                                />
                                <input
                                    type="number"
                                    value={sizeOption.stock}
                                    onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                                    placeholder="Stock"
                                    min="0"
                                    className="w-32 px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white"
                                />
                                {formData.sizes.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSizeOption(index)}
                                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        
                        <button
                            type="button"
                            onClick={addSizeOption}
                            className="px-4 py-2 bg-fashion-orange text-fashion-black font-bold rounded-lg hover:bg-transparent hover:text-fashion-orange border-2 border-fashion-orange transition-all"
                        >
                            Add Size Option
                        </button>
                    </div>
                </div>

                {/* Pricing */}
                <div className="border-2 border-fashion-orange/20 p-6">
                    <h2 className="text-xl font-bold text-fashion-orange mb-4">Pricing</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Actual Price ($)</label>
                            <input
                                type="number"
                                name="actualPrice"
                                value={formData.actualPrice}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Discounted Price ($)</label>
                            <input
                                type="number"
                                name="discountedPrice"
                                value={formData.discountedPrice}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-2">Coupon Code (Optional)</label>
                            <input
                                type="text"
                                name="couponCode"
                                value={formData.couponCode}
                                onChange={handleInputChange}
                                placeholder="Enter coupon code"
                                className="w-full px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="border-2 border-fashion-orange/20 p-6">
                    <h2 className="text-xl font-bold text-fashion-orange mb-4">Product Images</h2>
                    
                    {/* Static Images */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Pre-defined Images</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {staticImagePlaceholders.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img}
                                        alt={`Static image ${index + 1}`}
                                        className={`w-full h-32 object-cover rounded-lg border-2 ${formData.images.static[index] ? 'border-fashion-orange' : 'border-gray-600 opacity-50'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleStaticImage(index)}
                                        className={`absolute top-2 right-2 w-6 h-6 rounded-full ${formData.images.static[index] ? 'bg-fashion-orange text-fashion-black' : 'bg-gray-600 text-white'} flex items-center justify-center text-xs font-bold`}
                                    >
                                        {formData.images.static[index] ? '✓' : '+'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Images */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Upload Images</h3>
                        
                        <div className="mb-4">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleDynamicImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="inline-block px-4 py-2 bg-fashion-orange text-fashion-black font-bold rounded-lg hover:bg-transparent hover:text-fashion-orange border-2 border-fashion-orange transition-all cursor-pointer"
                            >
                                Choose Images
                            </label>
                        </div>

                        {formData.images.dynamic.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                                {formData.images.dynamic.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img.preview}
                                            alt={`Uploaded image ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-fashion-orange"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeDynamicImage(index)}
                                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-fashion-orange text-fashion-black font-bold rounded-lg hover:bg-transparent hover:text-fashion-orange border-2 border-fashion-orange transition-all"
                    >
                        Upload Product
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-transparent text-fashion-orange font-bold rounded-lg border-2 border-fashion-orange hover:bg-fashion-orange hover:text-fashion-black transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadProducts;