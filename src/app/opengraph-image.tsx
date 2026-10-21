import { ImageResponse } from "next/og";
import { getLeaderboard } from "@/lib/leaderboard";
import { formatUsd } from "@/lib/format";
import { rankEntries } from "@/lib/ranking";

export const alt = "Builder Race — SoSoValue Buildathon Wave 3 live leaderboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MEDALS = ["#ffcf5c", "#d9dee7", "#e8a272"];

export default async function Image() {
  const data = await getLeaderboard();
  const isLive = data.source === "live" && !data.error;
  const top = rankEntries(data.entries, "revenue").filter((e) => e.rank).slice(0, 3);
  // Standings only once real numbers exist — sample or empty data must not circulate as rankings.
  const showStandings = isLive && top.length > 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#050505",
          backgroundImage:
            "radial-gradient(circle at 50% -10%, rgba(255,255,255,0.35), transparent 55%), linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 64px 64px, 64px 64px",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#a3a3a3", textTransform: "uppercase" }}>
            SoSoValue Buildathon · Wave 3
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              fontSize: 22,
              color: "#d6d6d6",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 999, background: isLive ? "#1bd289" : "#c9c9c9" }} />
            {isLive ? "Live leaderboard" : "Launching soon"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", fontSize: 150, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>
          Builder
          <span
            style={{
              marginLeft: 32,
              backgroundImage: "linear-gradient(95deg, #ffffff, #c9c9c9 60%, #8f8f8f)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Race
          </span>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {(showStandings
            ? top.map((e, i) => ({
                key: e.project.slug,
                accent: MEDALS[i],
                kicker: `#${i + 1}`,
                title: e.project.name,
                detail: e.metrics ? `${formatUsd(e.metrics.revenue)} builder fees` : e.project.builder.name,
              }))
            : [
                { key: "a", accent: "#c9c9c9", kicker: "FIELD", title: `${data.totals.projects} builders`, detail: "The Wave 3 Top 25" },
                { key: "b", accent: "#c9c9c9", kicker: "RANKED BY", title: "Builder fees", detail: "and authorized users" },
                { key: "c", accent: "#c9c9c9", kicker: "DATA", title: "SoDEX", detail: "Builder Codes API" },
              ]
          ).map((card) => (
            <div
              key={card.key}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "22px 26px",
                borderRadius: 24,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${card.accent}55`,
              }}
            >
              <div style={{ display: "flex", fontSize: 20, color: card.accent, letterSpacing: 2 }}>{card.kicker}</div>
              <div style={{ display: "flex", fontSize: 36, fontWeight: 700, marginTop: 6 }}>{card.title}</div>
              <div style={{ display: "flex", fontSize: 24, color: "#a3a3a3", marginTop: 4 }}>{card.detail}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
