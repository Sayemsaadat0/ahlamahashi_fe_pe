"use client";

import axiousResuest from "@/lib/axiousRequest";
import { useAuthStore } from "@/store/AuthStore";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

/** 
 * Category type according to API response
 */

export interface CategoryType {
    id?: number | null;
    name: string;
    status: string;
    created_at?: string; // ISO date string
    updated_at?: string; // ISO date string
}

export interface CategoriesData {
    categories: CategoryType[];
    total: number;
}

export interface CategoriesResponse {
    success: boolean;
    status: number;
    message: string;
    data: CategoriesData;
}

export const useGetCategoriesList = () => {
    return useQuery<CategoriesResponse>({
        queryKey: ["categoryList"],
        queryFn: () =>
            axiousResuest({
                url: `/api/categories`,
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
    });
};


export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: async (body: Partial<CategoryType>) =>
            await axiousResuest({
                url: `/api/categories`,
                method: "post",
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categoryList"] });
        },
    });
};

export const useUpdateCategory = (id: string) => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: async (body: Partial<CategoryType>) =>
            await axiousResuest({
                url: `/api/categories/${id}`,
                method: "patch",
                data: body,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categoryList"] });
        },
    });
};

export const useDeleteCategory = (id: number) => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: async () =>
            await axiousResuest({
                url: `/api/categories/${id}`,
                method: "delete",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categoryList"] });
        },
    });
};
