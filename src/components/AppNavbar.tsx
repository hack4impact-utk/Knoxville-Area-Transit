"use client";

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Lift", href: "/departments/lift" },
  { label: "Charters", href: "/departments/charters" },
  { label: "Maintenance", href: "/departments/maintenance" },
  { label: "Safety", href: "/departments/safety" },
  { label: "HR/Operations", href: "/departments/hr" },
];

export default function AppNavbar() {
  const pathname = usePathname();

  return (
    <AppBar
      position="sticky"        // or "static" if you prefer
      color="primary"
      enableColorOnDark        // works nicely if you switch to dark theme later
    >
      <Toolbar>
        {/* Left: project name / logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 500 }}
        >
          Transit Ops Dashboard
        </Typography>

        {/* Right: navigation links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  color: "inherit",
                  textTransform: "none",
                  borderBottom: isActive
                    ? "2px solid rgba(255,255,255,0.9)"
                    : "2px solid transparent",
                  borderRadius: 0,
                  "&:hover": {
                    borderBottom: "2px solid rgba(255,255,255,0.7)",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
