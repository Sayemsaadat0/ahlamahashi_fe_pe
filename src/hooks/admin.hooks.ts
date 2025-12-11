"use client";

import axiousResuest from "@/lib/axiousRequest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/AuthStore";

/**
 * Dashboard Stats Data Structure
 */
export interface DashboardStats {
  total_users: number;
  total_admins: number;
  total_regular_users: number;
}

/**
 * Dashboard Response Data
 */
export interface DashboardData {
  stats: DashboardStats;
}

/**
 * Dashboard API Response
 */
export interface DashboardResponse {
  success: boolean;
  status: number;
  message: string;
  data: DashboardData;
}

/**
 * Get dashboard stats
 * GET /api/admin/dashboard
 */
export const useGetDashboardStats = () => {
  const { token } = useAuthStore();

  return useQuery<DashboardResponse>({
    queryKey: ["dashboardStats"],
    queryFn: () => {
      if (!token) {
        throw new Error("Authentication token is required");
      }

      return axiousResuest({
        url: `/api/admin/dashboard`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!token, // Only run query if token exists
  });
};

/**
 * User Data Structure
 */
export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  address_id: number | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Users Response Data
 */
export interface UsersData {
  users: UserData[];
  total: number;
}

/**
 * Users API Response
 */
export interface UsersResponse {
  success: boolean;
  status: number;
  message: string;
  data: UsersData;
}

/**
 * Get all users
 * GET /api/admin/users
 */
export const useGetUsers = () => {
  const { token } = useAuthStore();

  return useQuery<UsersResponse>({
    queryKey: ["adminUsers"],
    queryFn: () => {
      if (!token) {
        throw new Error("Authentication token is required");
      }

      return axiousResuest({
        url: `/api/admin/users`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!token, // Only run query if token exists
  });
};

/**
 * Delete user
 * DELETE /api/admin/users/{id}
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) {
        throw new Error("Authentication token is required");
      }

      return axiousResuest({
        url: `/api/admin/users/${id}`,
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
};

