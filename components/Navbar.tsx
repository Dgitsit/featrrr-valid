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
    <nav className="w-full flex justify-between items-center px-6 md:px-12 py-4 bg-black text-white border-b border-gray-800">

      {/* LEFT (LOGO) */}
      <Link href="/" className="font-bold text-lg">
        Featrrr Valid
      </Link>

      {/* CENTER NAV (ALWAYS VISIBLE) */}
      <div className="hidden md:flex gap-6 text-sm text-gray-400">
        <Link href="/verify" className="hover:text-white">
          Search
        </Link>

        <Link href="/how-it-works" className="hover:text-white">
          How it works
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex gap-3 items-center">

        {user ? (
          <>
            <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white">
              Dashboard
            </Link>

            <span className="text-sm text-gray-500">
              @{displayName}
            </span>

            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost">
                Login
              </Button>
            </Link>

            <Link href="/signup">
              <Button>
                Sign Up
              </Button>
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}
