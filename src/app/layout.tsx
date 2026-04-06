import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MĀKOA — Private Order",
  description: "The Mākoa Order. Private. Invitation only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#050709" }}>
        {children}
      </body>
    </html>
  );
}
