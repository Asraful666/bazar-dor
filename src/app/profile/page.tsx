import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

async function ProfileContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>

      <p className="mt-2 text-sm text-[#64756b]">
        আপনার অ্যাকাউন্টের তথ্য দেখুন ও আপডেট করুন।
      </p>

      <section className="mt-6 rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e2f2e7] text-2xl font-bold text-[#008c40]">
            {session.user.name.trim().charAt(0) || "👤"}
          </span>

          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold">
              {session.user.name}
            </h2>
            <p className="mt-1 break-all text-sm text-[#64756b]">
              {session.user.email}
            </p>
          </div>
        </div>

        <Link
          href="/profile/update"
          className="mt-6 inline-block rounded-lg bg-[#008c40] px-5 py-3 font-semibold text-white hover:bg-[#007535]"
        >
          তথ্য আপডেট করুন
        </Link>
      </section>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          className="mx-auto my-12 h-48 max-w-2xl animate-pulse rounded-2xl bg-[#e4eee7]"
        >
          <span className="sr-only">প্রোফাইল লোড হচ্ছে...</span>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}