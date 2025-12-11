"use client";

import React from "react";
import { Loader2, Mail, Phone, Calendar } from "lucide-react";
import { useGetContactsList, useDeleteContact, Contact } from "@/hooks/contact.hooks";
import DeleteAction from "@/components/core/DeleteAction";
import { toast } from "sonner";

interface ContactRowProps {
    contact: Contact;
    getStatusColor: (status: string) => string;
    formatDate: (dateString: string) => string;
}

const ContactRow: React.FC<ContactRowProps> = ({ contact, formatDate }) => {
    const { mutateAsync: deleteContact, isPending: isDeleting } = useDeleteContact(contact.id);

    const handleDelete = async () => {
        try {
            const result = await deleteContact();
            if (result?.success) {
                toast.success(result.message || "Contact deleted successfully");
            } else {
                toast.error(result?.message || "Failed to delete contact");
            }
        } catch (error: any) {
            toast.error(error?.message || "An error occurred while deleting");
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4">
                <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail size={14} className="text-gray-400" />
                        {contact.email}
                    </div>
                    {contact.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone size={14} className="text-gray-400" />
                            {contact.phone}
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-900 font-medium">{contact.subject}</div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-700 max-w-xs truncate" title={contact.message}>
                    {contact.message}
                </div>
            </td>
        
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} className="text-gray-400" />
                    {formatDate(contact.created_at)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <DeleteAction
                    handleDeleteSubmit={handleDelete}
                    isLoading={isDeleting}
                    isOnlyIcon={true}
                />
            </td>
        </tr>
    );
};

const ContactsPage: React.FC = () => {
    const { data: contactsResponse, isLoading, error } = useGetContactsList();
    const contacts = contactsResponse?.data?.contacts || [];

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "resolved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                    <p className="text-gray-600">Manage contact form submissions</p>
                </div>
                {!isLoading && contacts.length > 0 && (
                    <div className="text-sm text-gray-700">
                        Total: <span className="font-medium">{contactsResponse?.data?.total || contacts.length}</span>
                    </div>
                )}
            </div>

            {/* Contacts Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Message
                                </th>
                               
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="w-5 h-5 animate-spin text-a-green-600 mr-2" />
                                            Loading contacts...
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                                        Failed to load contacts. Please try again.
                                    </td>
                                </tr>
                            ) : contacts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No contacts found
                                    </td>
                                </tr>
                            ) : (
                                contacts.map((contact: Contact) => (
                                    <ContactRow
                                        key={contact.id}
                                        contact={contact}
                                        getStatusColor={getStatusColor}
                                        formatDate={formatDate}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContactsPage;