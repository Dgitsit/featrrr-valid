import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const routeUser = async (user: any, router: any) => {
  try {
    const ref = doc(db, "valid_profiles", user.uid); // ✅ correct collection
    const snap = await getDoc(ref);

    // 👇 if no profile exists → onboarding
    if (!snap.exists()) {
      router.replace("/onboarding");
      return;
    }

    const data = snap.data();

    // 👇 main logic
    if (data.onboardingComplete) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }

  } catch (err) {
    console.error("Routing error:", err);
    router.replace("/dashboard"); // fallback
  }
};
