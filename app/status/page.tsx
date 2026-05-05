export default function Page() {
  return (
    <main className="px-10 py-16 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Verification Status</h1>

      {/* Badge */}
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-orange-400 flex items-center justify-center text-white text-3xl font-bold">
          ✓
        </div>
        <p className="mt-4 text-green-600 font-semibold">Verified</p>
      </div>

      {/* Timeline */}
      <div className="text-left space-y-4">
        <div className="p-4 border rounded-xl">✔ Submitted</div>
        <div className="p-4 border rounded-xl">✔ Under Review</div>
        <div className="p-4 border rounded-xl bg-green-50">
          ✔ Approved
        </div>
      </div>
    </main>
  );
}