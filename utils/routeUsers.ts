import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const routeUser = async (user: any) => {
  try {
    const ref = doc(db, "valid_profiles", user.uid);
    const snap = await getDoc(ref);

    // 🔥 If profile doesn't exist → go to apply
    if (!snap.exists()) {
      window.location.href = "/onboarding";
      return;
    }

    const data = snap.data();

    // 🔥 If no display name → go to apply
    if (!data.displayName || data.displayName.trim() === "") {
      window.location.href = "/onboarding";
      return;
    }

    // ✅ Otherwise go dashboard
    window.location.href = "/dashboard";

  } catch (err) {
    console.error(err);
    window.location.href = "/onboarding";
  }
};
