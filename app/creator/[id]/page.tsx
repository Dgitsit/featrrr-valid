import { getMergedCreators } from "@/lib/mergeCreators";
import { notFound } from "next/navigation";

export default function CreatorProfile({ params }: { params: { id: string } }) {
  const creators = getMergedCreators();
  const creator = creators.find((c) => c.id === params.id);

  if (!creator) return notFound();

  const isFeatrrrUser = creator.isFeatrrrUser;

  // ✅ SAFE VALUES (prevents errors)
  const rating = creator.featrrrData?.rating ?? 0;
  const price = creator.featrrrData?.startingPrice ?? 0;

return (
  <div className="bg-gray-50 min-h-screen py-12 px-6">
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">

      {/* LEFT SIDE */}
      <div className="md:col-span-2">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">
            {creator.name}
          </h1>

          <p className="text-gray-500 mt-1">{creator.handle}</p>

          {isFeatrrrUser && (
            <div className="mt-3 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              <span>●</span> Verified Creator
            </div>
          )}
        </div>

        {/* TRUST ROW */}
        {isFeatrrrUser && (
          <div className="flex items-center gap-6 text-sm text-gray-700 mb-10">
            <span>⭐ {rating} rating</span>
            <span>•</span>
            <span>${price} starting</span>
          </div>
        )}

        {/* PORTFOLIO */}
        <div className="grid grid-cols-2 gap-5">
          <div className="h-44 bg-gray-200 rounded-lg"></div>
          <div className="h-44 bg-gray-200 rounded-lg"></div>
          <div className="h-44 bg-gray-200 rounded-lg"></div>
          <div className="h-44 bg-gray-200 rounded-lg"></div>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="md:col-span-1">

        <div className="bg-white border rounded-2xl p-6 sticky top-28 shadow-sm">

          {isFeatrrrUser ? (
            <>
              {/* PRICE */}
              <div className="mb-5">
                <p className="text-2xl font-semibold">${price}</p>
                <p className="text-sm text-gray-500">Starting price</p>

                <p className="text-sm mt-2 text-gray-700">
                  ⭐ {rating} rating
                </p>
              </div>

              {/* PRIMARY CTA */}
              <button
                onClick={() => {
                  window.location.href = `featrrr://creator/${creator.featrrrUserId}`;
                  setTimeout(() => {
                    window.location.href = "https://featrrr.com/download";
                  }, 1500);
                }}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition mb-3"
              >
                Hire this creator
              </button>

              {/* SECONDARY */}
              <button className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition">
                Send proposal
              </button>

              {/* TRUST MICROCOPY */}
              <p className="text-xs text-gray-400 mt-4 text-center">
                Secure booking handled through Featrrr
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-5">
                This creator isn’t on Featrrr yet.
              </p>

              <button className="w-full bg-black text-white py-3 rounded-lg mb-3">
                Request booking
              </button>

              <button
                onClick={() =>
                  (window.location.href = "https://featrrr.com/signup")
                }
                className="w-full border py-3 rounded-lg"
              >
                Claim this profile
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  </div>
);
}
