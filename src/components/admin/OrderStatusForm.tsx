"use client";

import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { ArrowRight, Edit } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ORDER_STATUS_FLOW,
  OrderData,
  OrderPaymentStatusValue,
  OrderStatusValue,
  useUpdateOrderStatus,
} from "@/hooks/orders.hooks";

const PAYMENT_OPTIONS: OrderPaymentStatusValue[] = ["paid", "unpaid"];
const DEFAULT_PAYMENT_STATUS: OrderPaymentStatusValue = "unpaid";

const STATUS_DESCRIPTIONS: Record<OrderStatusValue, string> = {
  pending: "Order received and awaiting kitchen confirmation",
  cooking: "Meal preparation is in progress",
  on_the_way: "Courier picked up the order",
  delivered: "Order handed to the customer",
};

const isPaymentStatusValue = (
  value: unknown
): value is OrderPaymentStatusValue =>
  typeof value === "string" &&
  PAYMENT_OPTIONS.includes(value as OrderPaymentStatusValue);

const OrderStatusValidation = yup.object().shape({
  status: yup
    .mixed<OrderStatusValue>()
    .oneOf(ORDER_STATUS_FLOW, "Select a valid status")
    .required("Status is required"),
  payment_status: yup
    .mixed<OrderPaymentStatusValue>()
    .oneOf(PAYMENT_OPTIONS, "Select a valid payment status")
    .when("status", {
      is: (status: OrderStatusValue) => status === "delivered",
      then: (schema) =>
        schema
          .required("Mark payment as paid before delivering")
          .oneOf(["paid"], "Payment must be marked as paid before delivery"),
      otherwise: (schema) => schema.optional(),
    }),
});

interface OrderStatusFormProps {
  order: OrderData;
}

interface OrderStatusFormValues {
  status: OrderStatusValue;
  payment_status?: OrderPaymentStatusValue;
}

const getCurrentStatus = (status: string): OrderStatusValue => {
  if (ORDER_STATUS_FLOW.includes(status as OrderStatusValue)) {
    return status as OrderStatusValue;
  }

  return ORDER_STATUS_FLOW[0];
};

const OrderStatusForm: React.FC<OrderStatusFormProps> = ({ order }) => {
  const [open, setOpen] = React.useState(false);
  const updateOrderStatus = useUpdateOrderStatus(order.id);

  const currentStatus = React.useMemo(
    () => getCurrentStatus(order.status),
    [order.status]
  );
  const currentIndex = React.useMemo(
    () => ORDER_STATUS_FLOW.indexOf(currentStatus),
    [currentStatus]
  );

  const nextStatus = React.useMemo(() => {
    return ORDER_STATUS_FLOW[currentIndex + 1] ?? null;
  }, [currentIndex]);

  const canAdvance = Boolean(nextStatus);

  const initialValues = React.useMemo<OrderStatusFormValues>(() => {
    const initialPayment = isPaymentStatusValue(order.payment_status)
      ? order.payment_status
      : DEFAULT_PAYMENT_STATUS;

    return {
      status: (nextStatus ?? currentStatus) as OrderStatusValue,
      payment_status:
        nextStatus === "delivered" ? "paid" : initialPayment,
    };
  }, [currentStatus, nextStatus, order.payment_status]);

  const {
    handleChange,
    values,
    touched,
    errors,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik<OrderStatusFormValues>({
    initialValues,
    validationSchema: OrderStatusValidation,
    enableReinitialize: true,
    onSubmit: async (data) => {
      try {
        if (!canAdvance) {
          toast.error("Order is already at the final stage.");
          return;
        }

        const payload = {
          status: data.status,
          ...(data.payment_status ? { payment_status: data.payment_status } : {}),
        };

        const result = await updateOrderStatus.mutateAsync(payload);

        if (result.success) {
          toast.success(result.message || "Order status updated successfully");
          resetForm();
          setOpen(false);
        } else {
          toast.error(result.message || "Failed to update order status");
        }
      } catch (error: any) {
        if (error?.errors && Array.isArray(error.errors)) {
          error.errors.forEach((item: { attr: string; detail: string }) => {
            toast.error(`${item.attr} - ${item.detail}`);
          });
        } else {
          toast.error(error?.message || "Something went wrong");
        }
      }
    },
  });

  React.useEffect(() => {
    if (values.status === "delivered") {
      setFieldValue("payment_status", "paid");
    }
  }, [values.status, setFieldValue]);

  const shouldShowPaymentField = currentStatus === "on_the_way";

  const actionLabel = (nextStatus ?? currentStatus).replace(/_/g, " ");

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            canAdvance
              ? "Update Order Status"
              : "Order already delivered"
          }
          disabled={!canAdvance}
        >
          <Edit size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-a-green-700">
            {currentStatus === "on_the_way"
              ? "Confirm & Mark as Paid"
              : "Update Order Status"}
          </DialogTitle>
          <DialogDescription>
            Current status:{" "}
            <span className="font-semibold uppercase">{currentStatus}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Next status</Label>
            <div className="rounded-2xl border border-a-green-600/40 bg-a-green-600/5 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs uppercase text-gray-500">Current</p>
                    <p className="text-lg font-semibold capitalize">
                      {currentStatus.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {STATUS_DESCRIPTIONS[currentStatus]}
                    </p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-a-green-600" />
                  <div className="flex-1">
                    <p className="text-xs uppercase text-gray-500">
                      {nextStatus ? "Next" : "Final"}
                    </p>
                    <p className="text-lg font-semibold capitalize text-a-green-700">
                      {(nextStatus ?? currentStatus).replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {STATUS_DESCRIPTIONS[nextStatus ?? currentStatus]}
                    </p>
                  </div>
                </div>
                {canAdvance ? (
                  <div className="rounded-lg bg-white px-4 py-3 text-sm text-gray-600">
                    You can only advance sequentially. Confirm to move this order to{" "}
                    <span className="font-semibold capitalize">
                      {(nextStatus ?? currentStatus).replace(/_/g, " ")}
                    </span>
                    .
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-500">
                    This order is already at its final stage.
                  </div>
                )}
              </div>
            </div>
          </div>

          {shouldShowPaymentField && (
            <div className="space-y-2 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
              <Label className="text-sm font-semibold text-yellow-900">
                Payment status update
              </Label>
              <p className="text-sm text-yellow-800">
                This action will automatically mark the payment status as{" "}
                <span className="font-semibold uppercase">PAID</span> so the order
                can be delivered.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto text-white bg-a-green-600 hover:bg-a-green-600/90"
              disabled={updateOrderStatus.isPending}
            >
              {updateOrderStatus.isPending ? "Updating..." : `Confirm`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderStatusForm;

