import React, { useState, useEffect } from 'react';
import inventoryManager from '../utils/inventoryManager';

const SalesManagement = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [salesHistory, setSalesHistory] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
        loadProducts();
        loadSalesHistory();
    }, []);

    const loadProducts = () => {
        const allProducts = inventoryManager.getAllProducts();
        const inventory = inventoryManager.getAllInventory();
        
        // Combine products with their inventory data
        const productsWithInventory = allProducts.map(product => ({
            ...product,
            inventory: inventory[product.id] || null
        })).filter(product => product.inventory && product.inventory.totalStock > 0);
        
        setProducts(productsWithInventory);
    };

    const loadSalesHistory = () => {
        // Get sales history from localStorage (simulated)
        const history = JSON.parse(localStorage.getItem('salesHistory') || '[]');
        setSalesHistory(history.slice(-10)); // Show last 10 sales
    };

    const handleSale = () => {
        if (!selectedProduct || !selectedSize || quantity <= 0) {
            alert('Please select product, size, and quantity');
            return;
        }

        const productInventory = inventoryManager.getProductInventory(selectedProduct);
        const sizeStock = productInventory.sizes.find(s => s.size === selectedSize);
        
        if (!sizeStock || sizeStock.currentStock < quantity) {
            alert(`Insufficient stock. Only ${sizeStock?.currentStock || 0} units available for size ${selectedSize}`);
            return;
        }

        // Process the sale
        const success = inventoryManager.processSale(selectedProduct, selectedSize, quantity);
        
        if (success) {
            // Record the sale
            const sale = {
                id: Date.now().toString(),
                productId: selectedProduct,
                productName: products.find(p => p.id === selectedProduct)?.productName,
                size: selectedSize,
                quantity: quantity,
                price: products.find(p => p.id === selectedProduct)?.discountedPrice || 0,
                total: quantity * (products.find(p => p.id === selectedProduct)?.discountedPrice || 0),
                timestamp: new Date().toISOString()
            };

            const history = JSON.parse(localStorage.getItem('salesHistory') || '[]');
            history.push(sale);
            localStorage.setItem('salesHistory', JSON.stringify(history));

            // Reset form and refresh data
            setSelectedProduct('');
            setSelectedSize('');
            setQuantity(1);
            loadProducts();
            loadSalesHistory();
            
            alert(`Sale processed: ${quantity} units of size ${selectedSize}`);
        } else {
            alert('Error processing sale. Please try again.');
        }
    };

    const handleReturn = (saleId) => {
        const sale = salesHistory.find(s => s.id === saleId);
        if (!sale) return;

        const success = inventoryManager.processReturn(sale.productId, sale.size, sale.quantity);
        
        if (success) {
            // Remove sale from history
            const updatedHistory = salesHistory.filter(s => s.id !== saleId);
            localStorage.setItem('salesHistory', JSON.stringify(updatedHistory));
            
            loadProducts();
            loadSalesHistory();
            
            alert(`Return processed: ${sale.quantity} units of ${sale.productName}`);
        } else {
            alert('Error processing return. Please try again.');
        }
    };

    const getAvailableSizes = () => {
        if (!selectedProduct) return [];
        const product = products.find(p => p.id === selectedProduct);
        return product?.inventory?.sizes.filter(s => s.currentStock > 0) || [];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className={`mb-8 transition-all duration-1000 transform ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-3xl font-bold text-fashion-orange uppercase tracking-widest mb-2">Sales Management</h1>
                <p className="text-gray-400">Process sales and manage inventory</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sale Form */}
                <div className={`border-2 border-fashion-orange/20 p-6 transition-all duration-1000 transform ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                     style={{ transitionDelay: '200ms' }}>
                    <h2 className="text-xl font-bold text-fashion-orange mb-6">Process Sale</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Product</label>
                            <select
                                value={selectedProduct}
                                onChange={(e) => {
                                    setSelectedProduct(e.target.value);
                                    setSelectedSize('');
                                }}
                                className="w-full px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white"
                            >
                                <option value="">Choose a product...</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.productName} - {product.inventory.totalStock} units total
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Select Size</label>
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                disabled={!selectedProduct}
                                className="w-full px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white disabled:opacity-50"
                            >
                                <option value="">Choose size...</option>
                                {getAvailableSizes().map(size => (
                                    <option key={size.size} value={size.size}>
                                        {size.size} - {size.currentStock} units available
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Quantity</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                max={getAvailableSizes().find(s => s.size === selectedSize)?.currentStock || 1}
                                className="w-full px-4 py-2 bg-fashion-black border border-fashion-orange/20 rounded-lg focus:outline-none focus:border-fashion-orange text-white"
                            />
                        </div>

                        <button
                            onClick={handleSale}
                            disabled={!selectedProduct || !selectedSize || quantity <= 0}
                            className="w-full px-6 py-3 bg-fashion-orange text-fashion-black font-bold rounded-lg hover:bg-transparent hover:text-fashion-orange border-2 border-fashion-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Process Sale
                        </button>
                    </div>
                </div>

                {/* Recent Sales */}
                <div className={`border-2 border-fashion-orange/20 p-6 transition-all duration-1000 transform ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                     style={{ transitionDelay: '400ms' }}>
                    <h2 className="text-xl font-bold text-fashion-orange mb-6">Recent Sales</h2>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {salesHistory.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No sales recorded yet</p>
                        ) : (
                            salesHistory.map(sale => (
                                <div key={sale.id} className="p-4 border border-fashion-orange/10 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-semibold">{sale.productName}</div>
                                            <div className="text-sm text-gray-400">
                                                Size: {sale.size} | Qty: {sale.quantity}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatDate(sale.timestamp)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-fashion-orange">
                                                ${sale.total.toFixed(2)}
                                            </div>
                                            <button
                                                onClick={() => handleReturn(sale.id)}
                                                className="text-xs text-red-400 hover:text-red-300 mt-1"
                                            >
                                                Return
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Stock Alerts */}
            <div className={`mt-8 border-2 border-fashion-orange/20 p-6 transition-all duration-1000 transform ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                 style={{ transitionDelay: '600ms' }}>
                <h2 className="text-xl font-bold text-fashion-orange mb-6">Stock Alerts</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                        const lowStockProducts = inventoryManager.getLowStockProducts();
                        const alerts = inventoryManager.getStockAlerts().filter(a => !a.acknowledged);
                        
                        return (
                            <>
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <div className="text-red-400 font-bold mb-2">Low Stock Items</div>
                                    {lowStockProducts.length === 0 ? (
                                        <p className="text-sm text-gray-400">No low stock items</p>
                                    ) : (
                                        <div className="space-y-1">
                                            {lowStockProducts.slice(0, 3).map(product => (
                                                <div key={product.productId} className="text-sm">
                                                    {product.productName}: {product.lowStockSizes.map(s => `${s.size}(${s.currentStock})`).join(', ')}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                    <div className="text-yellow-400 font-bold mb-2">Pending Alerts</div>
                                    {alerts.length === 0 ? (
                                        <p className="text-sm text-gray-400">No pending alerts</p>
                                    ) : (
                                        <div className="space-y-1">
                                            {alerts.slice(0, 3).map(alert => (
                                                <div key={alert.id} className="text-sm">
                                                    {alert.message}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

export default SalesManagement;
