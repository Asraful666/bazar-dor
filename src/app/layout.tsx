import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Suspense } from "react";
import AuthNavbar from "@/components/AuthNavbar";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import "./globals.css";

const banglaFont = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | আজকের বাজারের দাম",
  description:
    "প্রয়োজনীয় পণ্যের আজকের দাম ও বাজারভিত্তিক তুলনা এক জায়গায়।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body
        className={`${banglaFont.variable} flex min-h-screen flex-col antialiased`}
      >
        <Providers>
          <Suspense
            fallback={
              <div
                role="status"
                aria-label="ন্যাভবার লোড হচ্ছে"
                className="border-b border-[#e5eee8] bg-[#fafcfb]"
              >
                <div className="mx-auto flex max-w-6xl animate-pulse items-center justify-between px-4 py-4 sm:px-6">
                  <div className="h-11 w-36 rounded-lg bg-[#e4eee7]" />
                  <div className="h-10 w-28 rounded-lg bg-[#e4eee7]" />
                </div>

                <div className="mx-auto h-14 max-w-6xl animate-pulse px-4 py-3 sm:px-6">
                  <div className="h-8 rounded-lg bg-[#e4eee7]" />
                </div>

                <div className="h-10 animate-pulse bg-[#edf5ef]" />

                <span className="sr-only">লোড হচ্ছে...</span>
              </div>
            }
          >
            <AuthNavbar />
          </Suspense>

          <div className="flex-1">{children}</div>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}