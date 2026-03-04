import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import inventoryManager from '../utils/inventoryManager';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [inventory, setInventory] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
        loadProducts();
    }, []);

    const loadProducts = () => {
        const allProducts = inventoryManager.getAllProducts();
        const allInventory = inventoryManager.getAllInventory();
        setProducts(allProducts);
        setInventory(allInventory);
    };

    const filteredProducts = products.filter(product => 
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockStatus = (productId) => {
        const productInventory = inventory[productId];
        if (!productInventory) return { status: 'unknown', color: 'text-gray-400' };
        
        const totalStock = productInventory.totalStock;
        if (totalStock === 0) return { status: 'OUT OF STOCK', color: 'text-red-500' };
        if (totalStock <= 5) return { status: 'LOW STOCK', color: 'text-yellow-500' };
        return { status: 'IN STOCK', color: 'text-green-500' };
    };

    const getSizeStockDisplay = (productId) => {
        const productInventory = inventory[productId];
        if (!productInventory) return 'N/A';
        
        return productInventory.sizes
            .filter(size => size.currentStock > 0)
            .map(size => `${size.size}(${size.currentStock})`)
            .join(', ') || 'OUT OF STOCK';
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            inventoryManager.deleteProduct(productId);
            loadProducts();
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-fashion-orange uppercase tracking-widest">Inventory</h2>
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white placeholder-gray-500"
                    />
                    <button 
                        onClick={() => navigate('/upload-product')}
                        className="px-6 py-2 bg-fashion-orange text-fashion-black font-bold border-2 border-fashion-orange hover:bg-transparent hover:text-fashion-orange transition-all"
                    >
                        ADD NEW PRODUCT
                    </button>
                </div>
            </div>

            {/* Inventory Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                {(() => {
                    const stats = inventoryManager.getInventoryStats();
                    return [
                        { label: 'Total Products', value: stats.totalProducts },
                        { label: 'Total Items', value: stats.totalStockItems },
                        { label: 'Low Stock', value: stats.lowStockCount, color: 'text-yellow-500' },
                        { label: 'Out of Stock', value: stats.outOfStockCount, color: 'text-red-500' }
                    ];
                })().map((stat, index) => (
                    <div key={index} className={`border-2 border-fashion-orange/20 p-4 text-center ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                         style={{ transitionDelay: `${index * 100}ms` }}>
                        <div className={`text-2xl font-bold ${stat.color || 'text-fashion-orange'}`}>{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="border-2 border-fashion-orange/20 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-fashion-orange/10">
                        <tr>
                            <th className="p-4 border-b-2 border-fashion-orange/20 uppercase text-xs tracking-widest font-bold">Product</th>
                            <th className="p-4 border-b-2 border-fashion-orange/20 uppercase text-xs tracking-widest font-bold">Size Stock</th>
                            <th className="p-4 border-b-2 border-fashion-orange/20 uppercase text-xs tracking-widest font-bold">Total Stock</th>
                            <th className="p-4 border-b-2 border-fashion-orange/20 uppercase text-xs tracking-widest font-bold">Price</th>
                            <th className="p-4 border-b-2 border-fashion-orange/20 uppercase text-xs tracking-widest font-bold">Status</th>
                            <th className="p-4 border-b-2 border-fashion-orange/20 uppercase text-xs tracking-widest font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-400">
                                    {searchTerm ? 'No products found matching your search' : 'No products in inventory. Add your first product!'}
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product, index) => {
                                const stockStatus = getStockStatus(product.id);
                                const productInventory = inventory[product.id];
                                
                                return (
                                    <tr key={product.id} className={`hover:bg-fashion-orange/5 transition-colors ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                                         style={{ transitionDelay: `${index * 50}ms` }}>
                                        <td className="p-4 border-b border-fashion-orange/10">
                                            <div className="font-bold">{product.productName}</div>
                                            <div className="text-sm opacity-50">{product.productDescription?.substring(0, 50)}...</div>
                                        </td>
                                        <td className="p-4 border-b border-fashion-orange/10">
                                            <div className="text-sm">
                                                {getSizeStockDisplay(product.id)}
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-fashion-orange/10">
                                            <div className="font-mono">{productInventory?.totalStock || 0}</div>
                                        </td>
                                        <td className="p-4 border-b border-fashion-orange/10">
                                            <div className="font-mono italic">${product.discountedPrice}</div>
                                        </td>
                                        <td className="p-4 border-b border-fashion-orange/10">
                                            <span className={`font-bold text-xs ${stockStatus.color}`}>
                                                {stockStatus.status}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b border-fashion-orange/10">
                                            <button 
                                                onClick={() => navigate('/sales-management')}
                                                className="text-fashion-orange font-bold text-xs mr-4 hover:underline"
                                            >
                                                SELL
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/upload-product?edit=${product.id}`)}
                                                className="text-fashion-orange font-bold text-xs mr-4 hover:underline"
                                            >
                                                EDIT
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="text-red-500 font-bold text-xs hover:underline"
                                            >
                                                DELETE
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
