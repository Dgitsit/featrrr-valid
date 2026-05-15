"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function TransparencyPage() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");

  // 🔥 Detect logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
      } else {
        setUserEmail("");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Submit disclosure
  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to submit a disclosure");
      return;
    }

    if (!title || !description) {
      alert("Title and description are required");
      return;
    }

    try {
      const idToken = await user.getIdToken();

      const res = await fetch("/api/disclosures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          link,
          category,
        }),
      });

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        return;
      }

      if (res.ok) {
        alert("Disclosure submitted!");

        // Reset form
        setTitle("");
        setDescription("");
        setLink("");
        setCategory("");
      } else {
        alert("Error submitting disclosure");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <div className="max-w-xl mx-auto space-y-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold">
          Submit Transparency Disclosure
        </h1>

        {/* USER STATUS */}
        <div className="text-sm text-gray-500">
          {loading
            ? "Checking login..."
            : userEmail
            ? `Logged in as ${userEmail}`
            : "Not logged in"}
        </div>

        {/* FORM */}
        <input
          placeholder="Title"
          className="w-full p-3 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full p-3 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Link (optional)"
          className="w-full p-3 border rounded"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <input
          placeholder="Category (optional)"
          className="w-full p-3 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded font-semibold"
        >
          Submit Disclosure
        </button>

      </div>
    </div>
  );
}
