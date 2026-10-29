import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { Product } from '../data/shopData';

interface ProductArtworkProps {
  product: Product;
  className?: string;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({ product, className = '' }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError || !product.imageUrl) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-200 p-6 select-none ${className}`}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 text-white shadow-sm"
          style={{ backgroundColor: product.accentColor || '#d97706' }}
        >
          <Package className="w-8 h-8" />
        </div>
        <span className="text-sm font-semibold text-center line-clamp-1">{product.name}</span>
        <span className="text-xs text-stone-500 dark:text-zinc-400 mt-1">{product.subcategory}</span>
      </div>
    );
  }

  return (
    <img
      src={product.imageUrl}
      alt={product.name}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={`object-cover w-full h-full ${className}`}
      loading="lazy"
    />
  );
};
