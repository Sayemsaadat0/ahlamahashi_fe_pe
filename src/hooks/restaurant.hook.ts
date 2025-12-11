"use client";

import axiousResuest from "@/lib/axiousRequest";
import { useAuthStore } from "@/store/AuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Restaurant type according to API response
 */
export interface Restaurant {
  id: number;
  privacy_policy: string;
  terms: string;
  refund_process: string;
  license: string;
  isShopOpen: boolean;
  shop_name: string;
  shop_address: string;
  shop_details: string;
  shop_phone?: string;
  tax?: number;
  delivery_charge?: number;
  shop_logo?: string;
  created_at: string;
  updated_at: string;
}

export interface RestaurantData {
  restaurant: Restaurant;
}

export interface RestaurantResponse {
  success: boolean;
  status: number;
  message: string;
  data: RestaurantData;
}

export const useGetMyRestaurant = () => {
  const { token } = useAuthStore();
  return useQuery<RestaurantResponse>({
    queryKey: ["myRestaurant", token],
    queryFn: () => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      return axiousResuest({
        url: `/api/my-restaurant`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!token, // Only run query when token is available
  });
};

export const useUpdateRestaurant = (id: number) => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: async (body: Partial<Restaurant> | FormData) => {
            if (!token) {
                throw new Error("No authentication token available");
            }
            const isFormData = body instanceof FormData;
            return await axiousResuest({
                url: `/api/my-restaurant/${id}`,
                method: "post",
                data: body,
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(isFormData 
                        ? { "Content-Type": "multipart/form-data" }
                        : { "Content-Type": "application/json" }
                    ),
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myRestaurant"] });
        },
    });
};
