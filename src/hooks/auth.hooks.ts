"use client";

import axiousResuest from "@/lib/axiousRequest";
import { useAuthStore } from "@/store/AuthStore";
import { useMutation } from "@tanstack/react-query";

export type AuthBodyType = {
    name?: string;
    email: string;
    password: string;
};

export const useRegister = () => {
    // const queryClient = useQueryClient();
    // const { data: session }: any = useSession();
    return useMutation({
        mutationFn: async (body: AuthBodyType) =>
            await axiousResuest({
                url: `/api/register`,
                method: "post",
                data: body,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: async (body: AuthBodyType) =>
            await axiousResuest({
                url: `api/login`,
                method: "post",
                data: body,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
    });
};





export const useLogout = () => {
    const { token } = useAuthStore()
    return useMutation({
        mutationFn: async () =>
            await axiousResuest({
                url: `api/logout`,
                method: "post",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }),
    });
};