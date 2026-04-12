import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mākoa Brotherhood — West Oʻahu's Founding Order",
  description:
    "A private brotherhood and training system. 52 weekly trainings, 12 monthly gatherings, 808 emergency channels. Founded by warriors, for warriors.",
  keywords: [
    "Mākoa",
    "brotherhood",
    "men",
    "Hawaii",
    "MAYDAY",
    "fraternal order",
    "ice bath",
    "healing circle",
  ],
  openGraph: {
    title: "Mākoa Brotherhood — West Oʻahu's Founding Order",
    description:
      "A private brotherhood and training system. 52 weekly trainings, 12 monthly gatherings, 808 emergency channels. Founded by warriors, for warriors.",
    siteName: "Mākoa Brotherhood",
    type: "website",
    locale: "en_US",
    url: "https://makoa.org",
    images: [
      {
        url: "/makoa_eclipse_crest.png",
        width: 1200,
        height: 630,
        alt: "Mākoa Brotherhood Crest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mākoa Brotherhood — West Oʻahu's Founding Order",
    description:
      "A private brotherhood and training system. 52 weekly trainings, 12 monthly gatherings, 808 emergency channels. Founded by warriors, for warriors.",
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
