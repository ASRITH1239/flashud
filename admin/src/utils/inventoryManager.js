// Inventory Management System
class InventoryManager {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem('products')) {
            localStorage.setItem('products', JSON.stringify([]));
        }
        if (!localStorage.getItem('inventory')) {
            localStorage.setItem('inventory', JSON.stringify({}));
        }
    }

    // Add new product with inventory
    addProduct(productData) {
        const products = this.getAllProducts();
        const inventory = this.getAllInventory();
        
        const newProduct = {
            id: Date.now().toString(),
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Initialize inventory for this product
        inventory[newProduct.id] = {
            productId: newProduct.id,
            productName: newProduct.productName,
            sizes: productData.sizes.map(size => ({
                ...size,
                currentStock: parseInt(size.stock) || 0,
                initialStock: parseInt(size.stock) || 0
            })),
            totalStock: productData.sizes.reduce((total, size) => total + (parseInt(size.stock) || 0), 0),
            lastUpdated: new Date().toISOString()
        };

        products.push(newProduct);
        
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        return newProduct;
    }

    // Get all products
    getAllProducts() {
        return JSON.parse(localStorage.getItem('products') || '[]');
    }

    // Get all inventory
    getAllInventory() {
        return JSON.parse(localStorage.getItem('inventory') || '{}');
    }

    // Get product by ID
    getProduct(productId) {
        const products = this.getAllProducts();
        return products.find(p => p.id === productId);
    }

    // Get inventory for specific product
    getProductInventory(productId) {
        const inventory = this.getAllInventory();
        return inventory[productId] || null;
    }

    // Update stock for specific size
    updateStock(productId, size, quantityChange, reason = 'sale') {
        const inventory = this.getAllInventory();
        const productInventory = inventory[productId];
        
        if (!productInventory) {
            console.error(`No inventory found for product ${productId}`);
            return false;
        }

        const sizeIndex = productInventory.sizes.findIndex(s => s.size === size);
        if (sizeIndex === -1) {
            console.error(`Size ${size} not found for product ${productId}`);
            return false;
        }

        const currentStock = productInventory.sizes[sizeIndex].currentStock;
        const newStock = currentStock + quantityChange;

        // Prevent negative stock
        if (newStock < 0) {
            console.error(`Insufficient stock for product ${productId}, size ${size}`);
            return false;
        }

        // Update the stock
        productInventory.sizes[sizeIndex].currentStock = newStock;
        productInventory.totalStock = productInventory.sizes.reduce((total, s) => total + s.currentStock, 0);
        productInventory.lastUpdated = new Date().toISOString();

        // Add stock history
        if (!productInventory.stockHistory) {
            productInventory.stockHistory = [];
        }

        productInventory.stockHistory.push({
            size,
            quantityChange,
            reason,
            previousStock: currentStock,
            newStock,
            timestamp: new Date().toISOString()
        });

        // Keep only last 50 history entries
        if (productInventory.stockHistory.length > 50) {
            productInventory.stockHistory = productInventory.stockHistory.slice(-50);
        }

        inventory[productId] = productInventory;
        localStorage.setItem('inventory', JSON.stringify(inventory));

        // Check for low stock alerts
        this.checkLowStock(productId, size, newStock);

        return true;
    }

    // Process sale (deduct stock)
    processSale(productId, size, quantity = 1) {
        return this.updateStock(productId, size, -quantity, 'sale');
    }

    // Process return (add stock back)
    processReturn(productId, size, quantity = 1) {
        return this.updateStock(productId, size, quantity, 'return');
    }

    // Manual stock adjustment
    adjustStock(productId, size, quantity, reason = 'manual_adjustment') {
        return this.updateStock(productId, size, quantity, reason);
    }

    // Check for low stock and create alerts
    checkLowStock(productId, size, currentStock) {
        const LOW_STOCK_THRESHOLD = 5;
        const alerts = JSON.parse(localStorage.getItem('stockAlerts') || '[]');
        
        if (currentStock <= LOW_STOCK_THRESHOLD && currentStock > 0) {
            const product = this.getProduct(productId);
            const alert = {
                id: Date.now().toString(),
                productId,
                productName: product.productName,
                size,
                currentStock,
                threshold: LOW_STOCK_THRESHOLD,
                type: 'low_stock',
                message: `Low stock alert: ${product.productName} (Size ${size}) - ${currentStock} units remaining`,
                createdAt: new Date().toISOString(),
                acknowledged: false
            };

            // Check if alert already exists for this product/size
            const existingAlert = alerts.find(a => 
                a.productId === productId && 
                a.size === size && 
                a.type === 'low_stock' && 
                !a.acknowledged
            );

            if (!existingAlert) {
                alerts.push(alert);
                localStorage.setItem('stockAlerts', JSON.stringify(alerts));
            }
        }

        // Out of stock alert
        if (currentStock === 0) {
            const product = this.getProduct(productId);
            const alert = {
                id: Date.now().toString(),
                productId,
                productName: product.productName,
                size,
                currentStock: 0,
                type: 'out_of_stock',
                message: `Out of stock: ${product.productName} (Size ${size})`,
                createdAt: new Date().toISOString(),
                acknowledged: false
            };

            const existingAlert = alerts.find(a => 
                a.productId === productId && 
                a.size === size && 
                a.type === 'out_of_stock' && 
                !a.acknowledged
            );

            if (!existingAlert) {
                alerts.push(alert);
                localStorage.setItem('stockAlerts', JSON.stringify(alerts));
            }
        }
    }

    // Get stock alerts
    getStockAlerts() {
        return JSON.parse(localStorage.getItem('stockAlerts') || '[]');
    }

    // Acknowledge alert
    acknowledgeAlert(alertId) {
        const alerts = this.getStockAlerts();
        const alert = alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            localStorage.setItem('stockAlerts', JSON.stringify(alerts));
            return true;
        }
        return false;
    }

    // Get products with low stock
    getLowStockProducts() {
        const inventory = this.getAllInventory();
        const lowStockProducts = [];

        Object.values(inventory).forEach(productInventory => {
            const lowStockSizes = productInventory.sizes.filter(size => size.currentStock <= 5);
            if (lowStockSizes.length > 0) {
                lowStockProducts.push({
                    productId: productInventory.productId,
                    productName: productInventory.productName,
                    lowStockSizes: lowStockSizes,
                    totalStock: productInventory.totalStock
                });
            }
        });

        return lowStockProducts;
    }

    // Get inventory statistics
    getInventoryStats() {
        const inventory = this.getAllInventory();
        const products = this.getAllProducts();
        
        const totalProducts = products.length;
        const totalValue = Object.values(inventory).reduce((total, inv) => {
            const product = this.getProduct(inv.productId);
            const avgPrice = (parseFloat(product.actualPrice) + parseFloat(product.discountedPrice)) / 2;
            return total + (inv.totalStock * avgPrice);
        }, 0);

        const lowStockCount = this.getLowStockProducts().length;
        const outOfStockCount = Object.values(inventory).filter(inv => inv.totalStock === 0).length;

        return {
            totalProducts,
            totalValue,
            lowStockCount,
            outOfStockCount,
            totalStockItems: Object.values(inventory).reduce((total, inv) => total + inv.totalStock, 0)
        };
    }

    // Delete product and its inventory
    deleteProduct(productId) {
        const products = this.getAllProducts();
        const inventory = this.getAllInventory();
        
        const updatedProducts = products.filter(p => p.id !== productId);
        delete inventory[productId];
        
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        return true;
    }
}

// Create singleton instance
const inventoryManager = new InventoryManager();

export default inventoryManager;
