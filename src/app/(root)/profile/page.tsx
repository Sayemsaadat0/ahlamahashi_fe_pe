"use client";

import { useAuthStore } from "@/store/AuthStore";
import { useMemo, useState } from "react";

const tabs = [
  { key: "profile", label: "Profile" },
  { key: "delivery", label: "Delivery Address" },
  { key: "password", label: "Change Password" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

const ProfileCard = () => {
  const { user } = useAuthStore();

  const firstLetter = useMemo(() => {
    const name = user?.name?.trim();
    return name ? name.charAt(0).toUpperCase() : "U";
  }, [user?.name]);

  if (!user) {
    return (
      <div className="text-sm text-slate-500">
        No profile details available. Please sign in again.
      </div>
    );
  }

  return (
    <div className="rounded-3xl  mx-auto border border-slate-100 bg-white p-6 shadow-md">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white text-2xl font-semibold shadow-sm">
          {firstLetter}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {user.name || "Unnamed user"}
          </h2>
          <p className="text-sm text-slate-500">{user.email}</p>
          <p className="text-xs text-slate-400 mt-1">Joined {formatDate(user.created_at)}</p>
        </div>
      </div>
    </div>
  );
};

const DeliveryCard = () => {
  const { user } = useAuthStore();
  const address = user?.delivery_address;

  if (!address) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
        No delivery address saved yet.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Delivery address
        </p>
        <p className="mt-2 text-sm text-slate-700 leading-relaxed">
          {address.street_address}
          <br />
          {address.state}, {address.zip_code}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">City</p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {address.city?.name || "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">State</p>
          <p className="mt-2 text-sm font-medium text-slate-900">{address.state}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Zip</p>
          <p className="mt-2 text-sm font-medium text-slate-900">{address.zip_code}</p>
        </div>
      </div>
    </div>
  );
};

const ChangePasswordCard = () => {
  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
      <div>
        <label className="text-xs uppercase text-slate-400">
          Current password
        </label>
        <input
          type="password"
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-slate-900 focus:outline-none"
          placeholder="••••••••"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase text-slate-400">
            New password
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-slate-900 focus:outline-none"
            placeholder="Choose a strong password"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-slate-400">
            Confirm password
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-slate-900 focus:outline-none"
            placeholder="Repeat new password"
          />
        </div>
      </div>
      <button
        type="button"
        className="w-full rounded-2xl bg-a-green-600 px-4 py-3 text-sm font-semibold text-white transition "
      >
        Update Password
      </button>
    </form>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileCard />;
      case "delivery":
        return <DeliveryCard />;
      case "password":
        return <ChangePasswordCard />;
      default:
        return null;
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 md:px-6 lg:px-8 py-10">
      <div className="grid gap-6">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-400">
            Account
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 mt-2">
            Manage your profile
          </h1>
          <p className="text-sm text-slate-500">
            Same palette as track page, focused on clean card styling.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-slate-50/60 shadow-sm">
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 md:px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-slate-900" />
                )}
              </button>
            ))}
          </div>
          <div className="p-4 md:p-6">{renderContent()}</div>
        </section>
      </div>
    </main>
  );
}