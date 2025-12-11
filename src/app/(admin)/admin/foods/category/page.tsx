'use client'
import { useDeleteCategory, useGetCategoriesList } from '@/hooks/category.hooks'
import React from 'react'
import { Loader2 } from 'lucide-react'
import CategoryForm from './_components/CategoryForm'
import DeleteAction from '@/components/core/DeleteAction'

const TableAction = ({ id }: { id: number }) => {
    const { mutateAsync, isPending } = useDeleteCategory(id)
    return (
        <div>
            <DeleteAction isOnlyIcon handleDeleteSubmit={() => mutateAsync()} isLoading={isPending} />
        </div>
    )
}

// Default Page
const CategoryPage = () => {
    const { data, isLoading } = useGetCategoriesList()

    const categories = data?.data.categories || []

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'published':
                return 'bg-green-100 text-green-800'
            case 'draft':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-blue-100 text-blue-800'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Food Categories</h1>
                    <p className="text-gray-600">Manage your food categories and organize your menu</p>
                </div>
                <CategoryForm />
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-a-green-600" />
                        <span className="ml-2 text-gray-600">Loading categories...</span>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-a-green-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Category Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Created Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider flex justify-end">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                #{category.id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {category.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
                                                {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(category.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap flex justify-end">
                                            {category.id && <TableAction id={category.id} />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary */}
            {!isLoading && categories.length > 0 && (
                <div className="text-sm text-gray-600">
                    Showing {categories.length} of {categories.length} categories
                </div>
            )}
        </div>
    )
}

export default CategoryPage