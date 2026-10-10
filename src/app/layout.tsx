import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
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
          <AuthNavbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}