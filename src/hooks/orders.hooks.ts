"use client";
import axiousResuest from "@/lib/axiousRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/AuthStore";

export interface CreateOrderPayloadType {
  guest_id?: string;
  user_id?: string;
  cart_id: number;
  city_id: number;
  state: string;
  zip_code: string;
  street_address: string;
  phone: string;
  email: string;
  notes: string;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<CreateOrderPayloadType>) =>
      await axiousResuest({
        url: `/api/orders`,
        method: "post",
        data: body,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
  });
};

export const useGetOrdersById = (id: number) => {
  return useQuery<any>({
    queryKey: ["orderById", id],
    queryFn: () => {
      const url = `/api/orders/${id}`;
      return axiousResuest({
        url,
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    enabled: !!id && id > 0,
  });
};

/**
 * City Data Structure
 */
export interface OrderCity {
  id: number;
  name: string;
  status: string;
}

/**
 * Order Address Data Structure
 */
export interface OrderAddress {
  state: string;
  zip_code: string;
  street_address: string;
  city: OrderCity;
}

/**
 * Order Price Data Structure
 */
export interface OrderPrice {
  id: number;
  price: number;
  size: string;
}

/**
 * Order Item Data Structure
 */
export interface OrderItem {
  id: number;
  title: string;
  description: string;
  quantity: number;
  price: OrderPrice;
}

/**
 * Order Charges Data Structure
 */
export interface OrderCharges {
  tax: number;
  tax_price: number;
  delivery_charges: number;
  discount: number;
}

/**
 * Order Summary Data Structure
 */
export interface OrderSummary {
  items_price: number;
  charges: OrderCharges;
  payable_price: number;
}

/**
 * Order Data Structure
 */
export interface OrderData {
  id: number;
  user_id: number | null;
  guest_id: string | null;
  cart_id: number | null;
  total_amount: number;
  status: string;
  payment_status: string;
  phone: string;
  email: string;
  notes: string;
  created_at: string;
  updated_at: string;
  user: any | null;
  address: OrderAddress;
  order_items: OrderItem[];
  summary: OrderSummary;
  order_items_count: number;
}

export const ORDER_STATUS_FLOW = [
  "pending",
  "cooking",
  "on_the_way",
  "delivered",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUS_FLOW)[number];

export type OrderPaymentStatusValue = "paid" | "unpaid" | "pending";

/**
 * Pagination Data Structure
 */
export interface PaginationData {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

/**
 * Orders Response Data
 */
export interface OrdersData {
  orders: OrderData[];
  pagination: PaginationData;
}

/**
 * Orders API Response
 */
export interface OrdersResponse {
  success: boolean;
  status: number;
  message: string;
  data: OrdersData;
}

/**
 * Get all orders
 * GET /api/orders
 */
export interface OrdersQueryParams {
  status?: OrderStatusValue;
  page?: number;
  per_page?: number;
}

export const useGetOrders = (filters: OrdersQueryParams = {}) => {
  const { token } = useAuthStore();

  const params: Record<string, string | number> = {
    page: filters.page ?? 1,
    per_page: filters.per_page ?? 10,
  };

  if (filters.status) {
    params.status = filters.status;
  }

  return useQuery<OrdersResponse>({
    queryKey: ["orders", params],
    queryFn: () => {
      if (!token) {
        throw new Error("Authentication token is required");
      }

      return axiousResuest({
        url: `/api/orders`,
        method: "get",
        params,
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

export interface UpdateOrderStatusPayload {
  status: OrderStatusValue;
  payment_status?: OrderPaymentStatusValue;
}

export const useUpdateOrderStatus = (
  orderId?: number | string
) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (body: UpdateOrderStatusPayload) => {
      if (!orderId) {
        throw new Error("Order ID is required to update status");
      }

      if (!token) {
        throw new Error("Authentication token is required");
      }

      return await axiousResuest({
        url: `/api/orders/${orderId}`,
        method: "put",
        data: body,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderById", orderId] });
    },
  });
};
