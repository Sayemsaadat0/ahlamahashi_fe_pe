"use client";

import axiousResuest from "@/lib/axiousRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/AuthStore";
import { useGuestStore } from "@/store/GuestStore";

/**
 * Cart item type according to API payload
 */
export interface CartItem {
  guest_id?: string;
  user_id?: number;
  item_id: number;
  item_price_id: number;
  quantity: number;
}

export interface CartPayload {
  guest_id: string;
  items: CartItem[];
}

/**
 * Cart response types according to API response
 */
export interface CartItemPrice {
  id: number;
  price: number;
  size?: string;
}

export interface CartResponseItem {
  id: number;
  item_id?: number;
  title: string;
  quantity: number;
  price: CartItemPrice;
}

export interface CartDiscount {
  coupon: string;
  amount: number;
}

export interface CartCharges {
  tax: number;
  tax_price: number;
  delivery_charges: number;
}

export interface CartData {
  id: number;
  guest_id: string;
  user_id: string | null;
  user?: Record<string, unknown> | null;
  items: CartResponseItem[];
  items_price: number;
  discount: CartDiscount;
  charges: CartCharges;
  payable_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartResponse {
  success: boolean;
  status: number;
  message: string;
  data: CartData;
}

export interface AdminCartsList {
  carts: CartData[];
  total: number;
}

export interface AdminCartsResponse {
  success: boolean;
  status: number;
  message: string;
  data: AdminCartsList;
}

/**
 * Hook to create/add items to cart
 */
export const useCreateCart = () => {
  const queryClient = useQueryClient();
  // const { token } = useAuthStore();
  return useMutation({
    mutationFn: async (body: Partial<CartPayload>) =>
      await axiousResuest({
        url: `/api/cart/`,
        method: "post",
        data: body,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
  });
};

export const useGetCreatedCart = () => {
  const { user } = useAuthStore();
  const { guestId } = useGuestStore();

  // Ensure at least one is available
  const hasUserId = !!user?.id;
  const hasGuestId = !!guestId;

  return useQuery<CartResponse>({
    queryKey: ["cartList", user?.id, guestId],
    enabled: hasUserId || hasGuestId, // Only run query if at least one is available
    queryFn: () => {
      if (!hasUserId && !hasGuestId) {
        throw new Error("Either user_id or guest_id is required");
      }

      // Build query parameter - user_id takes priority over guest_id
      const queryParam = hasUserId
        ? `user_id=${user.id}`
        : `guest_id=${guestId}`;

      const url = `/api/cart/?${queryParam}`;

      return axiousResuest({
        url: url,
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });
};

export const useGetAdminCarts = () => {
  const { token } = useAuthStore();

  return useQuery<AdminCartsResponse>({
    queryKey: ["adminCarts"],
    queryFn: () => {
      if (!token) {
        throw new Error("Authentication token is required");
      }

      return axiousResuest({
        url: `/api/admin/carts`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!token,
  });
};

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<CartItem>) =>
      await axiousResuest({
        url: `/api/cart/update-quantity/`,
        data: body,
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
  });
};




export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<CartItem>) =>
      await axiousResuest({
        url: `/api/cart/item/`,
        data: body,
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
  });
};

// Discount
export interface ApplyCouponPayload {
  code: string;
  guest_id?: string;
  user_id?: number;
}

export const useApplyDiscount = () => {
  const queryClient = useQueryClient();
  // const { token } = useAuthStore();
  return useMutation({
    mutationFn: async (body: Partial<ApplyCouponPayload>) =>
      await axiousResuest({
        url: `/api/cart/apply-discount`,
        method: "post",
        data: body,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
  });
};
