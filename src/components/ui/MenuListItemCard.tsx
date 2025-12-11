'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import MenuPageAddToCart from './MenuPageAddToCart';
import { CategorisedMenuItem } from '@/hooks/menu.hooks';

export interface MenuListItemCardPropsType {
  item: any;
  className?: string;
  categoryName?: string;
}

const defaultImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

const MenuListItemCard: React.FC<MenuListItemCardPropsType> = ({
  item,
  className = '',
  categoryName,
}) => {
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(false);

  const handleAddClick = () => {
    setIsAddToCartOpen(true);
  };

  // Get prices from prices array
  const prices = item.prices && Array.isArray(item.prices) && item.prices.length > 0
    ? item.prices.map((p: any) => p.price).sort((a: number, b: number) => a - b)
    : null;

  // Format price display: "from X to Y" or single price
  const getPriceDisplay = () => {
    if (!prices || prices.length === 0) {
      // Fallback to old price fields
      const fallbackPrice = item.actual_price || item.price;
      if (fallbackPrice) {
        return `${typeof fallbackPrice === 'number' ? fallbackPrice.toFixed(2) : fallbackPrice} AED`;
      }
      return '0.00 AED';
    }

    if (prices.length === 1) {
      return `${prices[0].toFixed(2)} AED`;
    }

    const firstPrice = prices[0].toFixed(2);
    const lastPrice = prices[prices.length - 1].toFixed(2);
    return `from ${firstPrice} to ${lastPrice} AED`;
  };

  const itemName = item.name || item.title || 'Menu Item';
  const itemDescription = item.details || item.short_description || item.description || '';

  return (
    <div
      className={`group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-a-green-600/30 hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* Image - Left Side */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={item.thumbnail || defaultImage}
          alt={itemName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
      </div>

      {/* Content - Middle */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-1 mb-1 group-hover:text-a-green-600 transition-colors">
          {itemName}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {itemDescription}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg sm:text-xl font-bold text-a-green-600">
            {getPriceDisplay()}
          </span>
        </div>
      </div>

      {/* Add Button - Right Side */}
      <div className="shrink-0">
        <button
          onClick={handleAddClick}
          disabled={item.status === 'unpublished' || item.isAvailable === false}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-a-green-600 text-white flex items-center justify-center shadow-lg hover:bg-a-green-700 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Add to cart"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Add to Cart Dialog */}
      <MenuPageAddToCart
        item={item as CategorisedMenuItem}
        isOpen={isAddToCartOpen}
        onClose={() => setIsAddToCartOpen(false)}
        categoryName={categoryName}
      />
    </div>
  );
};

export default MenuListItemCard;

