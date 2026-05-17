"use client";

import { useEffect, useState, useRef } from "react";
import { auth } from "@/lib/firebase";
import { calculateScore } from "@/utils/calculateScore";
import CreatorCard from "@/components/CreatorCard";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import html2canvas from "html2canvas";

export default function ProfileClient({ uid }: { uid: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState<any>(null);
  const [shareFeedback, setShareFeedback] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${uid}`);

        if (!res.ok) {
          setProfile(null);
          return;
        }

        setProfile(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (uid) loadProfile();
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-center px-6">
        This creator isn&apos;t on Featrrr Valid.
      </div>
    );
  }

  const score = calculateScore(profile);

  const creatorData = {
    id: uid,
    displayName: profile.displayName || "user",
    score,
    status: profile.status || "active",
    subscriptionStatus: profile.subscriptionStatus || "free",
    profilePhoto: profile.photoURL || "",
    badgeNumber: profile.badgeNumber || "",
  };

  const posts = (profile?.postDisclosures || []).sort((a: any, b: any) => {
    const getTime = (p: any) =>
      p.updatedAt?.seconds
        ? p.updatedAt.seconds
        : p.createdAt?.seconds
        ? p.createdAt.seconds
        : new Date(p.updatedAt || p.createdAt || 0).getTime();

    return getTime(b) - getTime(a);
  });

  const context = profile?.contextDisclosures || [];
  const contextNotes = profile?.contextNotes || "";

  const recordShareBoost = async () => {
    const user = auth.currentUser;
    if (!user || user.uid !== uid) return;

    const idToken = await user.getIdToken();
    const res = await fetch("/api/share-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!res.ok) return;

    const data = await res.json();
    setProfile((prev: any) => ({
      ...prev,
      shareBoostCount: data.shareBoostCount,
      shareBoostPoints: data.shareBoostPoints,
      lastSharedAt: data.lastSharedAt,
    }));
    setShareFeedback(data.maxed ? "Share boost maxed." : "+1 share trust point added.");
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#000",
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "featrrr-profile.png";
    link.click();
  };

  const handleShareLink = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: "Check this creator",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
    }

    await recordShareBoost();
  };

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-black text-white flex flex-col items-center py-10 px-5 sm:px-6 gap-6">
      <div className="w-full max-w-md min-w-0 overflow-hidden">
        <CreatorCard creator={creatorData} />
        <div className="mt-4">
          <ScoreBreakdown profile={profile} />
        </div>

        <div
          aria-hidden="true"
          className="fixed left-0 top-0 h-px w-px overflow-hidden pointer-events-none"
        >
          <div
            ref={cardRef}
            className="w-[1080px] h-[1080px] flex items-center justify-center bg-black"
          >
            <div className="scale-[2.2]">
              <CreatorCard creator={creatorData} />
            </div>
          </div>
        </div>

        {(context.length > 0 || contextNotes) && (
          <div className="mt-3 text-xs text-gray-400 text-center">
            <p>
              Disclosure: {context.join(", ")}
              {contextNotes && ` - ${contextNotes}`}
            </p>

            {profile.contextUpdatedAt && (
              <p className="text-[10px] text-gray-500 mt-1">
                Last updated:{" "}
                {new Date(
                  profile.contextUpdatedAt.seconds
                    ? profile.contextUpdatedAt.seconds * 1000
                    : profile.contextUpdatedAt
                ).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row">
            <button
              onClick={handleDownloadCard}
              className="min-w-0 flex-1 bg-purple-500 p-3 rounded-xl text-sm font-semibold"
            >
              Download Card
            </button>

            <button
              onClick={handleShareLink}
              className="min-w-0 flex-1 bg-orange-500 p-3 rounded-xl text-sm font-semibold"
            >
              Share Profile
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-zinc-500">
            Earn up to 3 trust points by sharing your Valid profile.
          </p>
          {shareFeedback && (
            <p className="mt-2 text-center text-xs text-sky-300">{shareFeedback}</p>
          )}
        </div>
      </div>

      <div className="w-full max-w-5xl min-w-0 overflow-hidden grid grid-cols-3 gap-2">
        {posts.map((post: any, i: number) => (
          <div
            key={i}
            onClick={() => setActivePost(post)}
            className="aspect-square cursor-pointer rounded overflow-hidden border border-gray-800"
          >
            {post.previewImage ? (
              <img
                src={post.previewImage}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : post.link ? (
              <img
                src={`https://image.thum.io/get/${post.link}`}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                Disclosure
              </div>
            )}
          </div>
        ))}

        {posts.length === 0 && (
          <div className="col-span-3 text-center text-gray-500 text-sm py-10">
            No transparency activity yet
          </div>
        )}
      </div>

      {activePost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] p-4 rounded-xl w-full max-w-md min-w-0 overflow-hidden space-y-3">
            {activePost.previewImage && (
              <img
                src={activePost.previewImage}
                className="w-full h-52 object-cover rounded"
                alt=""
              />
            )}

            {activePost.title && (
              <p className="text-sm font-semibold">{activePost.title}</p>
            )}

            {activePost.description && (
              <p className="text-xs text-gray-400">{activePost.description}</p>
            )}

            <p className="text-sm mt-3">Disclosure: {activePost.text}</p>

            {(activePost.updatedAt || activePost.createdAt) && (
              <p className="text-xs text-gray-500">
                Last updated:{" "}
                {new Date(
                  activePost.updatedAt?.seconds
                    ? activePost.updatedAt.seconds * 1000
                    : activePost.updatedAt || activePost.createdAt
                ).toLocaleDateString()}
              </p>
            )}

            {activePost.link && (
              <a
                href={activePost.link}
                target="_blank"
                className="text-blue-400 text-xs"
              >
                View original
              </a>
            )}

            <button
              onClick={() => setActivePost(null)}
              className="w-full bg-gray-700 p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm min-w-0 text-center text-gray-400 text-sm">
        Join Featrrr Valid to build trust through transparency.
      </div>
    </main>
  );
}
