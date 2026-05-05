type VerificationCardProps = {
  name: string;
  username: string;
  verified: boolean;
  score: number;
};

export default function VerificationCard({
  name,
  username,
  verified,
  score,
}: VerificationCardProps) {
  return (
    <div className="p-6 border rounded-2xl shadow-sm flex items-center justify-between">
      
      {/* LEFT */}
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-500">@{username}</p>

        <div className="mt-2 flex items-center gap-2">
          {verified ? (
            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-600">
              Verified
            </span>
          ) : (
            <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-500">
              Not Verified
            </span>
          )}

          <span className="text-sm text-gray-600">
            Score: {score}%
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <button className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white">
        View Profile
      </button>
    </div>
  );
}
