"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        try {
          const snap = await getDoc(doc(db, "valid_profiles", u.uid));
          if (snap.exists()) {
            setProfile(snap.data());
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      router.replace("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const displayName =
    profile?.displayName ||
    user?.email?.split("@")[0] ||
    "";

  return (
    <header className="sticky top-0 z-50 w-full px-3 py-3 sm:px-5">
      <nav className="glass-panel mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl px-4 py-3 text-white sm:px-5">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="group flex items-center gap-3"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-lg shadow-purple-950/20">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/25 via-transparent to-orange-400/25" />
            <span className="relative text-sm font-black tracking-tight">FV</span>
          </span>
          <span className="leading-none">
            <span className="block text-sm font-bold tracking-tight sm:text-base">
              Featrrr Valid
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.24em] text-sky-300/80 sm:block">
              Trust Tech
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-zinc-400 lg:flex">
          <Link href="/verify" className="transition hover:text-white">
            Verify
          </Link>
          <Link href="/how-it-works" className="transition hover:text-white">
            How it works
          </Link>
          <a href="/#for-creators" className="transition hover:text-white">
            For Creators
          </a>
          <a href="/#for-brands" className="transition hover:text-white">
            For Brands
          </a>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:border-sky-300/40 hover:bg-sky-400/15"
              >
                Dashboard
              </Link>
              <span className="max-w-[9rem] truncate text-sm text-zinc-500">
                @{displayName}
              </span>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-zinc-200 transition hover:bg-white/[0.1] lg:hidden"
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </span>
        </button>
      </nav>

      {menuOpen && (
        <div className="glass-panel mx-auto mt-2 w-full max-w-7xl rounded-2xl p-3 lg:hidden">
          <div className="grid gap-1 text-sm font-medium text-zinc-300">
            <Link
              href="/verify"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 transition hover:bg-white/[0.06] hover:text-white"
            >
              Verify
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 transition hover:bg-white/[0.06] hover:text-white"
            >
              How it works
            </Link>
            <a
              href="/#for-creators"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 transition hover:bg-white/[0.06] hover:text-white"
            >
              For Creators
            </a>
            <a
              href="/#for-brands"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 transition hover:bg-white/[0.06] hover:text-white"
            >
              For Brands
            </a>
          </div>

          <div className="mt-3 border-t border-white/10 pt-3">
            {user ? (
              <div className="grid gap-2">
                <div className="rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-200">
                  @{displayName}
                </div>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="secondary" full>
                    Dashboard
                  </Button>
                </Link>
                <Button variant="danger" full onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="secondary" full>
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  <Button full>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
