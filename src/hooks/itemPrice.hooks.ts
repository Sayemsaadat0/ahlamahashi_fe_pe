"use client";

import axiousResuest from "@/lib/axiousRequest";
import { useAuthStore } from "@/store/AuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Item Price type according to API response
 */

export interface ItemPrice {
  id: number;
  price: number;
  size?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ItemPriceData {
  prices: ItemPrice[];
  total: number;
}

export interface ItemPriceResponse {
  success: boolean;
  status: number;
  message: string;
  data: ItemPriceData;
}

export interface ItemPricePayload {
  price: number;
  size?: string;
}

export const useCreateItemPrice = (item_id: number) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  return useMutation({
    mutationFn: async (body: ItemPricePayload) =>
      await axiousResuest({
        url: `/api/items/${item_id}/prices`,
        method: "post",
        data: body,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuList"] });
    },
  });
};

export const useUpdateItemPrice = (item_id: number, price_id: number) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  return useMutation({
    mutationFn: async (body: ItemPricePayload) =>
      await axiousResuest({
        url: `/api/items/${item_id}/prices/${price_id}`,
        method: "put",
        data: body,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuList"] });
    },
  });
};

export const useDeleteItemPrice = (item_id: number, price_id: number) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  return useMutation({
    mutationFn: async () =>
      await axiousResuest({
        url: `/api/items/${item_id}/prices/${price_id}`,
        method: "delete",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuList"] });
    },
  });
};
