import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mākoa — A Brotherhood of Men | West Oʻahu",
  description:
    "A brotherhood of men who build real things together. Not a gym. Not a podcast. 4am ice bath. Brotherhood circle. The oath. West Oahu. May 1–3. The founding fire happens once.",
  keywords: [
    "Mākoa", "brotherhood", "men", "Hawaii", "MAYDAY 2026",
    "West Oahu", "founding order", "ice bath", "men's healing",
    "brotherhood Hawaii", "men's circle", "4am training",
  ],
  openGraph: {
    title: "Mākoa — A Brotherhood of Men",
    description:
      "Not a gym. Not a podcast. A brotherhood of men who build real things together. West Oahu. May 1–3. The founding fire happens once.",
    siteName: "Mākoa Brotherhood",
    type: "website",
    locale: "en_US",
    url: "https://makoa.live",
    images: [
      {
        url: "/makoa_eclipse_crest.png",
        width: 800,
        height: 800,
        alt: "Mākoa Brotherhood — West Oahu's Founding Order",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mākoa — A Brotherhood of Men",
    description:
      "Not a gym. Not a podcast. A brotherhood of men who build real things together. West Oahu. May 1–3.",
    images: ["/makoa_eclipse_crest.png"],
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
