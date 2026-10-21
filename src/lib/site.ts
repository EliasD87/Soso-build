export const site = {
  name: "Builder Race",
  title: "Builder Race · SoSoValue Buildathon Wave 3",
  description:
    "Live leaderboard for the SoSoValue Buildathon Wave 3 Builder Race — the Top 25 builders ranked by builder fee revenue and authorized users on SoDEX.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  links: {
    buildathon: "https://app.akindo.io/wave-hacks/JBEQXgN4Zi2jA3wA",
    sosovalue: "https://sosovalue.com/",
    sodex: "https://sodex.com/",
    valuechain: "https://valuechain.xyz/",
    builderCodesDocs:
      "https://sodex.com/documentation/for-developers/developers/trading/builder-codes-in-trading",
    wealthDocs: "https://sodex.com/documentation/for-developers/developers/wealth/builder",
    x: "https://x.com/SoSoValueCrypto",
    sodexX: "https://x.com/sodex_official",
    discord: "https://discord.gg/HQuGhhkhUW",
    telegram: "https://t.me/SoSoValueCommunity",
  },
} as const;
