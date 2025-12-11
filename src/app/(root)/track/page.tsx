"use client";

import { useSearchParams } from "next/navigation";
import { useGetOrdersById } from "@/hooks/orders.hooks";
import { decode256 } from "@/lib/utils";
import { Suspense } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

const statusSteps = [
  {
    key: "confirmed",
    label: "Confirmed",
    caption: "We’re prepping your order",
    thumbnail: "/order/confirm.gif",
  },
  {
    key: "cooking",
    label: "Cooking",
    caption: "Chef is working on it",
    thumbnail: "/order/cooking1.gif",
  },
  {
    key: "on_the_way",
    label: "On the way",
    caption: "Courier picked it up",
    thumbnail: "/order/on-the-way.gif",
  },
  {
    key: "delivered",
    label: "Delivered",
    caption: "Enjoy your meal",
    thumbnail: "/order/deliverd.gif",
  },
];

const statusMap: Record<string, (typeof statusSteps)[number]["key"]> = {
  pending: "confirmed",
  confirmed: "confirmed",
  cooking: "cooking",
  on_the_way: "on_the_way",
  delivered: "delivered",
};

const connectorPadding = 24; // half of step indicator (12) * 2

const OrderTrackContainer = () => {
  const searchParams = useSearchParams();
  const orderDetails = searchParams.get("order_details");

  let decodedDataObject: { id: number } | null = null;
  if (orderDetails) {
    try {
      const decodedData = decode256(orderDetails);
      decodedDataObject = JSON.parse(decodedData);
    } catch {
      decodedDataObject = null;
    }
  }

  const { data: orderResponse, isLoading } = useGetOrdersById(
    decodedDataObject ? decodedDataObject.id : 0
  );
  const orderData = orderResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 mb-4">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
              Order Not Found
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              The order you&apos;re looking for doesn&apos;t exist or may have
              been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const {
    status,
    created_at,
    order_id,
    street_address,
    state,
    zip_code,
    city_details,
    phone,
    email,
    notes,
  } = orderData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const normalizedStatus = status?.toLowerCase() || "pending";
  const currentStatusKey = statusMap[normalizedStatus] ?? "confirmed";
  const currentStepIndex = Math.max(
    statusSteps.findIndex((step) => step.key === currentStatusKey),
    0
  );

  const badgeMap: Record<string, string> = {
    confirmed: "text-emerald-700 bg-emerald-100",
    cooking: "text-orange-700 bg-orange-100",
    on_the_way: "text-sky-700 bg-sky-100",
    delivered: "text-indigo-700 bg-indigo-100",
  };

  const totalSegments = Math.max(statusSteps.length - 1, 1);
  const progressRatio = currentStepIndex / totalSegments;
  const progressWidth = `calc((100% - ${connectorPadding * 2}px) * ${progressRatio})`;
  const activeStep = statusSteps.find((step) => step.key === currentStatusKey);

  return (
    <div className="min-h-screen  flex items-center justify-center md:px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        <div className="grid gap-8 p-8">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-slate-400">
                Order Tracking
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Order #{order_id}
              </h1>
              <p className="text-sm text-slate-500">
                Placed on {created_at ? formatDate(created_at) : "—"}
              </p>
            </div>
            <span
              className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold capitalize ${badgeMap[currentStatusKey]}`}
            >
              {currentStatusKey.replaceAll("_", " ")}
            </span>
          </header>

          <section className="rounded-2xl border border-slate-100 bg-slate-50/80 p-2 md:p-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Current status
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {activeStep?.label}
              </p>
              <p className="text-sm text-slate-500">{activeStep?.caption}</p>
            </div>

            <div className="relative py-6">
              <div className="relative z-10 flex justify-between text-center">
                <span
                  className="absolute left-0 right-0 top-1/3 h-[3px] -translate-y-1/2 rounded-full bg-slate-200"
                  style={{ left: connectorPadding, right: connectorPadding }}
                />
                <span
                  className="absolute top-1/3 h-[3px] -translate-y-1/2 rounded-full bg-a-green-600 transition-all duration-500"
                  style={{
                    width: progressWidth,
                    left: connectorPadding,
                  }}
                />
                {statusSteps.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isActive = index === currentStepIndex;
                  return (
                    <div key={step.key} className="space-y-2">
                      <div
                        className={`mx-auto relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm ${
                          isActive
                            ? "border-a-green-600 bg-a-green-600 text-white"
                            : isCompleted
                            ? "border-a-green-600 bg-white text-a-green-700"
                            : "border-slate-200 bg-slate-100 text-slate-300"
                        }`}
                        aria-current={isActive}
                      >
                        {isCompleted || isActive ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <p
                        className={`text-xs font-medium ${
                          isActive || isCompleted ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {activeStep && (
              <div className="rounded-2xl  bg-white p-4 shadow-lg shadow-a-green-900/10">
                <figure className="relative  overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={activeStep.thumbnail}
                    alt={`${activeStep.label} illustration`}
                    width={480}
                    height={300}
                    className="h-full w-full object-cover max-h-[300px]"
                    unoptimized
                  />
                </figure>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-900">{activeStep.label}</p>
                  <p className="text-xs text-slate-500">{activeStep.caption}</p>
                </div>
              </div>
            )}
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 p-5 space-y-3">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Delivery address
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {street_address}
                <br />
                {state}, {zip_code}
                {city_details?.name && `, ${city_details.name}`}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 p-5 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Contact
                </p>
                <div className="mt-2 space-y-1">
                  {phone && <p className="text-sm text-slate-700">{phone}</p>}
                  {email && <p className="text-sm text-slate-700 break-all">{email}</p>}
                </div>
              </div>
              {notes && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    Notes
                  </p>
                  <p className="text-sm text-slate-700">{notes}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

//Default
const TrackOrderPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderTrackContainer />
    </Suspense>
  );
};

export default TrackOrderPage;
