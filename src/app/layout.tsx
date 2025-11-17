import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import type { ReactNode } from "react";

import AppNavbar from "@/components/app-navbar";
import NextAuthProvider from "@/providers/next-auth-provider";
import NotistackProvider from "@/providers/notistack-provider";
import theme from "@/styles/theme";

export const metadata: Metadata = {
  title: "Insert project title here",
  description: "Insert project description here",
};

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <NotistackProvider>
              <NextAuthProvider>
                <CssBaseline />
                <AppNavbar />
                {children}
              </NextAuthProvider>
            </NotistackProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
