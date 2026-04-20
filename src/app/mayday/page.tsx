import { redirect } from "next/navigation";

// /mayday → /founding48
// Steward calls the landing page "mayday" in external channels; this route
// catches typed-in URLs and social referral traffic that expects /mayday.
// Added 2026-04-19 after social burst revealed the 404 gap.

export const metadata = {
  title: "MAYDAY · Mākoa Brotherhood",
  description: "West Oahu. May 1–31, 2026. Two full moons. Four weekends. One brotherhood.",
};

export default function MaydayRoute() {
  redirect("/founding48");
}
