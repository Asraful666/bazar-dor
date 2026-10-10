import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold text-green-700">৪০৪</h1>
      <p className="mt-4 text-xl">পেজটি খুঁজে পাওয়া যায়নি।</p>

      <Link
        href="/"
        className="mt-6 rounded-lg bg-green-700 px-6 py-3 text-white"
      >
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}