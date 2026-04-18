import type { Metadata } from "next";
import "./globals.css";
import LastChanceBanner from "@/components/LastChanceBanner";

export const metadata: Metadata = {
  title: "Mākoa — A Brotherhood of Men | West Oʻahu",
  description:
    "A brotherhood of men who build real things together. Not a gym. Not a podcast. 4am ice bath. Brotherhood circle. The oath. West Oahu. Co-Founders Weekend — May 1–4. Founding Brothers Month.",
  keywords: [
    "Mākoa", "brotherhood", "men", "Hawaii", "MAYDAY 2026",
    "West Oahu", "founding order", "ice bath", "men's healing",
    "brotherhood Hawaii", "men's circle", "4am training",
  ],
  openGraph: {
    title: "Mākoa — A Brotherhood of Men",
    description:
      "Not a gym. Not a podcast. A brotherhood of men who build real things together. West Oahu. Co-Founders Weekend — May 1–4. Founding Brothers Month.",
    siteName: "Mākoa Brotherhood",
    type: "website",
    locale: "en_US",
    url: "https://makoa.live",
    images: [
      {
        url: "/makoa_eclipse_crest.png",
        width: 1200,
        height: 1200,
        alt: "Mākoa Brotherhood — West Oahu's Founding Order",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mākoa — A Brotherhood of Men",
    description:
      "Not a gym. Not a podcast. A brotherhood of men who build real things together. West Oahu. May 1–4.",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#b08e50" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="7G Net" />
      </head>
      <body>
        <LastChanceBanner />
        {children}
      </body>
    </html>
  );
}
