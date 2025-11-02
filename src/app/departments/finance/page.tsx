"use client";

import Link from "next/link";

export default function Finance() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Finance Department</h1>
      <p className="text-gray-700">
        This page displays key finance metrics and projections for future inputs.
      </p>

      
      <div className="mt-6">
        <p className="text-gray-500 italic">[Chart Placeholder]</p>
      </div>
      
      <Link
        href="/"
        className="text-blue-600 hover:underline block mt-8"
      >
        ← Back to Home
      </Link>
    </main>
  );
}
