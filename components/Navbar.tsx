 "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-black text-white border-b border-gray-800">

      {/* LEFT */}
      <div className="font-bold text-lg">
        Featrrr
      </div>

      {/* RIGHT */}
      <div className="flex gap-4 items-center">

        <Link href="/dashboard">Dashboard</Link>
        <Link href="/profile">Profile</Link>

        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded bg-red-500 text-white text-sm"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}
