"use client";

import { useState } from "react";

export default function DisclosureGrid({
  posts,
  onAdd,
}: {
  posts: any[];
  onAdd: (post: any) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [activePost, setActivePost] = useState<any>(null);

  const handleSubmit = () => {
    if (!text) return;

    onAdd({
      text,
      link,
      createdAt: new Date(),
    });

    setText("");
    setLink("");
    setShowModal(false);
  };

  return (
    <div className="w-full">

      {/* GRID */}
      <div className="grid grid-cols-3 gap-2">

        {/* ➕ ADD TILE */}
        <div
          onClick={() => setShowModal(true)}
          className="aspect-square bg-[#111] flex items-center justify-center text-3xl cursor-pointer border border-gray-700 rounded"
        >
          ➕
        </div>

        {/* POSTS */}
        {posts.map((post, i) => (
          <div
            key={i}
            onClick={() => setActivePost(post)}
            className="aspect-square bg-[#111] cursor-pointer overflow-hidden rounded border border-gray-800"
          >
            {post.link ? (
              <img
                src={`https://image.thum.io/get/${post.link}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-xs p-2 text-center">
                Disclosure
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#111] p-6 rounded-xl w-full max-w-sm space-y-3">

            <h3 className="text-sm text-gray-400">Add Disclosure</h3>

            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Link (optional)"
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write disclosure..."
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-purple-500 p-2 rounded"
            >
              Post
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full text-gray-400 text-sm"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* VIEW MODAL (IG STYLE) */}
      {activePost && (
        <div
          onClick={() => setActivePost(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <div className="bg-[#111] rounded-xl w-full max-w-md overflow-hidden">

            {/* IMAGE */}
            {activePost.link && (
              <img
                src={`https://image.thum.io/get/${activePost.link}`}
                className="w-full h-64 object-cover"
              />
            )}

            {/* TEXT */}
            <div className="p-4 text-sm text-gray-300">
              <p className="mb-2 font-semibold text-white">
                Disclosure:
              </p>
              <p>{activePost.text}</p>

              {activePost.link && (
                <a
                  href={activePost.link}
                  target="_blank"
                  className="text-blue-400 text-xs mt-3 block"
                >
                  View Link
                </a>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
