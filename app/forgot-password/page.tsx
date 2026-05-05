"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      console.error(err);
      alert("Error sending reset email");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="p-8 border rounded-xl w-full max-w-sm">

        <h1 className="text-2xl font-bold mb-4">
          Reset Password
        </h1>

        {sent ? (
          <p className="text-green-600 text-sm">
            Reset email sent. Check your inbox.
          </p>
        ) : (
          <>
            <input
              placeholder="Enter your email"
              className="w-full border p-2 mb-4"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-purple-500 to-orange-400 text-white py-2 rounded"
            >
              Send Reset Link
            </button>
          </>
        )}

      </div>
    </main>
  );
}
