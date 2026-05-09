"use client";

type Creator = {
  id: string;
  displayName: string;
  score: number;
  status: string;
  subscriptionStatus?: string;
  profilePhoto?: string;
  badgeNumber?: number | string;
};

export default function CreatorCard({ creator }: { creator: Creator }) {
  const photo =
    creator.profilePhoto && creator.profilePhoto !== ""
      ? creator.profilePhoto
      : "https://via.placeholder.com/300x300.png?text=No+Photo";

  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-orange-400 p-[2px]">
      <div className="bg-[#0b0f1a] rounded-2xl p-5">

        {/* TOP */}
        <div className="flex items-center gap-4">

          {/* IMAGE */}
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-800">
            <img
              src={photo}
              alt="profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/300x300.png?text=No+Photo";
              }}
            />
          </div>

          {/* INFO */}
          <div className="flex-1">
            <div className="text-white font-semibold text-lg">
              @{creator.displayName || "user"}
            </div>

            <div className="text-gray-400 text-sm">
              Badge #{creator.badgeNumber || "—"}
            </div>

            <div className="text-green-400 text-sm mt-1">
              {creator.status || "active"}
            </div>
          </div>

          {/* PLAN */}
          <div className="text-xs bg-gray-700 px-3 py-1 rounded-full">
            {creator.subscriptionStatus || "free"}
          </div>
        </div>

        {/* SCORE */}
        <div className="mt-6">
          <div className="text-gray-400 text-sm">
            TRANSPARENCY SCORE
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="w-full h-2 bg-gray-800 rounded-full mr-3">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-orange-400"
                style={{ width: `${creator.score || 0}%` }}
              />
            </div>

            <div className="text-pink-400 text-xl font-bold">
              {creator.score || 0}
            </div>
          </div>

          <div className="text-gray-500 text-xs mt-3">
            Limited transparency — upgrade for full visibility
          </div>
        </div>
      </div>
    </div>
  );
}
