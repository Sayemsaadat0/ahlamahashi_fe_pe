"use client";
import React from "react";
import Link from "next/link";
import {
    User,
    Phone,
    Mail,
    MapPin
} from "lucide-react";
import { OrderStatusValue, useGetOrders } from "@/hooks/orders.hooks";
import OrderItemsPreview from "@/components/admin/OrderItemsPreview";
import OrderDetailsPreview from "@/components/admin/OrderDetailsPreview";
import OrderStatusForm from "@/components/admin/OrderStatusForm";

const PER_PAGE_OPTIONS = [10, 25, 50];

type StatusFilter = "all" | "delivered";

const OrdersPage: React.FC = () => {
    const [filters, setFilters] = React.useState<{
        status: StatusFilter;
        page: number;
        per_page: number;
    }>({
        status: "all",
        page: 1,
        per_page: 25,
    });

    const queryFilters = React.useMemo(() => {
        const base = {
            page: filters.page,
            per_page: filters.per_page,
        };

        if (filters.status === "all") {
            return base;
        }

        return {
            ...base,
            status: filters.status as OrderStatusValue,
        };
    }, [filters]);

    // Fetch orders from API
    const { data: ordersResponse, isLoading, error } = useGetOrders(queryFilters);
    const orders = ordersResponse?.data?.orders || [];
    const pagination = ordersResponse?.data?.pagination;

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextStatus = event.target.value as StatusFilter;
        setFilters((prev) => ({
            ...prev,
            status: nextStatus,
            page: 1,
        }));
    };

    const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextPerPage = Number(event.target.value);
        setFilters((prev) => ({
            ...prev,
            per_page: nextPerPage,
            page: 1,
        }));
    };

    const handlePageChange = (direction: 'prev' | 'next') => {
        setFilters((prev) => {
            if (direction === 'prev') {
                if (prev.page === 1) return prev;
                return { ...prev, page: prev.page - 1 };
            }

            if (direction === 'next') {
                const lastPage = pagination?.last_page || prev.page;
                if (prev.page >= lastPage) return prev;
                return { ...prev, page: prev.page + 1 };
            }

            return prev;
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'unpaid':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format delivery address
    const formatAddress = (address: any) => {
        if (!address) return 'N/A';
        const parts = [
            address.street_address,
            address.city?.name,
            address.state,
            address.zip_code
        ].filter(Boolean);
        return parts.join(', ') || 'N/A';
    };

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                    <p className="text-gray-600">Track and manage customer orders</p>
                </div>
                <div className="flex flex-col justify-end items-end gap-4 sm:flex-row">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <select
                            value={filters.status}
                            onChange={handleStatusChange}
                            className="rounded-lg border bg-white border-gray-300 px-3 py-2 text-sm focus:border-a-green-600 focus:outline-none focus:ring-2 focus:ring-a-green-600"
                        >
                            <option value="all">All</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Per page</label>
                        <select
                            value={filters.per_page}
                            onChange={handlePerPageChange}
                            className="rounded-lg border bg-white border-gray-300 px-3 py-2 text-sm focus:border-a-green-600 focus:outline-none focus:ring-2 focus:ring-a-green-600"
                        >
                            {PER_PAGE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option} per page
                                </option>
                            ))}
                        </select>
                    </div>
                    <Link
                        href="/admin/orders/carts"
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-a-green-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-a-green-600/90"
                    >
                        View carts
                    </Link>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Guest ID / User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone / Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Delivery Address
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payable Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-red-500">
                                        Failed to load orders. Please try again.
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div className="ml-3">
                                                    {order.user_id ? (
                                                        <div className="text-sm font-medium text-gray-900">User ID: {order.user_id}</div>
                                                    ) : (
                                                        <div className="text-sm font-medium text-gray-900">Guest ID</div>
                                                    )}
                                                    <div className="text-xs text-gray-500 font-mono">
                                                        {order.guest_id || `User-${order.user_id}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 flex items-center gap-1">
                                                <Phone size={14} className="text-gray-400" />
                                                {order.phone}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <Mail size={14} className="text-gray-400" />
                                                {order.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 flex items-start gap-1">
                                                <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                <span>{formatAddress(order.address)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <OrderItemsPreview
                                                notes={order.notes || 'N/A'}
                                                items={order.order_items || []}
                                                itemsCount={order.order_items_count || order.order_items?.length || 0}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {typeof order.summary?.payable_price === 'number'
                                                ? `${order.summary.payable_price.toFixed(2)}`
                                                : 'N/A'} AED
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap uppercase">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap uppercase">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <OrderDetailsPreview order={order} />
                                                <OrderStatusForm order={order} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-700">
                    {isLoading ? (
                        <span>Loading...</span>
                    ) : (
                        <>
                            Showing <span className="font-medium">{pagination?.from || 0}</span> to{' '}
                            <span className="font-medium">{pagination?.to || orders.length}</span> of{' '}
                            <span className="font-medium">{pagination?.total || orders.length}</span> results
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={filters.page === 1 || isLoading}
                        onClick={() => handlePageChange('prev')}
                    >
                        Previous
                    </button>
                    <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-md">
                        {pagination?.current_page || filters.page}
                    </button>
                    <button 
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                            isLoading ||
                            (pagination?.last_page ? filters.page >= pagination.last_page : orders.length < filters.per_page)
                        }
                        onClick={() => handlePageChange('next')}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
