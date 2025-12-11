"use client";

import { useRouter } from 'next/navigation';
import { useGetCreatedCart } from '@/hooks/cart.hooks';
import CheckoutForm from '@/components/pages/checkout-page/CheckoutForm';
import CheckoutSummary from '@/components/pages/checkout-page/CheckoutSummary';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartResponse, isLoading, isError } = useGetCreatedCart();

  const cartData = cartResponse?.data;
  const cartItems = cartData?.items || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-backrgound">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-backrgound">
        <div className="text-center">
          <p className="text-gray-500 font-medium mb-4">Failed to load cart</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-a-green-600 text-white rounded-lg hover:bg-a-green-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-backrgound py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-500">Complete your order details</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-lg text-gray-600 mb-6">You have no selected items</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-a-green-600 text-white rounded-lg hover:bg-a-green-700 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backrgound py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-500">Complete your order details</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Cart Summary */}
          <div className="order-2 lg:order-1">
            <CheckoutSummary cartData={cartData} />
          </div>

          {/* Right Side - Checkout Form */}
          <div className="order-1 lg:order-2">
            <CheckoutForm cartData={cartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

