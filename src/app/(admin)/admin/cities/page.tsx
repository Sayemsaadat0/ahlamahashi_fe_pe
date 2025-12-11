"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/core/TextInput";
import { Loader2 } from "lucide-react";
import {
  useGetcityList,
  useCreateCity,
  useDeleteCity,
  City,
} from "@/hooks/city.hooks";
import DeleteAction from "@/components/core/DeleteAction";

const CityValidation = () =>
  yup.object().shape({
    name: yup.string().required("City name is required"),
  });

const CitiesPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading, error } = useGetcityList();
  const createCity = useCreateCity();
  const cities = data?.data?.cities || [];

  const {
    handleChange,
    values,
    touched,
    errors,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: CityValidation,
    onSubmit: async (data) => {
      try {
        setIsSubmitting(true);
        const payload = {
          name: data.name,
          status: "published" as const,
        };
        const result = await createCity.mutateAsync(payload);
        if (result.success) {
          toast.success(result.message || "City created successfully");
          resetForm();
        } else {
          toast.error(result.message || "Failed to create city");
        }
      } catch (error: any) {
        if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach((key: { attr: string; detail: string }) => {
            toast.error(`${key?.attr} - ${key?.detail}`);
          });
        } else {
          toast.error(error?.message || "An error occurred");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const CityCard = ({ city }: { city: City }) => {
    const { mutateAsync, isPending } = useDeleteCity(city.id);
    return (
      <div className="relative group aspect-square w-fit bg-white rounded-lg border border-gray-200 p-8 flex flex-col items-center justify-center hover:border-a-green-600 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 text-center">
          {city.name}
        </h3>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DeleteAction
            isOnlyIcon
            handleDeleteSubmit={() => mutateAsync()}
            isLoading={isPending}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header & Form */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cities</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <TextInput
            className="border border-gray-300 rounded-lg w-64"
            id="name"
            type="text"
            name="name"
            onChange={handleChange}
            value={values.name}
            error={
              Boolean(errors.name) && touched.name ? errors.name : undefined
            }
            placeholder="City name"
          />
          <Button
            type="submit"
            disabled={isSubmitting || createCity.isPending}
            className="px-6 bg-a-green-600 text-white rounded-lg hover:bg-a-green-600/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting || createCity.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Add"
            )}
          </Button>
        </form>
      </div>

      {/* Cities Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-a-green-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">Failed to load cities</p>
        </div>
      ) : cities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No cities found</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CitiesPage;
