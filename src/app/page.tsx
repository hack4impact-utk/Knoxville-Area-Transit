import { Box } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

import HomeCard from "@/components/home-card";

export default function HomePage(): ReactNode {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <HomeCard />
      <Link href="/departments/safety" passHref>
        Safety Page
      </Link>
      <Link href="/departments/charters" passHref>
        Charter Page
      </Link>
      <Link href="/departments/ridership" passHref>
        Ridership & System Performance Page
      </Link>
    </Box>
  );
}
