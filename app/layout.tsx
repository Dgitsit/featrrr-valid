import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Featrrr Valid",
  description: "The accountability standard for creators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-black antialiased`}
      >
        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="flex-1">{children}</main>

        {/* ✅ FOOTER (moved INSIDE return) */}
        <footer className="mt-16 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
          <a href="/terms" className="mr-4 underline">
            Terms
          </a>
          <a href="/privacy" className="underline">
            Privacy
          </a>
        </footer>
      </body>
    </html>
  );
}
