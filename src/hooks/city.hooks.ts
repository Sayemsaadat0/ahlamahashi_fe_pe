"use client";

import axiousResuest from "@/lib/axiousRequest";
import { useAuthStore } from "@/store/AuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * City type according to API response
 */

export interface City {
    id: number;
    name: string;
    status: "published" | "unpublished";
    created_at?: string;
    updated_at?: string;
}

export interface CityData {
    cities: City[];
    total: number;
}

export interface CityResponse {
    success: boolean;
    status: number;
    message: string;
    data: CityData;
}

export const useGetcityList = () => {
    return useQuery<CityResponse>({
        queryKey: ["cityList"],
        queryFn: () => {
            return axiousResuest({
                url: `/api/cities`,
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        },
    });
};

export const useCreateCity = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: async (body: Partial<City>) =>
            await axiousResuest({
                url: `/api/cities`,
                method: "post",
                data: body,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cityList"] });
        },
    });
};

export const useUpdateCity = (id: number) => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: async (body: Partial<City>) =>
            await axiousResuest({
                url: `/api/cities/${id}`,
                method: "patch",
                data: body,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cityList"] });
        },
    });
};

export const useDeleteCity = (id: number) => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: async () =>
            await axiousResuest({
                url: `/api/cities/${id}`,
                method: "delete",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cityList"] });
        },
    });
};
