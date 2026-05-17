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
        className={`${geistSans.variable} ${geistMono.variable} premium-shell min-h-screen bg-background text-foreground antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">{children}</main>

          <footer className="mx-auto mt-16 w-full max-w-7xl px-5 pb-8 sm:px-6 lg:px-8">
            <div className="glass-panel flex flex-col gap-3 rounded-2xl px-5 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <p>Featrrr Valid - transparency infrastructure for creators.</p>
              <div className="flex gap-4">
                <a href="/terms" className="transition hover:text-white">
                  Terms
                </a>
                <a href="/privacy" className="transition hover:text-white">
                  Privacy
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
