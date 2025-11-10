import { JSX } from "react";
import Link from "next/link";

export default function NationalTransitDatabase(): JSX.Element {
  return (
    <div>
      <h1>National Transit Database</h1>
      <p>This is the super cool National Transit Database page.</p>
      <Link href= "/">Home</Link>
    </div>
  );
}
