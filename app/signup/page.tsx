"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createOrUpdateUserProfile } from "@/lib/createUserProfile";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // 🔥 CREATE AUTH USER
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔥 CREATE BASE PROFILE (ONLY ONCE)
      await createOrUpdateUserProfile(user.uid, {
        email: user.email,
      });

      // 🚀 SEND TO APPLY (YOUR ONBOARDING FLOW)
      router.push("/onboarding");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-6 bg-zinc-900 rounded-xl shadow-lg">
        
        <h1 className="text-2xl font-bold mb-4 text-center">
          Create your account
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-orange-500 font-semibold"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

      </div>
    </div>
  );
}
