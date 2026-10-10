"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Navbar from "./Navbar";

export default function AuthNavbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    const result = await authClient.signOut();

    if (result.error) {
      toast.error("সাইন আউট হয়নি। আবার চেষ্টা করুন।");
      throw new Error("Sign out failed");
    }

    toast.success("সাইন আউট সফল হয়েছে।");
    router.replace("/");
    router.refresh();
  }

  return (
    <Navbar
      user={session?.user ?? null}
      authLoading={isPending}
      onSignOut={handleSignOut}
    />
  );
}