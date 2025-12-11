'use client';

import { CartData } from '@/hooks/cart.hooks';

interface CheckoutSummaryProps {
  cartData: CartData | undefined;
}

export default function CheckoutSummary({ cartData }: CheckoutSummaryProps) {
  const cartItems = cartData?.items || [];
  const subtotal = cartData?.items_price || 0;
  const deliveryFee = cartData?.charges?.delivery_charges || 0;
  const taxPrice = cartData?.charges?.tax_price || 0;
  const discountAmount = cartData?.discount?.amount || 0;
  const total = cartData?.payable_price || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-40">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-2.5 mb-5 pb-5 border-b border-gray-100">
        {cartItems.map((item, index) => {
          const itemTotal = item.price.price * item.quantity;
          return (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 py-2.5"
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <span className="text-xs text-gray-400 shrink-0 mt-0.5">
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>Qty: {item.quantity}</span>
                    <span>•</span>
                    <span>{item.price.price.toFixed(2)} AED</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-semibold text-gray-900">
                  {itemTotal.toFixed(2)} AED
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Summary */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Food Total</span>
          <span className="text-gray-900 font-medium">{subtotal.toFixed(2)} AED</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery</span>
          <span className="text-gray-900 font-medium">{deliveryFee.toFixed(2)} AED</span>
        </div>

        {taxPrice > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>VAT ({cartData?.charges?.tax}%)</span>
            <span className="text-gray-900 font-medium">{taxPrice.toFixed(2)} AED</span>
          </div>
        )}

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-a-green-600">
            <span>Discount</span>
            <span className="font-semibold">-{discountAmount.toFixed(2)} AED</span>
          </div>
        )}

        <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
          <span className="text-base font-bold text-gray-900">Total</span>
          <span className="text-xl font-bold text-a-green-600">{total.toFixed(2)} AED</span>
        </div>
      </div>
    </div>
  );
}

