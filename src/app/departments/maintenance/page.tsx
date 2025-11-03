"use client";

import Link from "next/link";

export default function Finance() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Maintenance page</h1>
      <p className="text-gray-700">
        This is the page that will display Maintenance metrics and future inputs.
      </p>
      
      <Link
        href="/"
        className="text-blue-600 hover:underline block mt-8"
      >
        ← Back to Home
      </Link>
    </main>
  );
}