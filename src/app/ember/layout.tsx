import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0606",
};

export const metadata: Metadata = {
  title: "XI · Ember",
  description: "Mākoa Commander's interface. Under the Malu. 100-Year Mission.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "XI Ember",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function EmberLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
