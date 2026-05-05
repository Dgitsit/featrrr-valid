"use client";

import { useState } from "react";

export default function Page() {
  const [creatorId, setCreatorId] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!creatorId || !reason || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        body: JSON.stringify({
          reportedUserId: creatorId,
          reason,
          description,
        }),
      });

      if (res.ok) {
        alert("Report submitted");

        // reset form
        setCreatorId("");
        setReason("");
        setDescription("");
      } else {
        alert("Error submitting report");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <main className="px-10 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Report a Creator</h1>

      <p className="text-gray-600 mb-8">
        Help maintain integrity on Featrrr Valid. If a creator is misrepresenting themselves or acting against platform standards, report them below.
      </p>

      <div className="space-y-4">

        {/* CREATOR ID */}
        <input
          className="w-full border p-3 rounded"
          placeholder="Creator Email or ID"
          value={creatorId}
          onChange={(e) => setCreatorId(e.target.value)}
        />

        {/* REASON */}
        <select
          className="w-full border p-3 rounded"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">Reason for report</option>
          <option value="fake">Fake Content</option>
          <option value="misleading">Misleading Profile</option>
          <option value="missing_disclosure">Missing Disclosure</option>
          <option value="unprofessional">Unprofessional Behavior</option>
        </select>

        {/* DESCRIPTION */}
        <textarea
          className="w-full border p-3 rounded"
          rows={4}
          placeholder="Explain the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-full bg-red-500 text-white"
        >
          Submit Report
        </button>

      </div>
    </main>
  );
}
