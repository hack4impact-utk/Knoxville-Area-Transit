import React, { FC } from "react";
import Link from "next/link";

const HR: FC = () => (
  <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
    <h1>Human Resources</h1>
    <p>Epic human resources page</p>
    <p>
      <Link href="/">← Home</Link>
    </p>
  </div>
);

export default HR;
