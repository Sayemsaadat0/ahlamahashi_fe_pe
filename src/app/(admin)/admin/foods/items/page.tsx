"use client";

import React from "react";
import { useGetMenuList, useDeleteMenu, MenuItem } from "@/hooks/menu.hooks";
import { Loader2, Image as ImageIcon } from "lucide-react";
import ItemForm from "./_components/ItemForm";
import PriceForm from "./_components/PriceForm";
import DeleteAction from "@/components/core/DeleteAction";
import { useDeleteItemPrice, ItemPrice } from "@/hooks/itemPrice.hooks";
import Image from "next/image";

const TableAction = ({ item }: { item: MenuItem }) => {
  const { mutateAsync, isPending } = useDeleteMenu(item.id ?? 0);
  return (
    <div className="flex items-center gap-2">
      {item.id && <ItemForm instance={item} iconOnly />}
      <DeleteAction
        isOnlyIcon
        handleDeleteSubmit={() => mutateAsync()}
        isLoading={isPending}
      />
    </div>
  );
};

const PriceCardActions = ({
  item_id,
  price,
}: {
  item_id: number;
  price: ItemPrice;
}) => {
  const { mutateAsync, isPending } = useDeleteItemPrice(item_id, price.id);
  return (
    <div className="flex items-center gap-1">
      <PriceForm item_id={item_id} instance={price} iconOnly />
      <DeleteAction
        isOnlyIcon
        handleDeleteSubmit={() => mutateAsync()}
        isLoading={isPending}
      />
    </div>
  );
};

const ItemsPage = () => {
  const { data, isLoading, error } = useGetMenuList();
  const items = data?.data?.items || [];

  // const getStatusColor = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "published":
  //       return "bg-green-100 text-green-800";
  //     case "unpublished":
  //       return "bg-gray-100 text-gray-800";
  //     default:
  //       return "bg-blue-100 text-blue-800";
  //   }
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="text-gray-600">Manage your menu items and prices</p>
        </div>
        <ItemForm />
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-a-green-600" />
            <span className="ml-2 text-gray-600">Loading items...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Failed to load items
            </h3>
            <p className="text-sm text-gray-500">Please try again later</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-sm text-gray-500">
              Create your first menu item to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-a-green-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Thumbnail & Name
                  </th>
                 
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Special
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Prices
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider flex justify-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50  transition-colors"
                  >
                    <td className="px-6 py-4 space-y-2 max-w-md whitespace-nowrap">
                      {item.thumbnail ? (
                        <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                        // <img
                        //   src={item.thumbnail}
                        //   alt={item.name}
                        //   className="w-16 h-16 object-cover rounded-lg"
                        //   onError={(e) => {
                        //     const target = e.target as HTMLImageElement;
                        //     target.style.display = "none";
                        //   }}
                        // />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xl ">
                        {item.details}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.category?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.isSpecial ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Special
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                          Regular
                        </span>
                      )}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {item.prices && item.prices.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {item.prices.map((price) => (
                              <div
                                key={price.id}
                                className="relative inline-flex flex-col items-start bg-a-green-600/10 border border-a-green-600/20 rounded-lg px-3 py-2 min-w-[80px] group hover:border-a-green-600/40 transition-colors"
                              >
                                <span className="text-xs font-medium text-a-green-700 uppercase tracking-wide">
                                  {price.size || "Standard"}
                                </span>
                                <span className="text-sm font-semibold text-gray-900 mt-0.5">
                                  {price.price} AED
                                </span>
                                {item.id && (
                                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg p-1 shadow-lg border border-gray-200 z-10 flex items-center gap-1">
                                    <PriceCardActions item_id={item.id} price={price} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-gray-400 text-xs">
                            <span>—</span>
                            <span>No prices</span>
                          </div>
                        )}
                        {item.id && (
                          <div className="mt-1">
                            <PriceForm item_id={item.id} iconOnly />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex justify-end">
                      {item.id && <TableAction item={item} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {!isLoading && items.length > 0 && (
        <div className="text-sm text-gray-600">
          Showing {items.length} of {data?.data?.total || items.length} items
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
