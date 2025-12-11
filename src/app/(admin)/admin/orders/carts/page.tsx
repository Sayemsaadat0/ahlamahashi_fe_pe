"use client";

import React from "react";
import Link from "next/link";
import { useGetAdminCarts } from "@/hooks/cart.hooks";
import OrderItemsPreview from "@/components/admin/OrderItemsPreview";
import { OrderItem } from "@/hooks/orders.hooks";

const AdminCartsPage = () => {
  const { data, isLoading, error } = useGetAdminCarts();
  const carts = data?.data?.carts || [];
  const totalCarts = data?.data?.total || 0;

  const formatCurrency = (value?: number) =>
    typeof value === "number" ? `${value.toFixed(2)} AED` : "N/A";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Carts</h1>
          <p className="text-gray-600">
            Review {totalCarts} cart{totalCarts === 1 ? "" : "s"} before they
            convert into orders.
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex h-10 items-center bg-a-green-600 justify-center rounded-lg border border-gray-200 px-4 text-sm font-semibold text-white  hover:bg-gray-50"
        >
          Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Cart</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Loading carts...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-red-500">
                    Failed to fetch carts. Please try again.
                  </td>
                </tr>
              ) : carts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No carts found.
                  </td>
                </tr>
              ) : (
                carts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">
                      <p className="font-semibold text-gray-900">
                        Cart #{cart.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {cart.created_at
                          ? new Date(cart.created_at).toLocaleString()
                          : "—"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-gray-900">
                          User:{" "}
                            {cart.user_id || "—"}
                          </p>
                        <p className="text-xs text-gray-500">
                          Guest: {cart.guest_id || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <OrderItemsPreview
                        notes="No special notes for cart items."
                        items={(cart.items || []) as OrderItem[]}
                        itemsCount={cart.items?.length || 0}
                      />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-xs text-gray-500">
                        Items: {formatCurrency(cart.items_price)}
                      </p>
                      {cart.discount && cart.discount.amount > 0 && (
                        <p className="text-xs text-rose-500">
                          Disc: -{cart.discount.amount?.toFixed(2)} AED
                        </p>
                      )}
                      {cart.charges && (
                        <p className="text-xs text-gray-500">
                          Delivery:{" "}
                          {formatCurrency(cart.charges.delivery_charges)}
                        </p>
                      )}
                      <p className="text-base font-semibold text-a-green-700">
                        {formatCurrency(cart.payable_price)}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCartsPage;