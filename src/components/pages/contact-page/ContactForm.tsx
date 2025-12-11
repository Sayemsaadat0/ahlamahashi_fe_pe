"use client";

import { useFormik } from "formik";
import { Send } from "lucide-react";
import { toast } from "sonner";
import TextInput from "@/components/core/TextInput";
import { Label } from "@/components/ui/label";
import { ContactValidation } from "@/validate/contact.validate";
import { useCreateContact } from "@/hooks/contact.hooks";

export function ContactForm() {
  const { mutateAsync, isPending } = useCreateContact();

  const { handleChange, values, touched, errors, handleSubmit, resetForm } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      },
      validationSchema: ContactValidation(),
      onSubmit: async (data) => {
        try {
          const payload = {
            name: data.name,
            email: data.email,
            phone: data.phone || undefined,
            subject: data.subject,
            message: data.message,
          };

          const result = await mutateAsync(payload);
          
          if (result.success) {
            toast.success(result.message || "Message sent successfully! We'll get back to you soon.");
            resetForm();
          } else {
            toast.error(result.message || "Failed to send message. Please try again.");
          }
        } catch (error: any) {
          console.error("Error submitting contact form:", error);
          if (error?.response?.data?.errors) {
            error.response.data.errors.forEach((key: { attr: string; detail: string }) => {
              toast.error(`${key?.attr} - ${key?.detail}`);
            });
          } else {
            toast.error(error?.response?.data?.message || error?.message || "Failed to send message. Please try again.");
          }
        }
      },
    });

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="name" className="text-sm font-semibold text-gray-800 mb-1 block">
            Full Name
            <span className="text-a-green-600 ml-1">*</span>
          </Label>
          <TextInput
            id="name"
            type="text"
            name="name"
            onChange={handleChange}
            value={values.name}
            error={
              Boolean(errors.name) && touched.name ? errors.name : undefined
            }
            placeholder="Jahirul Islam"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-semibold text-gray-800 mb-1 block">
            Email
            <span className="text-a-green-600 ml-1">*</span>
          </Label>
          <TextInput
            id="email"
            type="email"
            name="email"
            onChange={handleChange}
            value={values.email}
            error={
              Boolean(errors.email) && touched.email ? errors.email : undefined
            }
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm font-semibold text-gray-800 mb-1 block">
          Phone
        </Label>
        <TextInput
          id="phone"
          type="tel"
          name="phone"
          onChange={handleChange}
          value={values.phone}
          error={
            Boolean(errors.phone) && touched.phone ? errors.phone : undefined
          }
          placeholder="Optional but helpful"
        />
      </div>

      <div>
        <Label htmlFor="subject" className="text-sm font-semibold text-gray-800 mb-1 block">
          Subject
          <span className="text-a-green-600 ml-1">*</span>
        </Label>
        <TextInput
          id="subject"
          type="text"
          name="subject"
          onChange={handleChange}
          value={values.subject}
          error={
            Boolean(errors.subject) && touched.subject ? errors.subject : undefined
          }
          placeholder="Reservation, catering, feedback..."
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-sm font-semibold text-gray-800 mb-1 block">
          Message
          <span className="text-a-green-600 ml-1">*</span>
        </Label>
        <textarea
          id="message"
          name="message"
          rows={4}
          onChange={handleChange}
          value={values.message}
          placeholder="Tell us what you're dreaming up..."
          className={`w-full rounded-2xl border ${
            errors.message && touched.message
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-200 focus:ring-a-green-600/40 focus:border-a-green-600"
          } bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all`}
        />
        {errors.message && touched.message && (
          <p className="text-orange-400 px-2 pt-1 text-sm">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="group inline-flex items-center justify-center gap-2 w-full bg-a-green-600 text-white px-4 py-3 rounded-2xl text-sm font-semibold shadow-lg hover:bg-a-green-600/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={16} className="group-hover:translate-x-1 transition-transform" />
        {isPending ? "Sending..." : "Send message"}
      </button>
      <p className="text-xs text-gray-500 text-center">
        We respect your inbox. No spam—just a prompt response.
      </p>
    </form>
  );
}

