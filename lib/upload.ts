import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase";

const storage = getStorage(app);

export async function uploadProfileImage(file: File, userId: string) {
  try {
    const storageRef = ref(storage, `profiles/${userId}`);

    // ✅ correct await
    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    return url;
  } catch (err) {
    console.error("❌ Upload failed:", err);
    throw err;
  }
}
