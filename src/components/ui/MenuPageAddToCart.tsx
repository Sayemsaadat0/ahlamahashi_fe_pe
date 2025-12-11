'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Button } from './button';
import { CategorisedMenuItem } from '@/hooks/menu.hooks';
import { useCreateCart, CartPayload } from '@/hooks/cart.hooks';
import { useGuestStore } from '@/store/GuestStore';
import { toast } from 'sonner';

export interface AddToCartPropsType {
  item: CategorisedMenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

const defaultImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

const MenuPageAddToCart: React.FC<AddToCartPropsType> = ({
  item,
  isOpen,
  onClose,
  categoryName,
}) => {
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  const { guestId } = useGuestStore();
  const { mutateAsync, isPending } = useCreateCart();

  // Safe access to item properties
  const itemName = item?.name || 'Menu Item';
  const itemDescription = item?.description || '';
  const prices = useMemo(() => {
    return Array.isArray(item?.prices) ? item.prices : [];
  }, [item?.prices]);

  // Reset selected price and quantity when dialog closes or item changes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPriceId(null);
      setQuantity(1);
      setError(null);
      setImageError(false);
    } else if (item && prices.length > 0) {
      try {
        // Auto-select first price when dialog opens
        const firstPrice = prices[0];
        if (firstPrice && typeof firstPrice.id === 'number') {
          setSelectedPriceId(firstPrice.id);
          setQuantity(1);
          setError(null);
        } else {
          setError('Invalid price data');
        }
      } catch (err) {
        console.error('Error initializing price:', err);
        setError('Failed to load price information');
      }
    } else if (item && prices.length === 0) {
      setError('No sizes available for this item');
    }
  }, [isOpen, item?.id, prices, item]);

  // Early return with error handling (after all hooks)
  if (!item) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Error
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle size={20} />
            <p>Item information is not available. Please try again.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handlePriceSelect = (priceId: number) => {
    try {
      if (!priceId || typeof priceId !== 'number') {
        setError('Invalid price selection');
        return;
      }
      setSelectedPriceId(priceId);
      setError(null);
    } catch (err) {
      console.error('Error selecting price:', err);
      setError('Failed to select price');
    }
  };

  const handleIncreaseQuantity = () => {
    try {
      setQuantity((prev) => {
        const newQuantity = prev + 1;
        if (newQuantity > 999) {
          setError('Maximum quantity is 999');
          return prev;
        }
        setError(null);
        return newQuantity;
      });
    } catch (err) {
      console.error('Error increasing quantity:', err);
      setError('Failed to update quantity');
    }
  };

  const handleDecreaseQuantity = () => {
    try {
      setQuantity((prev) => {
        const newQuantity = Math.max(1, prev - 1);
        setError(null);
        return newQuantity;
      });
    } catch (err) {
      console.error('Error decreasing quantity:', err);
      setError('Failed to update quantity');
    }
  };

  const handleAddToCart = async () => {
    try {
      setError(null);

      // Validate guest ID
      if (!guestId) {
        setError('Guest ID is required. Please refresh the page.');
        return;
      }

      // Validate size selection
      if (selectedPriceId === null) {
        setError('Please select a size');
        return;
      }

      // Validate prices array
      if (!Array.isArray(prices) || prices.length === 0) {
        setError('No sizes available for this item');
        return;
      }

      // Find selected price
      const selectedPrice = prices.find((p) => p && p.id === selectedPriceId);
      if (!selectedPrice) {
        setError('Selected size is no longer available');
        return;
      }

      // Validate price value
      if (typeof selectedPrice.price !== 'number' || selectedPrice.price <= 0) {
        setError('Invalid price value');
        return;
      }

      // Validate quantity
      if (typeof quantity !== 'number' || quantity < 1 || quantity > 999) {
        setError('Invalid quantity');
        return;
      }

      // Validate item ID
      if (!item.id || typeof item.id !== 'number') {
        setError('Invalid item ID');
        return;
      }

      // Prepare payload
      const payload: CartPayload = {
        guest_id: guestId,
        items: [
          {
            item_id: item.id,
            item_price_id: selectedPriceId,
            quantity: quantity,
          },
        ],
      };

      // Call the mutation
      const response = await mutateAsync(payload);
      if (response.status === 200) {
        toast.success('Item added to cart successfully');
      } else {
        toast.error(response.data.message);
      }

      // Close dialog on success
      onClose();
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      setError(err?.response?.data?.message || err?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const selectedPrice = prices.find((p) => p && p.id === selectedPriceId);
  const totalPrice = selectedPrice && typeof selectedPrice.price === 'number' && typeof quantity === 'number'
    ? selectedPrice.price * quantity
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90%] overflow-auto">
        <DialogHeader>
         
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {itemName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Item Image */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
            {!imageError ? (
              <Image
                src={item.thumbnail || defaultImage}
                alt={itemName}
                fill
                className="object-cover"
                onError={(e) => {
                  try {
                    setImageError(true);
                    e.currentTarget.src = defaultImage;
                  } catch (err) {
                    console.error('Error handling image error:', err);
                    setImageError(true);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                <AlertCircle size={32} />
              </div>
            )}


             {categoryName && (
            <div className="mb-1">
              <span className="absolute left-2 right-2 top-2 w-fit  inline-flex items-center rounded-full bg-a-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-a-green-600">
                {categoryName}
              </span>
            </div>
          )}
          </div>

          {/* Description */}
          {itemDescription && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {itemDescription}
            </p>
          )}

          {/* Size Selection Section - Only show when there are multiple prices */}
          {prices.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {prices.map((price) => (
                  <button
                    key={price.id}
                    onClick={() => handlePriceSelect(price.id)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${selectedPriceId === price.id
                      ? 'border-a-green-600 bg-a-green-600 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-a-green-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        {price.size || `Size ${price.id}`}
                      </span>
                      {selectedPriceId === price.id && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Total Price Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Quantity</h3>
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 bg-white text-gray-700 flex items-center justify-center hover:border-a-green-600 hover:bg-a-green-50 hover:text-a-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-bold text-gray-900 min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 bg-white text-gray-700 flex items-center justify-center hover:border-a-green-600 hover:bg-a-green-50 hover:text-a-green-700 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Total Price */}
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 mb-1">Total</span>
                <span className="text-2xl font-bold text-a-green-600">
                  {totalPrice.toFixed(2)} AED
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={selectedPriceId === null || prices.length === 0 || !!error || isPending}
            className="w-full bg-a-green-600 cursor-pointer hover:bg-a-green-700 text-white h-12 text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuPageAddToCart;

