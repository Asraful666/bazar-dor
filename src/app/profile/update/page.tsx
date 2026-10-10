import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import UpdateProfileForm from "@/components/UpdateProfileForm";

async function UpdateContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold">প্রোফাইল আপডেট</h1>
      <p className="mt-2 text-sm text-[#64756b]">
        নিচের ফর্ম থেকে আপনার নাম পরিবর্তন করুন।
      </p>

      <UpdateProfileForm initialName={session.user.name} />
    </main>
  );
}

export default function UpdateProfilePage() {
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
      <UpdateContent />
    </Suspense>
  );
}