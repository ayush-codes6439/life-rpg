import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
export const metadata: Metadata = {
  title: "Life RPG — Level Up Your Life",
  description: "Turn real-world tasks into an epic RPG progression system. Earn XP, build streaks, and unlock rewards.",
  keywords: ["Life RPG", "gamification", "productivity", "habit tracker"],
  openGraph: { title: "Life RPG", description: "Level up your life", type: "website" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
