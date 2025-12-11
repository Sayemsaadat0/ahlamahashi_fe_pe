"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useFormik } from "formik";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/core/TextInput";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAddressStore } from "@/store/AddressStore";
import { AddressValidation } from "@/validate/address.validate";
import { useGetcityList } from "@/hooks/city.hooks";

export function NavbarAddressModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { street, city, state, zipCode, setAddress } = useAddressStore();
    const { data: cityResponse, isLoading: isLoadingCities } = useGetcityList();
    const cities = cityResponse?.data?.cities || [];

    const { handleChange, values, touched, errors, handleSubmit, resetForm, setValues, setFieldValue } =
        useFormik({
            initialValues: {
                street: "",
                city_id: "",
                state: "",
                zipCode: "",
            },
            validationSchema: AddressValidation(),
            onSubmit: async (data) => {
                try {
                    // Find selected city
                    const selectedCity = cities.find((c) => c.id === parseInt(data.city_id));
                    if (!selectedCity) {
                        toast.error("Please select a valid city");
                        return;
                    }

                    setAddress({
                        street: data.street,
                        city: {
                            id: selectedCity.id,
                            name: selectedCity.name,
                        },
                        state: data.state,
                        zipCode: data.zipCode,
                    });
                    toast.success("Address saved successfully!");
                    setIsOpen(false);
                    resetForm();
                } catch (error: any) {
                    console.error("Error saving address:", error);
                    toast.error("Failed to save address. Please try again.");
                }
            },
        });

    // Load saved address when dialog opens
    useEffect(() => {
        if (isOpen) {
            if (street || city || state || zipCode) {
                setValues({
                    street: street || "",
                    city_id: city?.id?.toString() || "",
                    state: state || "",
                    zipCode: zipCode || "",
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, street, city, state, zipCode, setValues, resetForm]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <motion.button
                    className="relative p-2.5 hover:bg-a-yellow-100/20 rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <MapPin className="w-5 h-5 text-a-yellow-100" />
                </motion.button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delivery Address</DialogTitle>
                    <DialogDescription>
                        Enter your delivery address to get started with your order.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor="street" className="text-sm font-semibold text-gray-800 mb-2 block">
                            Street Address
                        </Label>
                        <TextInput
                            id="street"
                            type="text"
                            name="street"
                            className="bg-white"
                            onChange={handleChange}
                            value={values.street}
                            error={
                                Boolean(errors.street) && touched.street ? errors.street : undefined
                            }
                            placeholder="Kojak Bldg, 6/4, Boulevard Road"
                        />
                    </div>
                    <div>
                        <Label htmlFor="city_id" className="text-sm font-semibold text-gray-800 mb-2 block">
                            City
                        </Label>
                        <select
                            id="city_id"
                            name="city_id"
                            value={values.city_id}
                            onChange={(e) => setFieldValue("city_id", e.target.value)}
                            className={`w-full px-3 py-2 border ${
                                errors.city_id && touched.city_id
                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                                    : "border-gray-300 focus:ring-a-green-600 focus:border-a-green-600"
                            } outline-none peer h-11 rounded-full focus:ring-2 transition-all bg-white text-gray-900`}
                            disabled={isLoadingCities}
                        >
                            <option value="">Select a city</option>
                            {cities
                                .filter((city) => city.status === "published")
                                .map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                        </select>
                        {errors.city_id && touched.city_id && (
                            <p className="text-orange-400 px-2 pt-2">{errors.city_id}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="state" className="text-sm font-semibold text-gray-800 mb-2 block">
                                State
                            </Label>
                            <TextInput
                                id="state"
                                type="text"
                                className="bg-white"

                                name="state"
                                onChange={handleChange}
                                value={values.state}
                                error={
                                    Boolean(errors.state) && touched.state ? errors.state : undefined
                                }
                                placeholder="Dubai"
                            />
                        </div>
                        <div>
                            <Label htmlFor="zipCode" className="text-sm font-semibold text-gray-800 mb-2 block">
                                Zip Code
                            </Label>
                            <TextInput
                                id="zipCode"
                                type="text"
                                className="bg-white"

                                name="zipCode"
                                onChange={handleChange}
                                value={values.zipCode}
                                error={
                                    Boolean(errors.zipCode) && touched.zipCode ? errors.zipCode : undefined
                                }
                                placeholder="45001"
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-a-green-600 rounded-full h-10 hover:bg-a-green-600/90 text-a-yellow-100"
                    >
                        Save Address
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
