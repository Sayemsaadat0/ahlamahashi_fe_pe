"use client";

import React, { useState } from "react";
import { 
    Loader2, 
    Calendar, 
    Monitor, 
    Globe, 
    Eye, 
    Clock,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { 
    useGetAllVisitors, 
    VisitorData,
} from "@/hooks/visitor.hooks";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface VisitorRowProps {
    visitor: VisitorData;
    formatDate: (dateString: string) => string;
    formatDuration: (seconds?: number) => string;
    onRowClick: (visitor: VisitorData) => void;
}

const VisitorRow: React.FC<VisitorRowProps> = ({ visitor, formatDate, formatDuration, onRowClick }) => {
    return (
        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onRowClick(visitor)}>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <Eye size={16} className="text-gray-400" />
                    <div>
                        <div className="text-sm font-medium text-gray-900 font-mono">
                            {visitor.visitor_id.substring(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-500">
                            Session #{visitor.session}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {visitor.device_type ? (
                        <>
                            <Monitor size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{visitor.device_type}</span>
                        </>
                    ) : (
                        <span className="text-sm text-gray-400">-</span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {visitor.browser ? (
                        <>
                            <Globe size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{visitor.browser}</span>
                        </>
                    ) : (
                        <span className="text-sm text-gray-400">-</span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                {visitor.ref ? (
                    <div className="text-sm text-gray-700 max-w-xs truncate" title={visitor.ref}>
                        {visitor.ref}
                    </div>
                ) : (
                    <span className="text-sm text-gray-400">Direct</span>
                )}
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-700">
                    {visitor.page_visits?.length || 0} pages
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock size={14} className="text-gray-400" />
                    {formatDuration(visitor.total_duration)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} className="text-gray-400" />
                    {formatDate(visitor.created_at)}
                </div>
            </td>
        </tr>
    );
};

const VisitorsPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [selectedVisitor, setSelectedVisitor] = useState<VisitorData | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: visitorsResponse, isLoading, error } = useGetAllVisitors({
        per_page: 25,
        page,
    });

    const visitors = visitorsResponse?.data || [];
    const meta = visitorsResponse?.meta;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "-";
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        return `${minutes}m`;
    };

    const handleRowClick = (visitor: VisitorData) => {
        setSelectedVisitor(visitor);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedVisitor(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Visitors</h1>
                <p className="text-gray-600">Track and analyze visitor sessions</p>
            </div>

            {/* Visitors Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Visitor ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Device
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Browser
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Referrer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pages
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="w-5 h-5 animate-spin text-a-green-600 mr-2" />
                                            Loading visitors...
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-red-500">
                                        Failed to load visitors. Please try again.
                                    </td>
                                </tr>
                            ) : visitors.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No visitors found
                                    </td>
                                </tr>
                            ) : (
                                visitors.map((visitor: VisitorData) => (
                                    <VisitorRow
                                        key={`${visitor.visitor_id}-${visitor.session}`}
                                        visitor={visitor}
                                        formatDate={formatDate}
                                        formatDuration={formatDuration}
                                        onRowClick={handleRowClick}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {((meta.current_page - 1) * meta.per_page) + 1} to{" "}
                            {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} visitors
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </Button>
                            <div className="text-sm text-gray-700">
                                Page {meta.current_page} of {meta.last_page}
                            </div>
                            <Button
                                onClick={() => setPage(page + 1)}
                                disabled={page >= meta.last_page}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                Next
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Visitor Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open) handleCloseDialog();
            }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Visitor Details</DialogTitle>
                        <DialogDescription>
                            Complete information about this visitor session
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedVisitor && (
                        <div className="space-y-6 mt-4">
                            {/* Visitor Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500">Visitor ID</div>
                                    <div className="text-sm font-mono text-gray-900">{selectedVisitor.visitor_id}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500">Session</div>
                                    <div className="text-sm text-gray-900">#{selectedVisitor.session}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500">Device Type</div>
                                    <div className="text-sm text-gray-900 flex items-center gap-2">
                                        {selectedVisitor.device_type ? (
                                            <>
                                                <Monitor size={14} className="text-gray-400" />
                                                {selectedVisitor.device_type}
                                            </>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500">Browser</div>
                                    <div className="text-sm text-gray-900 flex items-center gap-2">
                                        {selectedVisitor.browser ? (
                                            <>
                                                <Globe size={14} className="text-gray-400" />
                                                {selectedVisitor.browser}
                                            </>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500">Referrer</div>
                                    <div className="text-sm text-gray-900">
                                        {selectedVisitor.ref || <span className="text-gray-400">Direct</span>}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500">Total Duration</div>
                                    <div className="text-sm text-gray-900 flex items-center gap-2">
                                        <Clock size={14} className="text-gray-400" />
                                        {formatDuration(selectedVisitor.total_duration)}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500">Created At</div>
                                    <div className="text-sm text-gray-900 flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        {formatDate(selectedVisitor.created_at)}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500">Updated At</div>
                                    <div className="text-sm text-gray-900 flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        {formatDate(selectedVisitor.updated_at)}
                                    </div>
                                </div>
                            </div>

                            {/* Page Visits */}
                            {selectedVisitor.page_visits && selectedVisitor.page_visits.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="text-lg font-semibold text-gray-900">
                                        Page Visits ({selectedVisitor.page_visits.length})
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                                        {selectedVisitor.page_visits.map((visit, index) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {visit.page_name}
                                                        {visit.section_name && (
                                                            <span className="text-gray-500"> / {visit.section_name}</span>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1 text-xs text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">In:</span>
                                                            <span>{new Date(visit.in_time).toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">Out:</span>
                                                            <span>{new Date(visit.out_time).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 text-center py-4">
                                    No page visits recorded
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VisitorsPage;
