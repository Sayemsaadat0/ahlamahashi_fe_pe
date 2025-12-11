'use client';

import React from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import HomeAddToCart from './HomeAddToCart';
import { MenuItem } from '@/hooks/menu.hooks';

export type MenuCardVariantType = 'default' | 'glass';

export interface MenuCardPropsType {
  item: any;
  onOrderClick?: (item: any) => void;
  showQuickAdd?: boolean;
  className?: string;
  variant?: MenuCardVariantType;
  badgeLabel?: string;
}

const defaultImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

const MenuCard: React.FC<MenuCardPropsType> = ({
  item,
  onOrderClick,
  className = '',
  variant = 'default',
}) => {
  const [isAddToCartOpen, setIsAddToCartOpen] = React.useState(false);

  const handleOrderClick = () => {
    if (item.status === 'published') {
      setIsAddToCartOpen(true);
      if (onOrderClick) {
        onOrderClick(item);
      }
    }
  };

  // const availabilityLabel = badgeLabel ?? (item.status === 'active' ? 'Available' : 'Unavailable');

  if (variant === 'glass') {
    return (
      <div
        className={`group relative h-[360px] overflow-hidden rounded-[24px] border border-white/15 bg-white/10  transition-all duration-500 hover:-translate-y-2 ${className}`}
      >
        <div className="absolute inset-0">
          <Image
            src={item.thumbnail || defaultImage}
            alt={item.name || item.title || 'Menu item'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = defaultImage;
            }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/40 to-black/80" />
        </div>

        <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
          <div className="flex items-start justify-between">
            {/* Use a-yellow-100 text for the badge, a-green-600 for text if you like */}
            <span className="inline-flex items-center rounded-full bg-a-yellow-100 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-a-green-600 shadow-lg shadow-a-green-600/10">
              {item.category?.name}
            </span>
          </div>

          <div className="mt-auto space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-white drop-shadow-sm">
                {item.name || item.title}
              </h3>
              <p className="mt-1.5 text-xs text-white/80 leading-relaxed line-clamp-2">
                {item.details || item.short_description || item.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-a-yellow-100 px-3 py-1.5 text-sm font-semibold text-a-green-600 shadow-md">
                  {item.prices && item.prices.length > 1
                    ? `${item.prices[0].price} AED - ${item.prices[item.prices.length - 1].price} AED`
                    : `${item.prices?.[0]?.price || item.actual_price || 0} AED`
                  }
                </span>
              </div>

              <button
                onClick={handleOrderClick}
                disabled={item.status !== 'published'}
                className="grid h-10 w-10 place-items-center rounded-full bg-a-yellow-100 text-a-green-600 shadow-lg shadow-a-green-600/30 transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Add to cart"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
        <HomeAddToCart
          item={item as MenuItem}
          isOpen={isAddToCartOpen}
          onClose={() => setIsAddToCartOpen(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${className}`}
    >
      <div className="relative h-60 sm:h-64 w-full overflow-hidden">
        <Image
          src={item.thumbnail || defaultImage}
          alt={item.name || item.title || 'Menu item'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />

      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-3">
          <h3 className="font-bold text-lg sm:text-xl text-a-green-600">
            {item.name || item.title}
          </h3>
        </div>

        <p className="text-a-green-600/80 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2">
          {item.details || item.short_description || item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-xl sm:text-2xl text-a-green-600">
              {item.prices && item.prices.length > 1
                ? `${item.prices[0].price} AED - ${item.prices[item.prices.length - 1].price} AED`
                : `${item.prices?.[0]?.price || item.actual_price || 0} AED`
              }
            </span>
          </div>

          <button
            onClick={handleOrderClick}
            disabled={item.status !== 'published'}
            className="grid h-10 w-10 place-items-center rounded-full bg-a-yellow-100 text-a-green-600 shadow-lg shadow-a-green-600/30 transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Add to cart"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
      <HomeAddToCart
        item={item as MenuItem}
        isOpen={isAddToCartOpen}
        onClose={() => setIsAddToCartOpen(false)}
      />
    </div>
  );
};

export default MenuCard;
