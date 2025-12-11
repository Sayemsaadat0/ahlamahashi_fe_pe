"use client";

import axiousResuest from "@/lib/axiousRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/AuthStore";

/**
 * Contact form payload type
 */
export interface ContactPayload {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

/**
 * Contact response type
 */
export interface ContactResponse {
    success: boolean;
    status: number;
    message: string;
    data?: any;
}

/**
 * Contact type according to API response
 */
export interface Contact {
    id: number;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: string;
    admin_notes?: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Contacts data type
 */
export interface ContactsData {
    contacts: Contact[];
    total: number;
}

/**
 * Contacts list response type
 */
export interface ContactsListResponse {
    success: boolean;
    status: number;
    message: string;
    data: ContactsData;
}

/**
 * Hook to create contact form submission
 */
export const useCreateContact = () => {
    return useMutation<ContactResponse, any, ContactPayload>({
        mutationFn: async (body: ContactPayload) =>
            await axiousResuest({
                url: `/api/contact/`,
                method: "post",
                data: body,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }),
    });
};

/**
 * Hook to get contacts list
 */
export const useGetContactsList = () => {
    const { token } = useAuthStore();
    return useQuery<ContactsListResponse>({
        queryKey: ["contactsList"],
        queryFn: () => {
            return axiousResuest({
                url: `/api/contact/`,
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

/**
 * Hook to delete contact
 */
export const useDeleteContact = (id: number) => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: async () =>
            await axiousResuest({
                url: `/api/contact/${id}`,
                method: "delete",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contactsList"] });
        },
    });
};

