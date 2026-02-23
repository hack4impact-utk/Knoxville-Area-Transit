import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import type { ReactNode } from "react";

export default function HomePage(): ReactNode {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom>
          Knoxville Area Transit – Reporting Portal
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Select a department to enter monthly report data.
        </Typography>

        <Stack spacing={2}>
          <Button component={Link} href="/departments/charters" variant="contained">
            Charters
          </Button>
          <Button component={Link} href="/departments/lift" variant="contained">
            Lift
          </Button>
          <Button component={Link} href="/departments/safety" variant="contained">
            Safety
          </Button>
          <Button
            component={Link}
            href="/departments/ridership"
            variant="contained"
          >
            Ridership &amp; System Performance
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
