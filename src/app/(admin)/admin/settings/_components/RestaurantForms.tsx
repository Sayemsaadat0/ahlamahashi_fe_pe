'use client';
import React, { useState, useEffect } from 'react';
import {
    FileText,
    Shield,
    FileCheck,
    RotateCcw,
    Store,
    MapPin,
    Info,
    Image as ImageIcon,
    Upload
} from 'lucide-react';
import { useUpdateRestaurant, useGetMyRestaurant, Restaurant } from '@/hooks/restaurant.hook';
import { RichTextEditor } from '@/components/core/RichTextEditor';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type RestaurantFormsProps = {
    onChanged?: () => void;
}

const RestaurantForms: React.FC<RestaurantFormsProps> = ({ onChanged }) => {
    const { data: restaurantResponse, isLoading, refetch } = useGetMyRestaurant();
    const { mutateAsync: updateRestaurant, isPending: updateLoading } = useUpdateRestaurant(restaurantResponse?.data?.restaurant?.id || 1);
    
    const restaurant = restaurantResponse?.data?.restaurant;
    
    const [formData, setFormData] = useState({
        privacy_policy: '',
        terms: '',
        refund_process: '',
        license: '',
        shop_name: '',
        shop_address: '',
        shop_details: '',
        shop_phone: '',
        tax: 0,
        delivery_charge: 0,
        shop_logo: '',
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');

    // Update form data when restaurant data is loaded
    useEffect(() => {
        if (restaurant) {
            setFormData({
                privacy_policy: restaurant.privacy_policy || '',
                terms: restaurant.terms || '',
                refund_process: restaurant.refund_process || '',
                license: restaurant.license || '',
                shop_name: restaurant.shop_name || '',
                shop_address: restaurant.shop_address || '',
                shop_details: restaurant.shop_details || '',
                shop_phone: restaurant.shop_phone || '',
                tax: restaurant.tax || 0,
                delivery_charge: restaurant.delivery_charge || 0,
                shop_logo: restaurant.shop_logo || '',
            });
            if (restaurant.shop_logo) {
                setLogoPreview(restaurant.shop_logo);
            }
        }
    }, [restaurant]);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview('');
        handleInputChange('shop_logo', '');
    };

    const handleSave = async () => {
        if (!restaurant) return;
        
        try {
            // Check if we have a file to upload
            if (logoFile) {
                // Create FormData for file upload
                const formDataToUpload = new FormData();
                formDataToUpload.append('shop_logo', logoFile);
                formDataToUpload.append('shop_name', formData.shop_name);
                formDataToUpload.append('shop_address', formData.shop_address);
                formDataToUpload.append('shop_details', formData.shop_details);
                formDataToUpload.append('shop_phone', formData.shop_phone);
                formDataToUpload.append('tax', formData.tax.toString());
                formDataToUpload.append('delivery_charge', formData.delivery_charge.toString());
                formDataToUpload.append('privacy_policy', formData.privacy_policy);
                formDataToUpload.append('terms', formData.terms);
                formDataToUpload.append('refund_process', formData.refund_process);
                formDataToUpload.append('license', formData.license);
                
                const result = await updateRestaurant(formDataToUpload);
                
                if (result?.success) {
                    toast.success(result.message || 'Restaurant updated successfully');
                    if (onChanged) onChanged();
                    setLogoFile(null); // Clear file after successful upload
                    refetch();
                } else {
                    toast.error(result?.message || 'Failed to update restaurant');
                }
            } else {
                // Regular update without file
                const result = await updateRestaurant(formData);
                
                if (result?.success) {
                    toast.success(result.message || 'Restaurant updated successfully');
                    if (onChanged) onChanged();
                    refetch();
                } else {
                    toast.error(result?.message || 'Failed to update restaurant');
                }
            }
        } catch (error: any) {
            toast.error(error?.message || 'An error occurred while updating');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-a-green-600" />
                    </div>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="max-w-4xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Restaurant Settings</h3>
                    <p className="text-gray-600 text-sm">No restaurant data found</p>
                </div>
            </div>
        );
    }

  return (
        <div className="max-w-4xl space-y-6">
            {/* Shop Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Shop Information</h3>
                
                <div className="space-y-6">
                    {/* Shop Name */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Store className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Shop Name</h4>
                            <p className="text-gray-600 text-sm mb-3">The name of your restaurant that customers will see.</p>
                            <input
                                type="text"
                                value={formData.shop_name}
                                onChange={(e) => handleInputChange('shop_name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-a-green-600 focus:border-transparent"
                                placeholder="Enter shop name"
                            />
                        </div>
                    </div>

                    {/* Shop Phone */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                            <Store className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Shop Phone</h4>
                            <p className="text-gray-600 text-sm mb-3">Contact phone number for your restaurant.</p>
                            <input
                                type="text"
                                value={formData.shop_phone}
                                onChange={(e) => handleInputChange('shop_phone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-a-green-600 focus:border-transparent"
                                placeholder="Enter shop phone"
                            />
                        </div>
                    </div>

                    {/* Tax */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Store className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Tax (%)</h4>
                            <p className="text-gray-600 text-sm mb-3">Tax percentage applied to orders.</p>
                            <input
                                type="number"
                                value={formData.tax}
                                onChange={(e) => handleInputChange('tax', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-a-green-600 focus:border-transparent"
                                placeholder="Enter tax percentage"
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </div>

                    {/* Delivery Charge */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                            <Store className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Delivery Charge</h4>
                            <p className="text-gray-600 text-sm mb-3">Delivery charge amount for orders.</p>
                            <input
                                type="number"
                                value={formData.delivery_charge}
                                onChange={(e) => handleInputChange('delivery_charge', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-a-green-600 focus:border-transparent"
                                placeholder="Enter delivery charge"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Shop Address */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Shop Address</h4>
                            <p className="text-gray-600 text-sm mb-3">The physical address of your restaurant.</p>
                            <RichTextEditor
                                value={formData.shop_address}
                                onChange={(value) => handleInputChange('shop_address', value)}
                                placeholder="Enter shop address"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Shop Details */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Info className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Shop Details</h4>
                            <p className="text-gray-600 text-sm mb-3">Description and details about your restaurant.</p>
                            <RichTextEditor
                                value={formData.shop_details}
                                onChange={(value) => handleInputChange('shop_details', value)}
                                placeholder="Enter shop details"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Shop Logo */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-pink-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Shop Logo</h4>
                            <p className="text-gray-600 text-sm mb-3">Upload your restaurant logo image.</p>
                            
                    <div className="flex items-center gap-4">
                                {/* Logo Preview */}
                                {(logoPreview || formData.shop_logo) && (
                                <div className=" relative inline-block">
                                    <img 
                                        src={logoPreview || formData.shop_logo} 
                                        alt="Shop Logo Preview" 
                                        className="max-w-xs max-h-32 object-contain border border-gray-300 rounded-md p-2 bg-gray-50"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        title="Remove logo"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* File Upload Input */}
                            <div className="relative  ">
                                <input
                                    type="file"
                                    id="shop_logo_upload"
                                    accept="image/*"
                                    onChange={handleLogoFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="shop_logo_upload"
                                    className="flex flex-col max-h-32  w-full px-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-a-green-600 transition-colors group"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 mb-2 text-gray-400 group-hover:text-a-green-600" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold text-a-green-600">Click to <br /> upload
                                            </span>
                                        </p>
                                    </div>
                                </label>
                            </div>
                    </div>
                            {logoFile && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Selected: <span className="font-medium">{logoFile.name}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Legal Information</h3>
                
                <div className="space-y-6">
                    {/* Privacy Policy */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Privacy Policy</h4>
                            <p className="text-gray-600 text-sm mb-3">Your restaurant&apos;s privacy policy for customer data protection.</p>
                            <RichTextEditor
                                value={formData.privacy_policy}
                                onChange={(value) => handleInputChange('privacy_policy', value)}
                                placeholder="Enter privacy policy"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Terms and Conditions</h4>
                            <p className="text-gray-600 text-sm mb-3">Terms and conditions for using your restaurant&apos;s services.</p>
                            <RichTextEditor
                                value={formData.terms}
                                onChange={(value) => handleInputChange('terms', value)}
                                placeholder="Enter terms and conditions"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Refund Process */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <RotateCcw className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Refund Process</h4>
                            <p className="text-gray-600 text-sm mb-3">Information about your refund and return process.</p>
                            <RichTextEditor
                                value={formData.refund_process}
                                onChange={(value) => handleInputChange('refund_process', value)}
                                placeholder="Enter refund process details"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* License Information */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <FileCheck className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">License Information</h4>
                            <p className="text-gray-600 text-sm mb-3">Your restaurant&apos;s license and certification details.</p>
                            <RichTextEditor
                                value={formData.license}
                                onChange={(value) => handleInputChange('license', value)}
                                placeholder="Enter license information"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={updateLoading}
                    className="px-6 py-2 bg-a-green-600 text-white rounded-md hover:bg-a-green-600/90 focus:outline-none focus:ring-2 focus:ring-a-green-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {updateLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
    </div>
    );
};

export default RestaurantForms;