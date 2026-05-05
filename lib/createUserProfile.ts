import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function createOrUpdateUserProfile(
  userId: string,
  updates: any = {}
) {
  const ref = doc(db, "valid_profiles", userId);
  const snap = await getDoc(ref);

  // 🔥 BASE PROFILE (NEW USERS ONLY)
  const baseProfile = {
    displayName: "",
    email: "",
    photoURL: "",

    plan: "free",
    score: 75,

    subscriptionStatus: "inactive",
    stripeCustomerId: null,

    onboardingComplete: false,
    joinedAt: new Date(),
    lastActiveAt: new Date(), // 🔥 ACTIVITY TRACKING

    badgeNumber: Math.floor(100000 + Math.random() * 900000),

    socials: {
      instagram: {
        username: "",
        verified: false,
        verificationCode: "",
      },
    },

    persistentDisclosures: {},
    custom: {},

    flags: 0,
    updatedAt: new Date(),
  };

  // 🔥 CREATE USER IF NOT EXISTS
  if (!snap.exists()) {
    await setDoc(ref, {
      ...baseProfile,
      ...updates,
      updatedAt: new Date(),
      lastActiveAt: new Date(),
    });

    return {
      scoreAdded: 0,
    };
  }

  const existing = snap.data();

  let newScore = existing.score || 75;
  let scoreAdded = 0;

  // 🔥 DISPLAY NAME BOOST (+2)
  if (
    updates.displayName &&
    (!existing.displayName || existing.displayName === "")
  ) {
    newScore += 2;
    scoreAdded += 2;
  }

  // 🔥 PROFILE PHOTO BOOST (+3)
  if (
    updates.photoURL &&
    (!existing.photoURL || existing.photoURL === "")
  ) {
    newScore += 3;
    scoreAdded += 3;
  }

  // 🔥 ACTIVITY REFRESH BOOST (+1)
  const isOnlyActivityRefresh =
    Object.keys(updates).length === 0;

  const lastActive = existing.lastActiveAt
    ? new Date(existing.lastActiveAt)
    : null;

  const now = new Date();

  if (isOnlyActivityRefresh && lastActive) {
    const diffHours =
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

    // Only reward if >24h since last activity
    if (diffHours > 24) {
      newScore += 1;
      scoreAdded += 1;
    }
  }

  // 🔥 FINAL MERGE UPDATE
  await setDoc(
    ref,
    {
      ...updates,
      score: newScore,
      lastActiveAt: new Date(), // 🔥 ALWAYS UPDATE ACTIVITY
      updatedAt: new Date(),
    },
    { merge: true }
  );

  return {
    scoreAdded,
  };
}
