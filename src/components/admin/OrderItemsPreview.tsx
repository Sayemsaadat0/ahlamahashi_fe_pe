"use client";

import React, { useState } from "react";
import { Eye, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderItem } from "@/hooks/orders.hooks";

interface OrderItemsPreviewProps {
  notes: string;
  items: OrderItem[];
  itemsCount: number;
}

const OrderItemsPreview: React.FC<OrderItemsPreviewProps> = ({
  notes,
  items,
  itemsCount,
}) => {
  const [open, setOpen] = useState(false);

  if (!items || items.length === 0) {
    return <span className="text-sm text-gray-500">{itemsCount} items</span>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900">{itemsCount} items</span>
        <DialogTrigger asChild>
          <button
            className="text-blue-600 hover:text-blue-900 p-1 transition-colors"
            title="View Order Items"
          >
            <Eye size={16} />
          </button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items ({items.length})
          </DialogTitle>
          <DialogDescription>View all items in this order</DialogDescription>
        </DialogHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-lg font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-lg font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-lg font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                  Size
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-lg font-semibold text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-lg font-semibold text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-lg font-semibold text-gray-900">
                    {item.price?.size || <span className="text-gray-400">N/A</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className=" p-5 bg-a-green-600/20 rounded-lg ">
          <p className="text-sm font-medium text-gray-900 mb-2 underline">Special Notes:</p>
          <span className=" text-gray-900 break-all">{notes}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderItemsPreview;
