"use client";

import Link from "next/link";
import React, { JSX } from "react";

export default function Finance(): JSX.Element {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Charters</h1>
      <p className="text-gray-700">
        This page displays charter bus information.
      </p>

      <Link href="/" className="text-blue-600 hover:underline block mt-8">
        ← Back to Home
      </Link>
    </main>
  );
}
