import React from "react";
import Link from "next/link";

export default function Home(): React.JSX.Element {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Ridership and System Performance
      </h1>

      <Link href="/" className="text-blue-500 hover:underline">
        ← Back to Home
      </Link>
    </main>
  );
}
