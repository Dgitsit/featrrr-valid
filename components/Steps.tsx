export default function Steps() {
  return (
    <section className="px-10 py-16 bg-gray-50 text-center rounded-2xl mx-10">

      <h2 className="text-2xl font-semibold mb-10">
        A new standard of verification.
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div>
          <h3 className="font-semibold">Start Your Valid Profile</h3>
          <p className="text-sm text-gray-500">Show who you are.</p>
        </div>

        <div>
          <h3 className="font-semibold">Review</h3>
          <p className="text-sm text-gray-500">We evaluate transparency.</p>
        </div>

        <div>
          <h3 className="font-semibold">Verified</h3>
          <p className="text-sm text-gray-500">Earn your badge.</p>
        </div>

      </div>

    </section>
  );
}
