"use client";

import React, { useState } from "react";
import {
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  ClipboardList,
  Calendar,
  Package,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderData } from "@/hooks/orders.hooks";

interface OrderDetailsPreviewProps {
  order: OrderData;
}

const OrderDetailsPreview: React.FC<OrderDetailsPreviewProps> = ({ order }) => {
  const [open, setOpen] = useState(false);

  const formatAddress = () => {
    if (!order.address) return "N/A";
    const parts = [
      order.address.street_address,
      order.address.city?.name,
      order.address.state,
      order.address.zip_code,
    ].filter(Boolean);
    return parts.join(", ") || "N/A";
  };

  const formatCurrency = (value?: number | null) =>
    typeof value === "number" ? `${value.toFixed(2)} AED` : "N/A";

  const formatDateTime = (value?: string | null) =>
    value ? new Date(value).toLocaleString() : "N/A";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-blue-600 hover:text-blue-900 p-1 transition-colors"
          title="View Order Details"
        >
          <Eye size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-full md:min-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Order Details
          </DialogTitle>
          <DialogDescription>
            Complete information for order #{order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4 ">
          {/* Order Meta */}
          <div className="grid grid-cols-1 bg-white md:grid-cols-2 gap-4 border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">Order ID</span>
              <span className="text-sm font-semibold text-gray-900">
                #{order.id}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">Guest ID</span>
              <span className="text-sm font-semibold text-gray-900 break-all">
                {order.guest_id || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">Status</span>
              <span className="text-sm font-semibold uppercase text-gray-900">
                {order.status}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">
                Payment Status
              </span>
              <span className="text-sm font-semibold uppercase text-gray-900">
                {order.payment_status}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">
                Total Amount
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">
                Payable Price
              </span>
              <span className="text-2xl text-green-500 font-semibold text-gray-900">
                {formatCurrency(order.summary?.payable_price)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">
                Created At
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {formatDateTime(order.created_at)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">
                Last Updated
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {formatDateTime(order.updated_at)}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 space-y-2 bg-white">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4" />
                Contact Details
              </h4>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {order.phone}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2 break-all">
                <Mail className="w-4 h-4 text-gray-400" />
                {order.email}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </h4>
              <p className="text-sm text-gray-600">{formatAddress()}</p>
            </div>
          </div>

          {/* Summary */}
          {order.summary && (
            <div className="border bg-white border-gray-200 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Order Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Price</span>
                  <span className="font-semibold">
                    {formatCurrency(order.summary.items_price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">
                    {formatCurrency(order.summary.charges?.tax_price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="font-semibold">
                    {formatCurrency(order.summary.charges?.delivery_charges)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold">
                    {formatCurrency(order.summary.charges?.discount)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-sm">
                <span className="text-gray-600">Payable Price</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(order.summary.payable_price)}
                </span>
              </div>
            </div>
          )}

          {/* Order Items */}
          {order.order_items && order.order_items.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4 space-y-3  bg-white">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Order Items ({order.order_items.length})
              </h4>
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-100 rounded-lg p-3 bg-a-green-600/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 text-right">
                        <p>
                          Qty: <span className="font-semibold">{item.quantity}</span>
                        </p>
                        {item.price && (
                          <p>
                            Size:{" "}
                            <span className="font-semibold">{item.price.size}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-1">
                Notes
              </p>
              <p className="text-sm text-yellow-800 whitespace-pre-wrap break-words">
                {order.notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="border border-gray-200 bg-white rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Created: {formatDateTime(order.created_at)}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Updated: {formatDateTime(order.updated_at)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsPreview;

