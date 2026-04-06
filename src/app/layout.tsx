import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MĀKOA — Under the Malu",
  description: "Mākoa Order · Malu Trust · West Oahu · 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
