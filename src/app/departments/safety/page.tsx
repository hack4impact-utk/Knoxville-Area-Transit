import { JSX } from "react";
import Link from "next/link";

export default function Safety(): JSX.Element {
  return (
    <div>
      <h1>Safety</h1>
      <p>This is the safety page here.</p>
      <Link href= "/">Home</Link>
    </div>
  );
}
