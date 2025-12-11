"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { CartData } from "@/hooks/cart.hooks";
import { useGetcityList } from "@/hooks/city.hooks";
import { useCreateOrder } from "@/hooks/orders.hooks";
import { useAuthStore } from "@/store/AuthStore";
import { useGuestStore } from "@/store/GuestStore";
import { useAddressStore } from "@/store/AddressStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CheckoutValidation } from "@/validate/order.validate";
import { toast } from "sonner";
import { encode256 } from "@/lib/utils";

interface CheckoutFormProps {
  cartData: CartData | undefined;
}

export default function CheckoutForm({ cartData }: CheckoutFormProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { guestId } = useGuestStore();
  const { street, city, state: addressState, zipCode } = useAddressStore();
  const { data: cityResponse, isLoading: isLoadingCities } = useGetcityList();
  const { mutateAsync: createOrder, isPending: isSubmitting } =
    useCreateOrder();
  const cities = cityResponse?.data?.cities || [];

  const { handleChange, values, touched, errors, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        email: "",
        phone: "",
        city_id: city?.id ? city.id.toString() : "",
        state: addressState || "",
        zip_code: zipCode || "",
        street_address: street || "",
        notes: "",
      },
      validationSchema: CheckoutValidation(),
      onSubmit: async (data) => {
        if (!cartData?.id) {
          toast.error("Cart not found. Please try again.");
          return;
        }

        try {
          const payload = {
            cart_id: cartData.id,
            city_id: parseInt(data.city_id),
            state: data.state,
            zip_code: data.zip_code,
            street_address: data.street_address,
            phone: data.phone,
            email: data.email,
            notes: data.notes || "",
            ...(user?.id
              ? { user_id: user.id.toString() }
              : { guest_id: guestId || "" }),
          };
          // return console.log(payload);
          const result = await createOrder(payload);
          if (result?.success) {
            toast.success(result?.message || "Order placed successfully!");
            const encodedData = encode256(result?.data);
            router.push(`/order-success?order_details=${encodedData}`);
          }
        } catch (error: any) {
          console.error("Failed to create order:", error);
          if (error?.response?.data?.errors) {
            error.response.data.errors.forEach(
              (err: { attr: string; detail: string }) => {
                toast.error(`${err.attr} - ${err.detail}`);
              }
            );
          } else {
            toast.error(
              error?.message || "Failed to place order. Please try again."
            );
          }
        }
      },
    });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Your Information</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="hello@gmail.com"
            className={`h-10 ${
              errors.email && touched.email
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-a-green-300 focus:border-a-green-500 focus:ring-2 focus:ring-a-green-500/20 active:border-a-green-500"
            }`}
          />
          {errors.email && touched.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Phone <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            placeholder="+1-555-5678"
            className={`h-10 ${
              errors.phone && touched.phone
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-a-green-300 focus:border-a-green-500 focus:ring-2 focus:ring-a-green-500/20 active:border-a-green-500"
            }`}
          />
          {errors.phone && touched.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* City Selection */}
        <div>
          <label
            htmlFor="city_id"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            City <span className="text-red-500">*</span>
          </label>
          <select
            id="city_id"
            name="city_id"
            value={values.city_id}
            onChange={(e) => setFieldValue("city_id", e.target.value)}
            className={`w-full h-10 px-4 rounded-lg border ${
              errors.city_id && touched.city_id
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-a-green-300 focus:border-a-green-500 focus:ring-2 focus:ring-a-green-500/20 active:border-a-green-500"
            } bg-white focus:bg-white outline-none transition-all text-gray-900`}
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
            <p className="mt-1 text-xs text-red-500">{errors.city_id}</p>
          )}
        </div>

        {/* Street Address */}
        <div>
          <label
            htmlFor="street_address"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Street Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="street_address"
            name="street_address"
            type="text"
            value={values.street_address}
            onChange={handleChange}
            placeholder="456 Broadway, Suite 200"
            className={`h-10 ${
              errors.street_address && touched.street_address
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-a-green-300 focus:border-a-green-500 focus:ring-2 focus:ring-a-green-500/20 active:border-a-green-500"
            }`}
          />
          {errors.street_address && touched.street_address && (
            <p className="mt-1 text-xs text-red-500">{errors.street_address}</p>
          )}
        </div>

        {/* State and Zip Code - Flex Layout */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              State <span className="text-red-500">*</span>
            </label>
            <Input
              id="state"
              name="state"
              type="text"
              value={values.state}
              onChange={handleChange}
              placeholder="New York"
              className={`h-10 ${
                errors.state && touched.state
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-a-green-300 focus:border-a-green-500 focus:ring-2 focus:ring-a-green-500/20 active:border-a-green-500"
              }`}
            />
            {errors.state && touched.state && (
              <p className="mt-1 text-xs text-red-500">{errors.state}</p>
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor="zip_code"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Zip Code <span className="text-red-500">*</span>
            </label>
            <Input
              id="zip_code"
              name="zip_code"
              type="text"
              value={values.zip_code}
              onChange={handleChange}
              placeholder="10001"
              className={`h-10 ${
                errors.zip_code && touched.zip_code
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-a-green-300 focus:border-a-green-500 focus:ring-2 focus:ring-a-green-500/20 active:border-a-green-500"
              }`}
            />
            {errors.zip_code && touched.zip_code && (
              <p className="mt-1 text-xs text-red-500">{errors.zip_code}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Delivery Note{" "}
            <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            value={values.notes}
            onChange={handleChange}
            placeholder="Call when arrived"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-a-green-300 bg-white focus:bg-white focus:border-a-green-500 focus:ring-2 focus:ring-a-green-500/20 active:border-a-green-500 outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400 text-sm"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !cartData?.id}
          className="w-full h-12 bg-a-green-600  cursor-pointer hover:bg-a-green-700 text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Confirm Order"
          )}
        </Button>
      </form>
    </div>
  );
}
