'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";

const Notfound = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-slate-50">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400 mb-3">
          Oops
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Pgae Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          We couldn&apos;t find details for this order. Try refreshing or return
          home.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
          >
            Back
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-full bg-a-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-a-green-700"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
