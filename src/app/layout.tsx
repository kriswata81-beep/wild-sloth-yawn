import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MĀKOA — Under the Malu",
  description: "Mākoa Brotherhood Order. Men who build. Men who stand. West Oahu, Hawaiʻi. MAYDAY Summit Founders Event — May 2026.",
  keywords: ["Mākoa", "brotherhood", "men", "Hawaii", "MAYDAY", "fraternal order", "ice bath", "healing circle"],
  openGraph: {
    title: "MĀKOA — Under the Malu",
    description: "The war is against silence. The enemy is isolation. The weapon is brotherhood.",
    siteName: "Mākoa Order",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MĀKOA — Under the Malu",
    description: "The war is against silence. The enemy is isolation. The weapon is brotherhood.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
