export type Platform = "instagram" | "tiktok" | "youtube";

export type ValidateProfile = {
  id: string;

  // Basic identity
  name: string;
  handle: string;
  platform: Platform;
  image: string;

  // Social data
  followers: number;

  // 🔑 Core linking field
  featrrrUserId?: string | null;

  // Metadata
  createdAt: string;
};

