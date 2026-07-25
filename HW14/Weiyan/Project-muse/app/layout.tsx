import type { Metadata } from "next";
import "@fontsource-variable/bodoni-moda/standard.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "muse",
  description: "AI-assisted fashion inspiration search and tagging."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
