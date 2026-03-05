import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    // Check if any size has stock > 0
    const isInStock = product.stock && Object.entries(product.stock).some(([size, qty]) => qty > 0);

    return (
        <Link to={`/product/${product.id}`} className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] block">
            <div className="aspect-[3/4] bg-black/40 rounded-xl mb-6 relative overflow-hidden shadow-inner flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                ) : (
                    <div className="font-medium opacity-20 uppercase tracking-[0.2em] text-xs px-4 text-center">
                        Awaiting Asset
                    </div>
                )}

                {/* Out of Stock Overlay */}
                {!isInStock && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-500/80 text-white font-bold px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] shadow-lg">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-2 px-1">
                <h3 className="font-medium uppercase tracking-[0.1em] text-sm text-white/90 group-hover:text-brand-orange transition-colors truncate">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                        <span className="text-sm font-bold tracking-wider text-brand-orange">
                            ${product.discounted_price}
                        </span>
                        {product.original_price > product.discounted_price && (
                            <span className="text-[10px] font-semibold text-white/30 line-through">
                                ${product.original_price}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-1">
                        {isInStock ? (
                            <span className="text-[8px] font-bold tracking-[0.2em] text-green-400 bg-green-400/10 px-2 py-1 rounded-full uppercase border border-green-400/20">
                                In Stock
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
