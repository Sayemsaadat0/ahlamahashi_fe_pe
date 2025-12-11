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
import {
  MenuItem,
  useCreateMenu,
  useUpdateMenu,
} from "@/hooks/menu.hooks";
import { useGetCategoriesList } from "@/hooks/category.hooks";

interface ItemFormProps {
  instance?: MenuItem | null;
  iconOnly?: boolean;
}

const ItemValidation = () =>
  yup.object().shape({
    name: yup.string().required("Item name is required"),
    details: yup.string().required("Details are required"),
    category_id: yup.string().required("Category is required"),
    status: yup.string().required("Status is required"),
    isSpecial: yup.mixed<boolean | number>().oneOf([true, false, 1, 0]).optional(),
    thumbnail: yup.mixed<File>().nullable(),
  });

const ItemForm: React.FC<ItemFormProps> = ({ instance = null, iconOnly = false }) => {
  const [open, setOpen] = useState(false);
  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu(instance?.id ?? 0);

  const isEditMode = !!instance;

  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategoriesList();
  const categories = categoriesResponse?.data?.categories ?? [];

  const {
    handleChange,
    values,
    touched,
    errors,
    handleSubmit,
    resetForm,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: {
      name: instance?.name || "",
      details: instance?.details || "",
      category_id: instance?.category?.id ? String(instance.category.id) : "",
      status: instance?.status || "published",
      isSpecial: instance?.isSpecial || false,
      thumbnail: null as File | null,
    },
    validationSchema: ItemValidation,
    enableReinitialize: true,
    onSubmit: async (data) => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("details", data.details);
        formData.append("category_id", data.category_id);
        formData.append("status", data.status);
        formData.append("isSpecial", String(data.isSpecial ? 1 : 0));

        if (data.thumbnail) {
          formData.append("thumbnail", data.thumbnail);
        }

        if (isEditMode) {
          const result = await updateMenu.mutateAsync(formData);
          if (result.success) {
            toast.success(result.message || "Item updated successfully");
            resetForm();
            setOpen(false);
          } else {
            toast.error(result.message || "Failed to update item");
          }
        } else {
          const result = await createMenu.mutateAsync(formData);
          if (result.success) {
            toast.success(result.message || "Item created successfully");
            resetForm();
            setOpen(false);
          } else {
            toast.error(result.message || "Failed to create item");
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
        details: instance.details || "",
        category_id: instance.category?.id ? String(instance.category.id) : "",
        status: instance.status || "published",
        isSpecial: instance.isSpecial || false,
        thumbnail: null,
      });
    } else if (!instance && open) {
      setValues({
        name: "",
        details: "",
        category_id: "",
        status: "published",
        isSpecial: false,
        thumbnail: null,
      });
    }
  }, [instance, open, setValues]);

  const isLoading = isEditMode
    ? updateMenu.isPending
    : createMenu.isPending;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    setFieldValue("thumbnail", file);
  };

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
            Add Item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {isEditMode ? "Edit Item" : "Create Item"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the item details below" : "Add a new item to your menu"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
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
              placeholder="e.g., Spicy Supreme Pizza"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-sm font-medium">
              Details
            </Label>
            <textarea
              id="details"
              name="details"
              rows={4}
              className="w-full px-3 py-2 border border-a-green-600 rounded-lg focus:ring-2 focus:ring-a-green-600 focus:border-transparent"
              placeholder="Explain the dish, ingredients, serving size..."
              value={values.details}
              onChange={handleChange}
            />
            {Boolean(errors.details) && touched.details && (
              <p className="text-sm text-red-500">{errors.details}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id" className="text-sm font-medium">
              Category
            </Label>
            <select
              id="category_id"
              name="category_id"
              onChange={handleChange}
              value={values.category_id}
              disabled={isCategoriesLoading || categories.length === 0}
              className="w-full px-3 py-2 border border-a-green-600 rounded-lg focus:ring-2 focus:ring-a-green-600 focus:border-transparent disabled:opacity-50"
            >
              <option value="">
                {isCategoriesLoading
                  ? "Loading categories..."
                  : "Select a category"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
            {Boolean(errors.category_id) && touched.category_id && (
              <p className="text-sm text-red-500">{errors.category_id}</p>
            )}
          </div>

          <div className="space-y-2 hidden">
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

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                id="isSpecial"
                name="isSpecial"
                type="checkbox"
                checked={values.isSpecial}
                onChange={(e) => setFieldValue("isSpecial", e.target.checked)}
                className="w-4 h-4 text-a-green-600 border-gray-300 rounded focus:ring-a-green-600 focus:ring-2"
              />
              <Label htmlFor="isSpecial" className="text-sm font-medium cursor-pointer">
                Special Item
              </Label>
            </div>
            {Boolean(errors.isSpecial) && touched.isSpecial && (
              <p className="text-sm text-red-500">{errors.isSpecial}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-sm font-medium">
              Thumbnail
            </Label>
            <input
              id="thumbnail"
              name="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-a-green-600 rounded-lg file:mr-4 file:rounded-md file:border-0 file:bg-a-green-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:outline-none"
            />
            {Boolean(errors.thumbnail) && (
              <p className="text-sm text-red-500">{errors.thumbnail as string}</p>
            )}
            {isEditMode && instance?.thumbnail && (
              <p className="text-xs text-gray-500">
                Current thumbnail will remain unless you upload a new one.
              </p>
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
                ? "Update Item"
                : "Create Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemForm;

