import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snowman — Cold Calling",
  description: "Aplikacja do cold callingu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="h-full" suppressHydrationWarning>
      <body className={`${geist.className} h-full bg-background`}>
        <SessionProvider>
          <ThemeProvider>
            <div className="flex h-full">
              <Sidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
            <ThemeToggle />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
