export default function Page() {
  return (
    <main className="px-10 py-16 max-w-5xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-10">How Featrrr Valid Works</h1>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="p-6 border rounded-xl">
          <h2 className="font-semibold mb-2">1. Start Your Valid Profile</h2>
          <p className="text-gray-600">
            Submit your profile for verification
          </p>
        </div>

        <div className="p-6 border rounded-xl">
          <h2 className="font-semibold mb-2">2. Review</h2>
          <p className="text-gray-600">
            We check authenticity & consistency
          </p>
        </div>

        <div className="p-6 border rounded-xl">
          <h2 className="font-semibold mb-2">3. Verified</h2>
          <p className="text-gray-600">
            Earn your trusted badge
          </p>
        </div>

        <div className="p-6 border rounded-xl">
          <h2 className="font-semibold mb-2">4. Get Hired</h2>
          <p className="text-gray-600">
            Brands work with confidence
          </p>
        </div>

      </div>
    </main>
  );
}
