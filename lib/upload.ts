import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadProfileImage(file: File, userId: string) {
  try {
    // ✅ add unique filename
    const storageRef = ref(
      storage,
      `profiles/${userId}/profile_${Date.now()}.jpg`
    );

    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    return url;
  } catch (err) {
    console.error("❌ Upload failed:", err);
    throw err;
  }
}
