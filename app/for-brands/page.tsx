export default function Page() {
  return (
    <main className="px-10 py-16 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Work With Verified Creators
      </h1>

      <p className="text-gray-600 max-w-2xl mb-10">
        Featrrr Valid gives brands confidence. Every Featrrr validated creator is trusted by their audience because they chose accountability.
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="p-6 border rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">Trusted Talent</h2>
          <p className="text-gray-600">
            Work with creators who have proven reliability and professionalism.
          </p>
        </div>

        <div className="p-6 border rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">Better Campaigns</h2>
          <p className="text-gray-600">
            Verified creators deliver consistent, high-quality results.
          </p>
        </div>

        <div className="p-6 border rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-2">Real Accountability</h2>
          <p className="text-gray-600">
            Creators are held to a higher standard through verification.
          </p>
        </div>

      </div>

      <div className="mt-12">
        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white">
          Find Verified Creators
        </button>
      </div>
    </main>
  );
}
