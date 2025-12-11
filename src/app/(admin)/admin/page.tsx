'use client';
import React from 'react';
import Link from 'next/link';
import { 
    Users, 
    ShoppingBag, 
    Utensils, 
    User,
    Monitor,
    MousePointerClick,
    Repeat,
    ExternalLink,
    TrendingUp,
    Shield,
    UserCheck
} from 'lucide-react';
import { useGetVisitorAnalytics } from '@/hooks/visitor.hooks';
import { useGetDashboardStats } from '@/hooks/admin.hooks';

const Admin = () => {
    // Fetch dashboard stats
    const { data: dashboardResponse, isLoading: isLoadingDashboard, error: dashboardError } = useGetDashboardStats();
    const dashboardStats = dashboardResponse?.data?.stats;

    // Fetch visitor analytics
    const { data: analyticsResponse, isLoading: isLoadingAnalytics, error: analyticsError } = useGetVisitorAnalytics();
    const analytics = analyticsResponse?.data;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your food app today.</p>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            {isLoadingDashboard ? (
                                <p className="text-2xl font-bold text-gray-900">...</p>
                            ) : dashboardError ? (
                                <p className="text-sm text-red-500">Error loading</p>
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{dashboardStats?.total_users.toLocaleString() || 0}</p>
                            )}
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Admins</p>
                            {isLoadingDashboard ? (
                                <p className="text-2xl font-bold text-gray-900">...</p>
                            ) : dashboardError ? (
                                <p className="text-sm text-red-500">Error loading</p>
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{dashboardStats?.total_admins.toLocaleString() || 0}</p>
                            )}
                        </div>
                        <Shield className="w-8 h-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Regular Users</p>
                            {isLoadingDashboard ? (
                                <p className="text-2xl font-bold text-gray-900">...</p>
                            ) : dashboardError ? (
                                <p className="text-sm text-red-500">Error loading</p>
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{dashboardStats?.total_regular_users.toLocaleString() || 0}</p>
                            )}
                        </div>
                        <UserCheck className="w-8 h-8 text-green-500" />
                    </div>
                </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Users className="w-6 h-6 text-blue-600" />
                        <div>
                            <p className="font-medium text-gray-900">Manage Users</p>
                            <p className="text-sm text-gray-500">View and manage users</p>
                        </div>
                    </Link>
                    
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <ShoppingBag className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-medium text-gray-900">View Orders</p>
                            <p className="text-sm text-gray-500">Track and manage orders</p>
                        </div>
                    </Link>
                    
                    <Link
                        href="/admin/foods"
                        className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <Utensils className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-medium text-gray-900">Food Management</p>
                            <p className="text-sm text-gray-500">Manage menu items</p>
                        </div>
                    </Link>
                    
                    <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <User className="w-6 h-6 text-purple-600" />
                        <div>
                            <p className="font-medium text-gray-900">Profile Settings</p>
                            <p className="text-sm text-gray-500">Update your profile</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Visitor Analytics Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Visitor Analytics</h3>
                        <p className="text-sm text-gray-500">Track visitor behavior and engagement</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>

                {isLoadingAnalytics ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Loading analytics...</p>
                    </div>
                ) : analyticsError ? (
                    <div className="text-center py-8">
                        <p className="text-red-500">Failed to load analytics data</p>
                    </div>
                ) : analytics ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Visitors */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Visitors</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.total_visitors.toLocaleString()}</p>
                        </div>

                        {/* Most Visited Section */}
                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <MousePointerClick className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Most Visited Section</p>
                            <p className="text-lg font-bold text-gray-900">{analytics.most_visited_section.value || 'N/A'}</p>
                            <p className="text-xs text-gray-500 mt-1">{analytics.most_visited_section.count} visits</p>
                        </div>

                        {/* Most Visited Device Type */}
                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <Monitor className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Top Device Type</p>
                            <p className="text-lg font-bold text-gray-900 capitalize">{analytics.most_visited_device_type.value || 'N/A'}</p>
                            <p className="text-xs text-gray-500 mt-1">{analytics.most_visited_device_type.count} users</p>
                        </div>

                        {/* Most Common Referral */}
                        <div className="bg-orange-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <ExternalLink className="w-5 h-5 text-orange-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Top Referral Source</p>
                            <p className="text-lg font-bold text-gray-900">{analytics.most_common_ref.value || 'Direct'}</p>
                            <p className="text-xs text-gray-500 mt-1">{analytics.most_common_ref.count} visitors</p>
                        </div>
                    </div>
                ) : null}

                {/* Repeated Visitors */}
                {analytics && analytics.repeated_visitors && analytics.repeated_visitors.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                            <Repeat className="w-5 h-5 text-gray-600" />
                            <h4 className="text-md font-semibold text-gray-900">Repeated Visitors</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {analytics.repeated_visitors.slice(0, 6).map((visitor, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Visitor ID</p>
                                            <p className="text-xs text-gray-500 font-mono">{visitor.visitor_id.substring(0, 12)}...</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-600">{visitor.session}</p>
                                            <p className="text-xs text-gray-500">sessions</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {analytics.repeated_visitors.length > 6 && (
                            <p className="text-xs text-gray-500 mt-3 text-center">
                                +{analytics.repeated_visitors.length - 6} more repeated visitors
                            </p>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Admin;
