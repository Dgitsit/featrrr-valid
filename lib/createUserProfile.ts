import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type ProfileUpdateResult = {
  created?: boolean;
  updated?: boolean;
  scoreAdded: number;
} | null;

export const createOrUpdateUserProfile = async (
  userId: string,
  data: any = {}
): Promise<ProfileUpdateResult> => {
  try {
    const ref = doc(db, "valid_profiles", userId);
    const snap = await getDoc(ref);

    let scoreAdded = 0;

    // 🆕 CREATE USER
    if (!snap.exists()) {
      await setDoc(ref, {
        email: data.email || "",
        displayName: "",
        onboardingComplete: false,
        subscriptionStatus: "free",
        score: 60,
        photoURL: "",
        socials: {
          instagram: {
            username: "",
            verified: false,
            verificationCode: "",
          },
        },
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
        ...data,
      });

      return { created: true, scoreAdded: 0 };
    }

    const existing = snap.data();

    // 🔥 SCORING LOGIC

    // Onboarding bonus
    if (
      data.onboardingComplete === true &&
      !existing?.onboardingComplete
    ) {
      scoreAdded += 3;
    }

    // Photo bonus
    if (data.photoURL && !existing?.photoURL) {
      scoreAdded += 2;
    }

    // Instagram verification bonus
    if (
      data["socials.instagram.verified"] === true &&
      !existing?.socials?.instagram?.verified
    ) {
      scoreAdded += 5;
    }

    // 🔄 UPDATE USER (SAFE — preserves nested data)
    await updateDoc(ref, {
      ...data,
      lastActiveAt: serverTimestamp(),
      ...(scoreAdded > 0 && {
        score: (existing?.score || 60) + scoreAdded,
      }),
    });

    return { updated: true, scoreAdded };

  } catch (err) {
    console.error("Create/Update error:", err);
    return null;
  }
};
