"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ProtectedRedirectNotice() {
  useEffect(() => {
    const url = new URL(window.location.href);

    if (url.searchParams.get("reason") === "login_required") {
      toast.error("পণ্যের বিস্তারিত দেখতে সাইন ইন করুন।", {
        id: "login-required",
      });

      url.searchParams.delete("reason");

      window.history.replaceState(
        window.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`
      );
    }
  }, []);

  return null;
}