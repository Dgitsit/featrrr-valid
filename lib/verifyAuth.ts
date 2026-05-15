import { adminAuth } from "@/lib/firebase-admin";

export async function verifyRequestAuth(
  req: Request
): Promise<{ uid: string } | null> {
  const header = req.headers.get("Authorization");

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice(7).trim();
  if (!token) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}
