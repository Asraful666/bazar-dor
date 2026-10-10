"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfileForm({
  initialName,
}: {
  initialName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const updatedName = name.trim();
    setErrorMessage("");

    if (!updatedName || updatedName.length > 100) {
      const message = "নাম ১ থেকে ১০০ অক্ষরের মধ্যে লিখুন।";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    setBusy(true);

    try {
      const result = await authClient.updateUser({
        name: updatedName,
      });

      if (result.error) {
        const message = result.error.message || "তথ্য আপডেট হয়নি।";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      toast.success("আপনার নাম আপডেট হয়েছে।");
      router.replace("/profile");
      router.refresh();
    } catch {
      const message = "সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-6 rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6"
    >
      <label htmlFor="profile-name" className="text-sm font-medium">
        নাম
      </label>

      <input
        id="profile-name"
        type="text"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={busy}
        maxLength={100}
        required
        className="mt-2 w-full rounded-lg border border-[#dfe9e2] bg-white px-3 py-3 outline-none focus:border-[#008c40] focus:ring-2 focus:ring-green-100"
      />

      {errorMessage && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-[#008c40] px-5 py-3 font-semibold text-white hover:bg-[#007535] disabled:opacity-60"
        >
          {busy ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
        </button>

        <Link href="/profile" className="text-sm text-[#64756b] hover:underline">
          ফিরে যান
        </Link>
      </div>
    </form>
  );
}