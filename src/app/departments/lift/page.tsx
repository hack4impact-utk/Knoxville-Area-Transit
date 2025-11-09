import Link from "next/link";
import type { JSX } from "react";
import React from "react";

export default function Lift(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Lift Dashboard</h1>
      <p className="text-lg text-gray-700 mb-6">
        This page will display Lift KPIs and forms in the future.
      </p>

      {/* Optional placeholder for a chart */}
      <div className="w-full max-w-md h-48 bg-gray-200 flex items-center justify-center text-gray-500">
        Chart placeholder
      </div>

      {/* Optional: Link back to homepage */}
      <Link
        href="/"
        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </main>
  );
}
