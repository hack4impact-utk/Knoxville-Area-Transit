import Link from "next/link";
import { JSX } from "react";

export default function Home(): JSX.Element {
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
