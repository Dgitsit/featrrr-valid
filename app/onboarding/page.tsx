"use client";

import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();

  const completeOnboarding = async () => {
    const user = auth.currentUser;

    if (!user) return;

    try {
      await updateDoc(doc(db, "valid_profiles", user.uid), {
        onboardingComplete: true,
      });

      console.log("✅ Onboarding completed");

      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Error completing onboarding:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-xl mb-6">Onboarding 🚀</h1>

      <button
        onClick={completeOnboarding}
        className="px-6 py-3 bg-green-500 rounded"
      >
        Finish Onboarding
      </button>
    </div>
  );
}
