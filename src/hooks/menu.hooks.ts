"use client";

import axiousResuest from "@/lib/axiousRequest";
import { useAuthStore } from "@/store/AuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Menu Item type according to API response
 */

export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
}

export interface MenuPrice {
  id: number;
  price: number;
  size?: string;
}

export interface MenuItem {
  id?: number;
  name: string;
  details: string;
  thumbnail: string;
  status: "published" | "unpublished";
  isSpecial?: boolean;
  category: MenuCategory;
  prices: MenuPrice[];
  created_at?: string;
  updated_at?: string;
}

export interface MenuData {
  items: MenuItem[];
  total: number;
}

export interface MenuResponse {
  success: boolean;
  status: number;
  message: string;
  data: MenuData;
}

export const useGetMenuList = (
  category_id?: number,
  has_price?: number,
  isSpecial?: boolean
) => {
  return useQuery<MenuResponse>({
    queryKey: ["menuList", category_id, has_price, isSpecial],
    queryFn: () => {
      const params = new URLSearchParams();

      if (typeof category_id !== "undefined") {
        params.append("category_id", String(category_id));
      }

      if (typeof has_price !== "undefined") {
        params.append("has_price", String(has_price));
      }
      if (typeof isSpecial !== "undefined") {
        params.append("isSpecial", String(isSpecial));
      }


      return axiousResuest({
        url: `/api/items?${params.toString()}`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  return useMutation({
    mutationFn: async (body: FormData) =>
      await axiousResuest({
        url: `/api/items`,
        method: "post",
        data: body,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuList"] });
    },
  });
};

export const useUpdateMenu = (id: number) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  return useMutation({
    mutationFn: async (body: FormData) =>
      await axiousResuest({
        url: `/api/items/${id}`,
        method: "post",
        data: body,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuList"] });
    },
  });
};

export const useDeleteMenu = (id: number) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  return useMutation({
    mutationFn: async () =>
      await axiousResuest({
        url: `/api/items/${id}`,
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

/**
 * Categorised Menu types according to API response
 */
export interface CategorisedMenuPrice {
  id: number;
  price: number;
  size?: string;
}

export interface CategorisedMenuItem {
  id: number;
  name: string;
  prices: CategorisedMenuPrice[];
  thumbnail: string;
  description: string;
  isAvailable: boolean;
  isSpecial: boolean;
}

export interface CategorisedMenuCategory {
  id: number;
  categoryName: string;
  description: string | null;
  items: CategorisedMenuItem[];
}

export interface CategorisedMenuData {
  total: number;
  categories: CategorisedMenuCategory[];
}

export interface CategorisedMenuResponse {
  success: boolean;
  status: number;
  message: string;
  data: CategorisedMenuData;
}

export const useGetCategorisedMenu = (
  has_price = 1,
  search?: string
) => {
  return useQuery<CategorisedMenuResponse>({
    queryKey: ["categorisedMenu", has_price, search],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("has_price", has_price.toString());
      if (search && search.trim()) {
        params.append("search", search.trim());
      }
      const url = `/api/items/by-category?${params.toString()}`;
      return axiousResuest({
        url,
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });
};
