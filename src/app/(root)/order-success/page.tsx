"use client";

import { useSearchParams } from "next/navigation";
import { useGetOrdersById } from "@/hooks/orders.hooks";
import { decode256 } from "@/lib/utils";
import RegisterViaOrder from "@/components/pages/checkout-page/RegisterViaOrder";
import { useAuthStore } from "@/store/AuthStore";
import { Suspense } from "react";

const OrderSuccessContainer = () => {
  const searchParams = useSearchParams();
  const orderDetails = searchParams.get("order_details");
  const decodedData = decode256(orderDetails || "");
  const decodedDataObject = JSON.parse(decodedData);
  const { data: orderResponse, isLoading } = useGetOrdersById(
    decodedDataObject ? decodedDataObject.id : 0
  );
  const orderData = orderResponse?.data;
  const { token } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 mb-4">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
              Order Not Found
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              The order you&apos;re looking for doesn&apos;t exist or may have
              been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const {
    cart_details,
    city_details,
    phone,
    email,
    state,
    zip_code,
    street_address,
    status,
    notes,
    created_at,
    order_id,
  } = orderData;
  const { items, items_price, charges, payable_price } = cart_details || {};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-900 mb-4">
            <svg
              className="w-6 h-6 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
            Order Confirmed
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <span className="font-medium text-gray-900">#{order_id}</span>
            <span>•</span>
            <span className="capitalize">{status}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {/* Order Items */}
          {items && items.length > 0 && (
            <div className="p-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Items
              </h2>
              <div className="space-y-4">
                {items.map((item: any, index: number) => (
                  <div key={index} className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.title}
                        </h3>
                        {item.price?.size && (
                          <span className="text-xs text-gray-500">
                            ({item.price.size})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 ml-4">
                      {(item.price?.price || 0) * item.quantity} AED
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="p-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items</span>
                <span className="text-gray-900 font-medium">
                  {items_price || 0} AED
                </span>
              </div>
              {charges?.tax_price > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Tax ({charges?.tax || 0}%)
                  </span>
                  <span className="text-gray-900 font-medium">
                    {charges?.tax_price || 0} AED
                  </span>
                </div>
              )}
              {charges?.delivery_charges > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-gray-900 font-medium">
                    {charges?.delivery_charges || 0} AED
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {payable_price || orderData.payable_amount || 0} AED
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="p-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Delivery
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm text-gray-900 leading-relaxed">
                  {street_address}
                  <br />
                  {state}, {zip_code}
                  {city_details?.name && `, ${city_details.name}`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                {phone && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm text-gray-900">{phone}</p>
                  </div>
                )}
                {email && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-900 break-all">{email}</p>
                  </div>
                )}
              </div>

              {created_at && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Order Date</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(created_at)}
                  </p>
                </div>
              )}

              {notes && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Register Via Order Section */}
        {email && !token && <RegisterViaOrder email={email} />}
      </div>
    </div>
  );
};



//Default
const OrderSuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContainer />
    </Suspense>
  );
};

export default OrderSuccessPage;
