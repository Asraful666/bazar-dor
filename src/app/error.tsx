"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold">
        কিছু সমস্যা হয়েছে!
      </h1>

      <p className="mt-3 text-gray-600">
        অনুগ্রহ করে আবার চেষ্টা করুন।
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-green-700 px-6 py-3 text-white hover:bg-green-800"
      >
        আবার চেষ্টা করুন
      </button>
    </main>
  );
}