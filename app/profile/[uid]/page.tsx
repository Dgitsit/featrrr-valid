import type { Metadata } from "next";
import { adminDb } from "@/lib/firebase-admin";
import { calculateScore } from "@/utils/calculateScore";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  params: Promise<{ uid: string }>;
};

async function getPublicProfile(uid: string) {
  const snap = await adminDb.collection("valid_profiles").doc(uid).get();
  if (!snap.exists) return null;

  return snap.data() || null;
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3001"
  );
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { uid } = await params;
  const profile = await getPublicProfile(uid);
  const baseUrl = getBaseUrl();
  const profileUrl = `${baseUrl}/profile/${uid}`;

  if (!profile) {
    return {
      title: "Creator not found | Featrrr Valid",
      description: "This creator is not on Featrrr Valid.",
    };
  }

  const username = profile.displayName || "creator";
  const score = calculateScore(profile);
  const status =
    profile.subscriptionStatus === "active"
      ? "verified creator"
      : profile.status || "creator";
  const title = `@${username} is Featrrr Valid`;
  const description = `Trust score ${score}/100 - ${status} on Featrrr Valid.`;
  const image = `${baseUrl}/api/og/profile/${uid}`;

  return {
    title,
    description,
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      title,
      description,
      url: profileUrl,
      siteName: "Featrrr Valid",
      type: "profile",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} creator credential card`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { uid } = await params;
  return <ProfileClient uid={uid} />;
}
