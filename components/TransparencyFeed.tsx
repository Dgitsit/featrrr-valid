export default function TransparencyFeed({ posts }: { posts: any[] }) {
  

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Transparency Log
      </h2>

      <div className="space-y-6">
        {posts.map((post, i) => (
          <div key={i} className="p-4 border rounded-xl space-y-3">

            <p className="text-sm text-gray-500">{post.date}</p>

            <h3 className="font-semibold">{post.title}</h3>

            <p className="text-gray-600">{post.description}</p>

            {/* IMAGE */}
            {post.image && (
              <img
                src={post.image}
                alt="content"
                className="rounded-lg w-full h-48 object-cover"
              />
            )}

            {/* LINK */}
            {post.link && (
              <a
                href={post.link}
                target="_blank"
                className="text-purple-600 underline"
              >
                View Original Post
              </a>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
