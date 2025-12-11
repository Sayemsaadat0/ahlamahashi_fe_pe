"use client";

import axiousResuest from "@/lib/axiousRequest";
import { useAuthStore } from "@/store/AuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Page Visit Data Structure
 */
export interface PageVisit {
  page_name: string;
  section_name?: string;
  in_time: string; // Format: "YYYY-MM-DD HH:mm:ss"
  out_time: string; // Format: "YYYY-MM-DD HH:mm:ss"
}

/**
 * Create Visitor Session Payload
 */
export interface CreateVisitorSessionData {
  visitor_id: string;
  ref?: string;
  device_type?: string;
  browser?: string;
  page_visits?: PageVisit[];
}

/**
 * Update Visitor Payload (for PATCH requests)
 */
export interface UpdateVisitorData {
  ref?: string;
  device_type?: string;
  browser?: string;
  page_visits?: PageVisit[];
}

/**
 * Visitor Response Data
 */
export interface VisitorData {
  id: number;
  visitor_id: string;
  session: number;
  ref: string | null;
  device_type: string | null;
  browser: string | null;
  page_visits?: PageVisit[];
  total_duration?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Visitor API Response
 */
export interface VisitorResponse {
  success: boolean;
  message: string;
  data: VisitorData;
}

/**
 * Analytics Response
 */
export interface AnalyticsData {
  total_visitors: number;
  most_visited_section: {
    value: string;
    count: number;
  };
  most_visited_device_type: {
    value: string;
    count: number;
  };
  repeated_visitors: Array<{
    visitor_id: string;
    session: number;
  }>;
  most_common_ref: {
    value: string;
    count: number;
  };
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

/**
 * Create or update visitor session
 * POST /api/visitors
 */
export const useCreateVisitorSession = () => {
  return useMutation<VisitorResponse, Error, CreateVisitorSessionData>({
    mutationFn: async (data: CreateVisitorSessionData) => {
      return await axiousResuest({
        url: `/api/visitors`,
        method: "post",
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });
};

/**
 * Update visitor (append page visits or update metadata)
 * PATCH /api/visitors/{visitor_id}
 */
export const useUpdateVisitor = () => {
  return useMutation<
    VisitorResponse,
    Error,
    { visitorId: string; data: UpdateVisitorData }
  >({
    mutationFn: async ({
      visitorId,
      data,
    }: {
      visitorId: string;
      data: UpdateVisitorData;
    }) => {
      return await axiousResuest({
        url: `/api/visitors/${visitorId}`,
        method: "patch",
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });
};

/**
 * Get visitor by ID
 * GET /api/visitors/{visitor_id}
 */
export const useGetVisitorById = (visitorId: string | null) => {
  return useQuery<VisitorResponse>({
    queryKey: ["visitor", visitorId],
    queryFn: () => {
      return axiousResuest({
        url: `/api/visitors/${visitorId}`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    enabled: !!visitorId,
  });
};

/**
 * Get visitor analytics
 * GET /api/visitors/analytics
 */
export const useGetVisitorAnalytics = () => {
  return useQuery<AnalyticsResponse>({
    queryKey: ["visitorAnalytics"],
    queryFn: () => {
      return axiousResuest({
        url: `/api/visitors/analytics`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });
};

/**
 * Get all visitors (Admin only - requires auth)
 * GET /api/visitors?per_page=25&page=1&gte_date=2025-11-01&lte_date=2025-11-30
 */
export interface GetAllVisitorsParams {
  per_page?: number;
  page?: number;
  gte_date?: string; // YYYY-MM-DD
  lte_date?: string; // YYYY-MM-DD
}

export interface GetAllVisitorsResponse {
  success: boolean;
  data: VisitorData[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export const useGetAllVisitors = (params?: GetAllVisitorsParams) => {
  const { token } = useAuthStore();
  return useQuery<GetAllVisitorsResponse>({
    queryKey: ["allVisitors", params],
    queryFn: () => {
      const queryParams = new URLSearchParams();
      if (params?.per_page)
        queryParams.append("per_page", params.per_page.toString());
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.gte_date) queryParams.append("gte_date", params.gte_date);
      if (params?.lte_date) queryParams.append("lte_date", params.lte_date);

      const queryString = queryParams.toString();
      const url = `/api/visitors${queryString ? `?${queryString}` : ""}`;

      return axiousResuest({
        url,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
  });
};
