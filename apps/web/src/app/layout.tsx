import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "../lib/query-provider";

export const metadata: Metadata = {
  title: "JustDoIt",
  description: "Fast, minimal task app for focused execution.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
