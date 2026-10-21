import { HowItWorks } from "@/components/how-it-works";
import { LeaderboardApp } from "@/components/race/leaderboard-app";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLeaderboard, REFRESH_SECONDS } from "@/lib/leaderboard";

export default async function Home() {
  const leaderboard = await getLeaderboard();

  return (
    <div id="top">
      <SiteHeader active="leaderboard" />
      <main>
        <LeaderboardApp initial={leaderboard} refreshSeconds={REFRESH_SECONDS} />
        <HowItWorks isPreview={leaderboard.source === "preview"} />
      </main>
      <SiteFooter />
    </div>
  );
}
