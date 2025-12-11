"use client";

import { Plus, Minus, Trash2, ShoppingBag, Tag, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/components/ui/use-mobile";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import {
  ApplyCouponPayload,
  useApplyDiscount,
  useGetCreatedCart,
  useDeleteCartItem,
  useUpdateCartItemQuantity,
  CartItem,
} from "@/hooks/cart.hooks";
import { useAuthStore } from "@/store/AuthStore";
import { useGuestStore } from "@/store/GuestStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const { data: cartResponse, isLoading, isError } = useGetCreatedCart();

  const cartData = cartResponse?.data;
  const cartItems = cartData?.items || [];
  const subtotal = cartData?.items_price || 0;
  const deliveryFee = cartData?.charges?.delivery_charges || 0;
  const taxPrice = cartData?.charges?.tax_price || 0;
  const discountAmount = cartData?.discount?.amount || 0;
  const total = cartData?.payable_price || 0;

  const { user } = useAuthStore();
  const { guestId } = useGuestStore();
  const { mutateAsync: applyDiscount, isPending: isApplyingCoupon } =
    useApplyDiscount();
  const { mutateAsync: deleteCartItem, isPending: isDeletingItem } =
    useDeleteCartItem();
  const { mutateAsync: updateQuantity, isPending: isUpdatingQuantity } =
    useUpdateCartItemQuantity();

  // Track local quantities for each item
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>(
    {}
  );
  const debounceTimersRef = useRef<Record<number, NodeJS.Timeout>>({});

  // Initialize quantities from cart items when cart changes
  useEffect(() => {
    const newQuantities: Record<number, number> = {};
    cartItems.forEach((item) => {
      // Use existing local quantity if available, otherwise use server quantity
      newQuantities[item.id] = itemQuantities[item.id] ?? item.quantity;
    });
    setItemQuantities(newQuantities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length]);

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = debounceTimersRef.current;
    return () => {
      Object.values(timers).forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  // Reset coupon applied state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setIsCouponApplied(false);
      setCouponCode("");
    }
  }, [isOpen]);

  // Check if discount is already applied from cart data
  useEffect(() => {
    if (discountAmount > 0 && cartData?.discount?.coupon) {
      setIsCouponApplied(true);
      setCouponCode(cartData.discount.coupon);
    } else if (discountAmount === 0) {
      setIsCouponApplied(false);
    }
  }, [discountAmount, cartData?.discount?.coupon]);

  // Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || isCouponApplied) {
      return;
    }

    const payload: ApplyCouponPayload = { code: couponCode.trim() };

    if (user?.id) {
      payload.user_id = user.id;
    } else if (guestId) {
      payload.guest_id = guestId;
    }

    try {
      const response = await applyDiscount(payload);
      if (response?.status === 200 || response?.data?.success) {
        setIsCouponApplied(true);
        toast.success("Coupon applied successfully");
      }
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      toast.error("Failed to apply coupon. Please try again.");
    }
  };

  // Delete Item from Cart
  const handleDeleteItem = async (item: (typeof cartItems)[0]) => {
    try {
      const payload: Partial<CartItem> = {
        item_id: item.item_id || item.id, // Use item_id if available, otherwise use cart item id
        item_price_id: item.price.id,
      };

      // Add user_id if user is available, otherwise add guest_id
      if (user?.id) {
        payload.user_id = user.id;
      } else if (guestId) {
        payload.guest_id = guestId;
      }

      const response = await deleteCartItem(payload);
      if (response.status === 200) {
        toast.success("Item removed from cart");
      } else {
        toast.error(
          response?.data?.message || "Failed to remove item. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Failed to delete item:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to remove item. Please try again."
      );
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (
    item: (typeof cartItems)[0],
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      return; // Don't allow quantities less than 1
    }

    try {
      const payload: Partial<CartItem> = {
        item_id: item.item_id || item.id,
        item_price_id: item.price.id,
        quantity: newQuantity,
      };

      // Add user_id if user is available, otherwise add guest_id
      if (user?.id) {
        payload.user_id = user.id;
      } else if (guestId) {
        payload.guest_id = guestId;
      }

      await updateQuantity(payload);
    } catch (error: any) {
      console.error("Failed to update quantity:", error);
      // toast.error(error?.response?.data?.message || 'Failed to update quantity. Please try again.');
      // Revert to original quantity on error
      setItemQuantities((prev) => ({
        ...prev,
        [item.id]: item.quantity,
      }));
    }
  };

  const handleQuantityChange = (item: (typeof cartItems)[0], delta: number) => {
    const currentQuantity = itemQuantities[item.id] || item.quantity;
    const newQuantity = Math.max(1, currentQuantity + delta);

    // Update local state immediately
    setItemQuantities((prev) => ({
      ...prev,
      [item.id]: newQuantity,
    }));

    // Clear existing timer for this item
    if (debounceTimersRef.current[item.id]) {
      clearTimeout(debounceTimersRef.current[item.id]);
    }

    // Set new debounced timer (1 second delay)
    debounceTimersRef.current[item.id] = setTimeout(() => {
      handleUpdateQuantity(item, newQuantity);
      delete debounceTimersRef.current[item.id];
    }, 1000);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        direction={isMobile ? "bottom" : "right"}
        className={
          isMobile
            ? "max-h-[90vh]"
            : "w-[480px] lg:w-[540px] xl:w-[580px] max-w-[580px]"
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-2 border-b border-gray-100">
          <div>
            <DrawerTitle className="text-2xl font-bold text-gray-900 mb-1">
              Shopping Cart
            </DrawerTitle>
            <p className="text-sm text-gray-500">
              {isLoading ? "Loading..." : cartItems.length}{" "}
              {cartItems.length === 1 ? "item" : "items"}
            </p>
          </div>
          <DrawerClose asChild>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </DrawerClose>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading cart...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Failed to load cart</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors bg-white"
              >
                <div
                  className={`${
                    isMobile ? "w-20 h-20" : "w-24 h-24"
                  } rounded-xl overflow-hidden shrink-0 relative bg-gray-100`}
                >
                  <Image
                    src={defaultImage}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between ">
                    <h3 className="text-base font-semibold text-gray-900 pr-2">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      disabled={isDeletingItem}
                      className="p-1.5 cursor-pointer hover:bg-red-50 rounded-lg transition-colors group shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                  <p className="text-emerald-600 font-bold text-base mb-3">
                    {item.price.price.toFixed(2)} AED
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item, -1)}
                      disabled={
                        isUpdatingQuantity ||
                        (itemQuantities[item.id] || item.quantity) <= 1
                      }
                      className="w-8 cursor-pointer group h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-a-green-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-600 group-hover:text-white" />
                    </button>
                    <span className="text-gray-900 font-medium text-sm w-8 text-center">
                      {itemQuantities[item.id] ?? item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item, 1)}
                      disabled={isUpdatingQuantity}
                      className="w-8 group cursor-pointer h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-a-green-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-600 group-hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-white px-8 py-6 space-y-5">
          {/* Coupon Section */}
          {discountAmount === 0 && (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={isCouponApplied}
                  className="pl-10 h-10 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <Button
                onClick={handleApplyCoupon}
                disabled={
                  isCouponApplied || isApplyingCoupon || !couponCode.trim()
                }
                className="rounded-lg bg-a-green-50 hover:bg-a-green-100 text-a-green-700 border border-a-green-200 px-4 h-10 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApplyingCoupon ? "Applying..." : "Apply"}
              </Button>
            </div>
          )}

          {/* Price Summary */}
          <div className="space-y-2.5 pt-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="text-gray-900">{subtotal.toFixed(2)} AED</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Discount </span>
                <span className="font-medium">
                  - {discountAmount.toFixed(2)} AED (
                  {cartData?.discount?.coupon})
                </span>
              </div>
            )}
            {taxPrice > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax {`${cartData?.charges?.tax}%`} </span>
                <span className="text-gray-900">{taxPrice.toFixed(2)} AED</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery</span>
              <span className="text-gray-900">
                {deliveryFee.toFixed(2)} AED
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-a-green-600">
                {total.toFixed(2)} AED
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="flex justify-between items-center w-full">
            {cartItems.length > 0 && (
              <button
                onClick={() => {
                  if (
                    !isLoading &&
                    !isUpdatingQuantity &&
                    !isDeletingItem &&
                    !isApplyingCoupon
                  ) {
                    router.push("/checkout");
                  }
                }}
                disabled={
                  isLoading ||
                  isUpdatingQuantity ||
                  isDeletingItem ||
                  isApplyingCoupon
                }
                className="w-full h-12 flex items-center justify-center bg-a-green-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
