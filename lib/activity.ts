import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const updateLastActive = async (userId: string) => {
  try {
    await updateDoc(doc(db, "valid_profiles", userId), {
      lastActiveAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Activity update failed", err);
  }
};
