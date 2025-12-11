"use client";
import React from "react";
import { Store, AlertCircle, Loader2 } from "lucide-react";
import {
  useUpdateRestaurant,
  useGetMyRestaurant,
} from "@/hooks/restaurant.hook";
import { toast } from "sonner";

type ShopOpenFormProps = {
  onChanged?: () => void;
};

const ShopOpenForm: React.FC<ShopOpenFormProps> = ({ onChanged }) => {
  const { data: restaurantResponse, isLoading, refetch } = useGetMyRestaurant();
  const { mutateAsync: updateRestaurant, isPending: updateLoading } =
    useUpdateRestaurant(restaurantResponse?.data?.restaurant?.id || 1);

  const restaurant = restaurantResponse?.data?.restaurant;

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-a-green-600" />
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Shop Settings
          </h3>
          <p className="text-gray-600 text-sm">No restaurant data found</p>
        </div>
      </div>
    );
  }

  const handleShopToggle = async () => {
    try {
      const result = await updateRestaurant({
        isShopOpen: !restaurant.isShopOpen,
      });

      if (result?.success) {
        toast.success(result.message || "Shop status updated successfully");
        if (onChanged) onChanged();
        refetch();
      } else {
        toast.error(result?.message || "Failed to update shop status");
      }
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while updating shop status"
      );
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Shop Settings
        </h3>

        <div className="space-y-6">
          {/* Shop Status Toggle */}
          <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Open Shop
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  By turning this on, your restaurant will start taking orders
                  from customers. When turned off, customers {"won't "} be able
                  to place new orders, but existing orders will continue to be
                  processed.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      restaurant.isShopOpen
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        restaurant.isShopOpen ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    {restaurant.isShopOpen
                      ? "Currently Open"
                      : "Currently Closed"}
                  </div>
                  {!restaurant.isShopOpen && (
                    <div className="flex items-center gap-1 text-orange-600 text-xs">
                      <AlertCircle size={12} />
                      <span>Not taking orders</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex-shrink-0">
              <button
                onClick={handleShopToggle}
                disabled={updateLoading || !restaurant}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-a-green-600 focus:ring-offset-2 disabled:opacity-50 ${
                  restaurant.isShopOpen ? "bg-a-green-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    restaurant.isShopOpen ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOpenForm;
