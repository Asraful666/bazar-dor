"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type Props = {
  mode: "signin" | "signup";
};

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function showError(message: string) {
    setErrorMessage(message);
    toast.error(message);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setErrorMessage("");

    if (isSignup && !name.trim()) {
      showError("আপনার নাম লিখুন।");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showError("সঠিক ইমেইল লিখুন।");
      return;
    }

    if (password.length < 8) {
      showError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password.length > 128) {
      showError("পাসওয়ার্ড সর্বোচ্চ ১২৮ অক্ষরের হতে পারে।");
      return;
    }

    setBusy(true);

    try {
      if (isSignup) {
        const result = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        if (result.error) {
          showError(result.error.message || "রেজিস্ট্রেশন হয়নি।");
          return;
        }

        toast.success("রেজিস্ট্রেশন সফল! এখন সাইন ইন করুন।");
        router.replace("/signin");
      } else {
        const result = await authClient.signIn.email({
          email: email.trim(),
          password,
        });

        if (result.error) {
          showError(
            result.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।"
          );
          return;
        }

        toast.success("সাইন ইন সফল হয়েছে।");
        router.replace("/");
        router.refresh();
      }
    } catch {
      showError("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  async function handleSocialLogin(provider: "google" | "github") {
    if (busy || isPending) return;

    setBusy(true);
    setErrorMessage("");

    try {
      if (session) {
        const result = await authClient.linkSocial({
          provider,
          callbackURL: "/",
        });

        if (result.error) {
          showError(
            result.error.message || "অ্যাকাউন্ট যুক্ত করা যায়নি।"
          );
        }
      } else {
        const result = await authClient.signIn.social({
          provider,
          callbackURL: "/",
          errorCallbackURL: "/signin?error=oauth",
        });

        if (result.error) {
          showError(
            result.error.message || "Social login শুরু করা যায়নি।"
          );
        }
      }
    } catch {
      showError("Social login সম্পন্ন করা যায়নি।");
    } finally {
      setBusy(false);
    }
  }

  const inputStyle =
    "mt-2 w-full rounded-lg border border-[#dfe9e2] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#008c40] focus:ring-2 focus:ring-green-100 disabled:opacity-60";

  return (
    <main className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">
          {session
            ? "অ্যাকাউন্ট সংযুক্ত করুন"
            : isSignup
              ? "অ্যাকাউন্ট তৈরি করুন"
              : "সাইন ইন"}
        </h1>

        <p className="mt-2 text-sm text-[#64756b]">
          {session
            ? "আপনার অ্যাকাউন্টের সঙ্গে Google বা GitHub যুক্ত করুন।"
            : isSignup
              ? "বাজার দর ব্যবহার করতে নতুন অ্যাকাউন্ট খুলুন।"
              : "আপনার অ্যাকাউন্টে প্রবেশ করুন।"}
        </p>
      </div>

      <div className="rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] p-6">
        {isPending ? (
          <div role="status" className="animate-pulse space-y-4">
            <div className="h-10 rounded-lg bg-[#e4eee7]" />
            <div className="h-10 rounded-lg bg-[#e4eee7]" />
            <div className="h-10 rounded-lg bg-[#e4eee7]" />
            <span className="sr-only">লোড হচ্ছে...</span>
          </div>
        ) : (
          <>
            {session ? (
              <div className="mb-5 rounded-xl bg-[#edf5ef] p-4">
                <p className="font-semibold">{session.user.name}</p>
                <p className="mt-1 break-all text-sm text-[#64756b]">
                  {session.user.email}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
              >
                {isSignup && (
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium"
                    >
                      নাম
                    </label>

                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      disabled={busy}
                      required
                      className={inputStyle}
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    ইমেইল
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={busy}
                    required
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-medium"
                  >
                    পাসওয়ার্ড
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={
                        isSignup ? "new-password" : "current-password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      disabled={busy}
                      required
                      minLength={8}
                      maxLength={128}
                      className={`${inputStyle} pr-16`}
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "পাসওয়ার্ড লুকান"
                          : "পাসওয়ার্ড দেখান"
                      }
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute top-1/2 right-3 mt-1 -translate-y-1/2 text-xs text-[#008c40]"
                    >
                      {showPassword ? "লুকান" : "দেখান"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-lg bg-[#008c40] px-4 py-3 font-semibold text-white hover:bg-[#007535] disabled:cursor-wait disabled:opacity-60"
                >
                  {busy
                    ? "অপেক্ষা করুন..."
                    : isSignup
                      ? "সাইন আপ"
                      : "সাইন ইন"}
                </button>
              </form>
            )}

            {errorMessage && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            {!session && (
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#dfe9e2]" />
                <span className="text-xs text-[#64756b]">অথবা</span>
                <div className="h-px flex-1 bg-[#dfe9e2]" />
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => handleSocialLogin("google")}
                className="rounded-lg border border-[#dfe9e2] bg-white px-3 py-2.5 text-sm hover:bg-green-50 disabled:opacity-60"
              >
                {session ? "Google যুক্ত করুন" : "Google দিয়ে লগইন"}
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => handleSocialLogin("github")}
                className="rounded-lg border border-[#dfe9e2] bg-white px-3 py-2.5 text-sm hover:bg-green-50 disabled:opacity-60"
              >
                {session ? "GitHub যুক্ত করুন" : "GitHub দিয়ে লগইন"}
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-[#64756b]">
              {session ? (
                <Link
                  href="/"
                  className="font-semibold text-[#008c40] hover:underline"
                >
                  হোম পেজে ফিরে যান
                </Link>
              ) : (
                <>
                  {isSignup ? "আগেই অ্যাকাউন্ট আছে? " : "অ্যাকাউন্ট নেই? "}
                  <Link
                    href={isSignup ? "/signin" : "/signup"}
                    className="font-semibold text-[#008c40] hover:underline"
                  >
                    {isSignup ? "সাইন ইন করুন" : "সাইন আপ করুন"}
                  </Link>
                </>
              )}
            </p>
          </>
        )}
            </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#64756b] transition-colors hover:text-[#008c40]"
        >
          <span aria-hidden="true">←</span>
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}