import { ValidateProfile } from "@/types";

export const validateProfiles: ValidateProfile[] = [
  {
    id: "profile_1",
    name: "Jalen Carter",
    handle: "@jalenfilms",
    platform: "instagram",
    image: "/creator1.jpg",
    followers: 12000,

    // ✅ Linked to Featrrr
    featrrrUserId: "user_123",

    createdAt: new Date().toISOString(),
  },
  {
    id: "profile_2",
    name: "Maya Lens",
    handle: "@mayashoots",
    platform: "tiktok",
    image: "/creator2.jpg",
    followers: 8000,

    // ❌ Not linked
    featrrrUserId: null,

    createdAt: new Date().toISOString(),
  },
];

