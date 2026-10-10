"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PriceTicker from "./PriceTicker";

const categories = [
  { slug: "chal", name: "চাল", icon: "🍚" },
  { slug: "dal", name: "ডাল", icon: "🫘" },
  { slug: "tel", name: "তেল", icon: "🛢️" },
  { slug: "sobji", name: "সবজি", icon: "🥬" },
  { slug: "mach", name: "মাছ", icon: "🐟" },
  { slug: "mangsho", name: "মাংস", icon: "🍗" },
  { slug: "dim-dui", name: "ডিম-দুধ", icon: "🥛" },
  { slug: "mosla", name: "মসলা", icon: "🌶️" },
];

type NavbarUser = {
  name: string;
  email: string;
  image?: string | null;
};

type NavbarProps = {
  user?: NavbarUser | null;
  onSignOut?: () => Promise<void>;
  authLoading?: boolean;
};

export default function Navbar({
  user = null,
  onSignOut,
  authLoading = false,
}: NavbarProps) {
  const pathname = usePathname();
  const [date, setDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("bn-BD", {
      timeZone: "Asia/Dhaka",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    function updateDate() {
      setDate(formatter.format(new Date()));
    }

    updateDate();

    const timer = window.setInterval(updateDate, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    function handleFocusOutside(event: FocusEvent) {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("focusin", handleFocusOutside);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("focusin", handleFocusOutside);
    };
  }, []);

  async function handleSignOut() {
    if (!onSignOut || signingOut) return;

    setSigningOut(true);
    setLogoutError("");

    try {
      await onSignOut();
      setMenuOpen(false);
    } catch {
      setLogoutError("সাইন আউট হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      {/* প্রথম Navbar: Logo, date ও user menu */}
      <header className="relative z-30 border-b border-[#e8eee9] bg-[#fafcfb]">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex min-w-0 items-center gap-3"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#008c40] sm:h-12 sm:w-12">
              <Image
                src="/images/logo-icon.png"
                alt=""
                width={28}
                height={28}
              />
            </span>

            <div>
              <p className="text-xl leading-tight font-bold sm:text-2xl">
                বাজার দর
              </p>

              <p className="mt-1 text-[10px] text-[#64756b] sm:text-xs">
                {date || "প্রয়োজনীয় পণ্যের দাম এক নজরে"}
              </p>
            </div>
          </Link>

          {authLoading ? (
            <div
              role="status"
              aria-label="প্রোফাইল লোড হচ্ছে"
              className="h-10 w-24 animate-pulse rounded-lg bg-[#e4eee7]"
            />
          ) : user ? (
            <div ref={menuRef} className="relative">
              <button
                ref={menuButtonRef}
                type="button"
                aria-expanded={menuOpen}
                aria-controls="navbar-profile"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-[#edf5ef]"
              >
                {user.image ? (
                  <span
                    role="img"
                    aria-label={`${user.name}-এর প্রোফাইল ছবি`}
                    className="h-9 w-9 shrink-0 rounded-full bg-[#e2f2e7] bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${JSON.stringify(user.image)})`,
                    }}
                  />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e2f2e7] font-bold text-[#008c40]">
                    {user.name.trim().charAt(0) || "👤"}
                  </span>
                )}

                <span className="max-w-24 truncate text-sm sm:max-w-40">
                  {user.name}
                </span>

                <span
                  aria-hidden="true"
                  className="ml-1 text-xs text-[#64756b]"
                >
                  {menuOpen ? "▴" : "▾"}
                </span>
              </button>

              {menuOpen && (
                <div
                  id="navbar-profile"
                  className="absolute top-full right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[#dfe9e2] bg-[#fafcfb] shadow-sm"
                >
                  <div className="border-b border-[#e8eee9] px-5 py-4">
                    <p className="truncate text-sm font-medium">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#64756b]">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-5 py-2.5 text-sm hover:bg-[#edf5ef]"
                    >
                      👤 আমার প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      disabled={signingOut || !onSignOut}
                      onClick={handleSignOut}
                      className="block w-full px-5 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {signingOut
                        ? "সাইন আউট হচ্ছে..."
                        : "↪ সাইন আউট"}
                    </button>

                    {logoutError && (
                      <p
                        role="alert"
                        className="px-5 py-2 text-xs text-red-600"
                      >
                        {logoutError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
              <Link
                href="/signin"
                className="rounded-lg px-2 py-2 text-xs font-semibold hover:bg-[#edf5ef] sm:px-4 sm:text-sm"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-[#008c40] px-3 py-2 text-xs font-semibold text-white hover:bg-[#007535] sm:px-5 sm:py-2.5 sm:text-sm"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* দ্বিতীয় Navbar: Category links */}
      <nav
        aria-label="পণ্যের বিভাগ"
        className="border-b border-[#dfe9e2] bg-[#fafcfb]"
      >
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
          <div className="flex w-max items-center gap-2 py-2 sm:gap-4">
            {categories.map((category) => {
              const href = `/category/${category.slug}`;
              const active = pathname === href;

              return (
                <Link
                  key={category.slug}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#008c40] text-white"
                      : "hover:bg-[#e5f2e9]"
                  }`}
                >
                  <span aria-hidden="true">{category.icon}</span>
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <PriceTicker />
    </>
  );
}