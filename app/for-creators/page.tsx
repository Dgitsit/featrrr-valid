export default function Page() {
  return (
    <main className="px-10 py-16 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Become a Verified Creator
      </h1>

      <p className="text-gray-600 max-w-2xl mb-10">
        Featrrr Valid isn’t about telling you how to live. It’s about giving you a way to show your work with integrity and build trust at scale.
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="p-6 border rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">Stand Out</h2>
          <p className="text-gray-600">
            Separate yourself from unverified creators.
          </p>
        </div>

        <div className="p-6 border rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">Get More Work</h2>
          <p className="text-gray-600">
            Brands prefer working with verified professionals.
          </p>
        </div>

        <div className="p-6 border rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">Build Trust</h2>
          <p className="text-gray-600">
            Show consistency, reliability, and transparency.
          </p>
        </div>

      </div>

      <div className="mt-12">
        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white">
          Join Featrrr Valid
        </button>
      </div>
    </main>
  );
}
