"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/core/TextInput";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit3, Plus } from "lucide-react";
import { CategoryType, useCreateCategory, useUpdateCategory } from "@/hooks/category.hooks";

interface CategoryFormProps {
    instance?: CategoryType | null;
    iconOnly?: boolean;
}

const CategoryValidation = () =>
    yup.object().shape({
        name: yup.string().required("Category name is required"),
        status: yup.string().required("Status is required"),
    });

const CategoryForm: React.FC<CategoryFormProps> = ({ instance = null, iconOnly = false }) => {
    const [open, setOpen] = useState(false);
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory(instance?.id?.toString() || "");

    const isEditMode = !!instance;

    const {
        handleChange,
        values,
        touched,
        errors,
        handleSubmit,
        resetForm,
        setValues,
    } = useFormik({
        initialValues: {
            name: instance?.name || "",
            status: instance?.status || "published",
        },
        validationSchema: CategoryValidation,
        enableReinitialize: true,
        onSubmit: async (data) => {
            try {
                const payload = {
                    name: data.name,
                    status: data.status,
                };

                if (isEditMode) {
                    const result = await updateCategory.mutateAsync(payload);
                    if (result.success) {
                        toast.success(result.message || "Category updated successfully");
                        resetForm();
                        setOpen(false);
                    } else {
                        toast.error(result.message || "Failed to update category");
                    }
                } else {
                    const result = await createCategory.mutateAsync(payload);
                    if (result.success) {
                        toast.success(result.message || "Category created successfully");
                        resetForm();
                        setOpen(false);
                    } else {
                        toast.error(result.message || "Failed to create category");
                    }
                }
            } catch (error: any) {
                if (error.errors && Array.isArray(error.errors)) {
                    error.errors.forEach((key: { attr: string; detail: string }) => {
                        toast.error(`${key?.attr} - ${key?.detail}`);
                    });
                } else {
                    toast.error(error?.message || "An error occurred");
                }
            }
        },
    });

    useEffect(() => {
        if (instance && open) {
            setValues({
                name: instance.name || "",
                status: instance.status || "published",
            });
        } else if (!instance && open) {
            setValues({
                name: "",
                status: "published",
            });
        }
    }, [instance, open, setValues]);

    const isLoading = isEditMode
        ? updateCategory.isPending
        : createCategory.isPending;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditMode ? (
                    <button className="text-a-green-600 hover:text-a-green-600/80 cursor-pointer transition-colors">
                        <Edit3 className="w-5 h-5" />
                    </button>
                ) : iconOnly ? (
                    <button className="flex items-center gap-2 bg-a-green-600 text-white px-4 py-2 rounded-lg hover:bg-a-green-600/90 transition-colors">
                        <Plus className="w-5 h-5" />
                    </button>
                ) : (
                    <Button className="flex items-center gap-2 bg-a-green-600 text-white px-4 py-2 rounded-lg hover:bg-a-green-600/90 transition-colors">
                        <Plus size={20} />
                        Add Category
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        {isEditMode ? "Edit Category" : "Create Category"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Update the category details below" : "Add a new category to organize your menu"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Category Name
                        </Label>
                        <TextInput
                            className="border border-a-green-600 rounded-lg"
                            id="name"
                            type="text"
                            name="name"
                            onChange={handleChange}
                            value={values.name}
                            error={
                                Boolean(errors.name) && touched.name ? errors.name : undefined
                            }
                            placeholder="e.g., Pizza, Burgers, Drinks"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium">
                            Status
                        </Label>
                        <select
                            id="status"
                            name="status"
                            onChange={handleChange}
                            value={values.status}
                            className="w-full px-3 py-2 border border-a-green-600 rounded-lg focus:ring-2 focus:ring-a-green-600 focus:border-transparent"
                        >
                            <option value="published">Published</option>
                            <option value="unpublished">Unpublished</option>
                        </select>
                        {Boolean(errors.status) && touched.status && (
                            <p className="text-sm text-red-500">{errors.status}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 justify-end mt-6">
                        <Button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setOpen(false);
                            }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-a-green-600 text-white rounded-lg hover:bg-a-green-600/90 transition-colors disabled:opacity-50"
                        >
                            {isLoading
                                ? isEditMode
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditMode
                                    ? "Update Category"
                                    : "Create Category"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryForm;
