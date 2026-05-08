"use client";

import { useState } from "react";

export default function UploadCardImage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  };

  return (
    <div className="mt-6">

      {/* IMAGE CARD */}
      <div className="w-full h-52 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No Photo</span>
        )}
      </div>

      {/* FILE INPUT */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-3 text-sm text-gray-400"
      />

      {/* BUTTON */}
      <button className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-orange-400 text-white">
        Share Your Card
      </button>

    </div>
  );
}
