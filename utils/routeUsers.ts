import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const routeUser = async (user: any, router: any) => {
  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      router.push("/onboarding");
      return;
    }

    const data = snap.data();

    if (data.subscriptionStatus === "active") {
      router.push("/dashboard");
    } else {
      router.push("/onboarding");
    }

  } catch (err) {
    console.error("Routing error:", err);
    router.push("/dashboard"); // fallback
  }
};
