import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const routeUser = async (user: any, router: any) => {
  try {
    console.log("Routing user:", user.uid);

    const ref = doc(db, "valid_profiles", user.uid);
    const snap = await getDoc(ref);

    console.log("Doc exists:", snap.exists());

    if (!snap.exists()) {
      console.log("No profile → onboarding");
      router.replace("/onboarding");
      return;
    }

    const data = snap.data();
    console.log("User data:", data);

    if (data.onboardingComplete) {
      console.log("Go dashboard");
      router.replace("/dashboard");
    } else {
      console.log("Go onboarding");
      router.replace("/onboarding");
    }

  } catch (err) {
    console.error("Routing error:", err);
    router.replace("/dashboard");
  }
};