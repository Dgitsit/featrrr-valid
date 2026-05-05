import Link from "next/link";

type Creator = {
  id: string;
  displayName: string;
  score: number;
  status: string;
  subscriptionStatus?: string;
  profilePhoto?: string;
};

export default function CreatorCard({ creator }: { creator: Creator }) {
  const isPaid = creator.subscriptionStatus === "active";

  return (
    <Link href={`/profile/${creator.id}`}>
      <div className="w-80 rounded-2xl overflow-hidden cursor-pointer transition hover:scale-[1.02]">

        {/* CARD CONTAINER */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-gray-800 rounded-2xl shadow-xl">

          {/* TOP IMAGE / AVATAR */}
          <div className="relative h-52 w-full bg-gray-800 flex items-center justify-center">

            {creator.profilePhoto ? (
              <img
                src={creator.profilePhoto}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              // 🔥 FALLBACK AVATAR
              <div className="flex flex-col items-center justify-center text-gray-500">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
                  👤
                </div>
                <p className="text-xs mt-2">No Photo</p>
              </div>
            )}

            {/* STATUS BADGE */}
            <div className="absolute top-3 right-3">
              {isPaid ? (
                <div className="px-3 py-1 text-[10px] rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white font-medium">
                  VALID
                </div>
              ) : (
                <div className="px-3 py-1 text-[10px] rounded-full bg-gray-700 text-gray-300 font-medium">
                  FREE
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM INFO */}
          <div className="p-5 text-white">

            {/* NAME */}
            <h2 className="text-lg font-semibold truncate">
              @{creator.displayName}
            </h2>

            {/* STATUS TEXT */}
            <p
              className={`text-xs mt-1 ${
                creator.status === "active"
                  ? "text-green-400"
                  : creator.status === "under_review"
                  ? "text-red-400"
                  : creator.status === "watch"
                  ? "text-yellow-400"
                  : "text-gray-500"
              }`}
            >
              {creator.status}
            </p>

            {/* SCORE */}
            <div className="mt-4">

              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Transparency Score</span>
                <span>{creator.score}</span>
              </div>

              {/* PROGRESS BAR */}
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-orange-400"
                  style={{
                    width: `${Math.max(0, Math.min(creator.score, 100))}%`,
                  }}
                />
              </div>

            </div>

            {/* CAP MESSAGE */}
            <p className="text-[10px] text-gray-500 mt-2">
              {isPaid
                ? "Full transparency range unlocked"
                : "Score capped at 80 on free tier"}
            </p>

          </div>
        </div>
      </div>
    </Link>
  );
}
