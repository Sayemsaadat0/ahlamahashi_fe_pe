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
  useCreateItemPrice,
  useUpdateItemPrice,
  ItemPrice,
  ItemPricePayload,
} from "@/hooks/itemPrice.hooks";

interface PriceFormProps {
  item_id: number;
  instance?: ItemPrice | null;
  iconOnly?: boolean;
}

const PriceValidation = () =>
  yup.object().shape({
    price: yup
      .number()
      .required("Price is required")
      .positive("Price must be positive")
      .min(0.01, "Price must be at least 0.01"),
    size: yup.string().optional(),
  });

const PriceForm: React.FC<PriceFormProps> = ({
  item_id,
  instance = null,
  iconOnly = false,
}) => {
  const [open, setOpen] = useState(false);
  const createPrice = useCreateItemPrice(item_id);
  const updatePrice = useUpdateItemPrice(item_id, instance?.id ?? 0);

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
      price: instance?.price || 0,
      size: instance?.size || "",
    },
    validationSchema: PriceValidation,
    enableReinitialize: true,
    onSubmit: async (data) => {
      try {
        const payload: ItemPricePayload = {
          price: data.price,
          size: data.size || undefined,
        };

        if (isEditMode) {
          const result = await updatePrice.mutateAsync(payload);
          if (result.success) {
            toast.success(result.message || "Price updated successfully");
            resetForm();
            setOpen(false);
          } else {
            toast.error(result.message || "Failed to update price");
          }
        } else {
          const result = await createPrice.mutateAsync(payload);
          if (result.success) {
            toast.success(result.message || "Price created successfully");
            resetForm();
            setOpen(false);
          } else {
            toast.error(result.message || "Failed to create price");
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
        price: instance.price || 0,
        size: instance.size || "",
      });
    } else if (!instance && open) {
      setValues({
        price: 0,
        size: "",
      });
    }
  }, [instance, open, setValues]);

  const isLoading = isEditMode
    ? updatePrice.isPending
    : createPrice.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <button className="text-a-green-600 hover:text-a-green-600/80 cursor-pointer transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
        ) : iconOnly ? (
          <button className="flex items-center gap-2 bg-a-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-a-green-600/90 transition-colors text-sm">
            <Plus className="w-4 h-4" />
            Add Price
          </button>
        ) : (
          <Button className="flex items-center gap-2 bg-a-green-600 text-white px-4 py-2 rounded-lg hover:bg-a-green-600/90 transition-colors">
            <Plus size={20} />
            Add Price
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {isEditMode ? "Edit Price" : "Add Price"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the price details below"
              : "Add a new price for this item"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price (AED)
            </Label>
            <TextInput
              className="border border-a-green-600 rounded-lg"
              id="price"
              type="number"
              name="price"
              step="0.01"
              min="0.01"
              onChange={handleChange}
              value={values.price}
              error={
                Boolean(errors.price) && touched.price
                  ? errors.price
                  : undefined
              }
              placeholder="e.g., 50.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size" className="text-sm font-medium">
              Size (Optional)
            </Label>
            <TextInput
              className="border border-a-green-600 rounded-lg"
              id="size"
              type="text"
              name="size"
              onChange={handleChange}
              value={values.size}
              error={
                Boolean(errors.size) && touched.size ? errors.size : undefined
              }
              placeholder="e.g., Large, Medium, Small"
            />
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
                ? "Update Price"
                : "Add Price"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PriceForm;

