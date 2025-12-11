"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/auth.hooks";
import { RegisterValidation } from "@/validate/auth.validate";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Loader2, UserPlus, Lock, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface RegisterViaOrderProps {
  email: string;
}

export default function RegisterViaOrder({ email }: RegisterViaOrderProps) {
  const { mutateAsync, isPending: isRegisterLoading } = useRegister();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const { handleChange, values, touched, errors, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      name: "",
      email: email,
      password: "",
      password_confirmation: "",
    },
    validationSchema: RegisterValidation(),
    enableReinitialize: true,
    onSubmit: async (data) => {
      try {
        const payload = {
          name: data.name,
          email: email,
          password: data.password,
          password_confirmation: data.password, // Use same password for confirmation
        };
        const result = await mutateAsync(payload);
        if (result.success) {
          setShowSuccessDialog(true);
        }
      } catch (error: any) {
        if (error?.errors) {
          error.errors.forEach((key: { attr: string; detail: string }) => {
            toast.error(`${key?.attr} - ${key?.detail}`);
          });
        } else {
          toast.error(error?.message || "Failed to create account. Please try again.");
        }
      }
    },
  });

  // Sync password_confirmation with password
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    setFieldValue("password_confirmation", e.target.value);
  };

  return (
    <>
      <div className="bg-white  rounded-2xl border-2 border-a-green-200/50 shadow-lg shadow-a-green-100/20 p-6 mt-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-a-green-200/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-a-green-300/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
        
        <div className="relative z-10">
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex bg-a-green-600 items-center justify-center w-12 h-12 rounded-full shadow-lg shadow-a-green-500/30">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Become a Family Member
              </h2>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3" />
              Exclusive benefits await
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-6 ml-0">
            Create an account to track your orders and enjoy exclusive benefits.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="relative">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2  flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-a-green-600" />
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                onChange={handleChange}
                value={values.name}
                placeholder="Enter your full name"
                className={`h-11 pl-4 ${
                  errors.name && touched.name
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : "border-a-green-300 focus:border-a-green-500 focus:ring-2 focus:ring-a-green-500/20 active:border-a-green-500"
                }`}
              />
              {errors.name && touched.name && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2  flex items-center gap-2">
                <Lock className="w-4 h-4 text-a-green-600" />
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                onChange={handlePasswordChange}
                value={values.password}
                placeholder="Create a secure password"
                className={`h-11 pl-4 ${
                  errors.password && touched.password
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : "border-a-green-300 focus:border-a-green-500 focus:ring-2 focus:ring-a-green-500/20 active:border-a-green-500"
                }`}
              />
              {errors.password && touched.password && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Email Display (read-only) */}
            <div className="relative">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2  flex items-center gap-2">
                <Mail className="w-4 h-4 text-a-green-600" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={values.email}
                disabled
                className="h-11 pl-4 "
              />
              <p className="mt-1.5 text-xs text-gray-500 italic">
                Pre-filled from your order
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isRegisterLoading}
              className="w-full h-12 bg-a-green-600 hover:from-a-green-700 hover:to-a-green-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-a-green-500/30 hover:shadow-xl hover:shadow-a-green-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isRegisterLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="sm:max-w-md bg-a-yellow-100 p-5">
          <AlertDialogHeader>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-a-green-600 to-a-green-600 shadow-lg shadow-a-green-500/30 mb-2">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-gray-900">
                Welcome to the Family! 🎉
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-gray-600 pt-2">
                You are now a member. Start exploring exclusive benefits and track your orders easily.
                <br />
                <Link
                  href="/login"
                  className="text-a-green-600 hover:text-a-green-700 font-bold underline mt-2 inline-block"
                >
                  Click here to log in
                </Link>
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

