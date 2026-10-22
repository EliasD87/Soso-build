/**
 * Builder Race project registry.
 *
 * Source: Buildathon Wave 3 Top 25 export from Akindo. Some teams may not take
 * part in the Builder Race — set `participating: false` to hide a project from
 * the leaderboard without deleting its record.
 *
 * `builderId` is the project's SoDEX builder ID — the numeric trading account
 * ID that users approve a builder fee for (see SoDEX "Builder Codes in
 * Trading"). Fill it in once teams share their codes; in live mode, projects
 * without one are listed as "awaiting builder code".
 */

export type Category =
  | "Trading Agents"
  | "SoDEX Execution"
  | "Risk & Alerts"
  | "Market Data"
  | "ETFs & Indices"
  | "Wallet Tracking"
  | "Social & Narratives"
  | "Infrastructure"
  | "Education";

/** How to reach a team member. Handles are stored without "@" or URL prefix. */
export type Contact = {
  x?: string;
  telegram?: string;
  discord?: string;
};

export type Builder = {
  /** Display name: developer or team name. */
  name: string;
  /** GitHub username or organisation. */
  github: string;
  /** X (Twitter) handle without the @. */
  x?: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  /** Placement in the Wave 3 Top 25 on Akindo. */
  waveRank: number;
  categories: Category[];
  builder: Builder;
  /** SoDEX builder account ID, e.g. "123456". */
  builderId?: string;
  participating: boolean;
  /** Team contacts shared with the organisers (one entry per member). */
  team?: Contact[];
  links: {
    app: string;
    akindo: string;
    github?: string;
    video?: string;
  };
};

const ALL: Category[] = [
  "Trading Agents",
  "SoDEX Execution",
  "Risk & Alerts",
  "Market Data",
  "ETFs & Indices",
  "Wallet Tracking",
  "Social & Narratives",
  "Infrastructure",
];

const without = (...drop: Category[]) => ALL.filter((c) => !drop.includes(c));

export const projects: Project[] = [
  {
    slug: "bellwether",
    name: "Bellwether",
    tagline: "Reads SoSoValue's market regime, builds an adaptive index, executes it on SoDEX.",
    waveRank: 1,
    categories: ALL,
    builder: { name: "RaYYeR220", github: "RaYYeR220", x: "BazydloMis57623" },
    participating: true,
    team: [
      { x: "BazydloMis57623", telegram: "L0CEO", discord: "rayyer_220" },
    ],
    links: {
      app: "https://bellwether-eight.vercel.app/",
      akindo: "https://app.akindo.io/communities/7m4QqGD0wcdQ8198z/products/OV2zvJXwDFP4Voav",
      github: "https://github.com/RaYYeR220/bellwether",
      video: "https://www.youtube.com/embed/mibc3RzKi-U",
    },
  },
  {
    slug: "thesisx",
    name: "ThesisX",
    tagline: "Launch your AI hedge fund in minutes. Describe your strategy, get live!",
    waveRank: 2,
    categories: ALL,
    builder: { name: "DiablooDevs", github: "AhmedAmer72", x: "DiablooDevs" },
    participating: true,
    team: [
      { x: "DiablooDevs", telegram: "DiablooDevs", discord: "DiablooDevs" },
    ],
    links: {
      app: "https://thesis-x.vercel.app/",
      akindo: "https://app.akindo.io/communities/4e9BMWpMoHkjL2oo/products/jaMjlz0aoIQ8PW3n",
      github: "https://github.com/AhmedAmer72/ThesisX",
    },
  },
  {
    slug: "sonar",
    name: "sonar",
    tagline: "AI agent using SoSoValue data to write theses, rebalance SSI indices, and hedge on SoDEX.",
    waveRank: 3,
    categories: ALL,
    builder: { name: "OoJae", github: "OoJae", x: "_OoJae" },
    participating: true,
    team: [
      { x: "_OoJae", telegram: "Oo_Jae", discord: "oojae_" },
    ],
    links: {
      app: "https://sonar.my.id/",
      akindo: "https://app.akindo.io/communities/OVpl31QDoHmwQ9aD/products/nPM2EejL3C0oBnrDr",
      github: "https://github.com/OoJae/sonar",
      video: "https://youtu.be/5Y64DQq70yI",
    },
  },
  {
    slug: "pod",
    name: "POD",
    tagline: "Institutional ETF-flow scores for crypto — on a web dashboard and in Telegram.",
    waveRank: 4,
    categories: ALL,
    builder: { name: "Prateek Tripathi", github: "Pratiikpy", x: "Prateekhh" },
    participating: true,
    team: [
      { x: "Prateekhh", telegram: "Naki_sokaa0", discord: "zensotaka" },
    ],
    links: {
      app: "https://pod-app-phi.vercel.app/",
      akindo: "https://app.akindo.io/communities/xKV2X6nR7c7KXNGL/products/WjMek47pjfknwlKd",
      github: "https://github.com/Pratiikpy/pod",
      video: "https://youtu.be/SpAP4_2u8r0",
    },
  },
  {
    slug: "helix",
    name: "Helix",
    tagline: "Event-driven alpha you can audit. Every signal traces back to the news.",
    waveRank: 5,
    categories: without("Risk & Alerts", "Social & Narratives"),
    builder: { name: "Daily-Up", github: "Daily-Up", x: "JoeAshVS" },
    participating: true,
    team: [
      { x: "JoeAshVS", telegram: "daily1up", discord: "blackvs" },
    ],
    links: {
      app: "https://helix-alpha-kappa.vercel.app/",
      akindo: "https://app.akindo.io/communities/o6Xpno8wZIkLD8Dd/products/JB1g9O7AxCQvWvng",
      github: "https://github.com/Daily-Up/helix-alpha",
      video: "https://www.youtube.com/watch?v=Pyy0KAbHTv4",
    },
  },
  {
    slug: "mosaic",
    name: "Mosaic",
    tagline: "For crypto-native retail traders seeking structured exposure without tools, time, or quant skills.",
    waveRank: 6,
    categories: without("Social & Narratives"),
    builder: { name: "ARGUS (j12s team)", github: "j12s-team", x: "cjanneh2000" },
    participating: true,
    team: [
      { x: "cjanneh2000", telegram: "janneh2000", discord: "janneh2000" },
    ],
    links: {
      app: "https://mosaic-ivory.vercel.app/",
      akindo: "https://app.akindo.io/communities/274P0EngoflZW7R1/products/DreEvVOnptGRvdJz",
      github: "https://github.com/j12s-team/mosaic",
      video: "https://youtu.be/_bNRNkeI7Qk",
    },
  },
  {
    slug: "bloom-ai",
    name: "Bloom AI",
    tagline: "Agentic financial media + on-chain execution — real ETF flows → newsletter → copy-trade on SoDEX.",
    waveRank: 7,
    categories: [...ALL, "Education"],
    builder: { name: "NeoCrafts", github: "NeoCrafts-cpu", x: "neocrafts" },
    participating: true,
    team: [
      { x: "neocrafts", telegram: "NeoCrafts77", discord: "neocrafts" },
    ],
    links: {
      app: "https://bloom-ai-web-wheat.vercel.app/",
      akindo: "https://app.akindo.io/communities/kz6zqLNqJSd8PQB4D/products/X4MamkXXnTGwg20X",
      github: "https://github.com/NeoCrafts-cpu/Bloom-AI",
    },
  },
  {
    slug: "upside",
    name: "Upside",
    tagline: "AI risk desk for on-chain traders. Detect risk early, explain why, protect positions via SoDEX.",
    waveRank: 8,
    categories: ALL,
    builder: { name: "Emin Karagöz", github: "karagozemin", x: "kaptan_web3" },
    participating: true,
    team: [
      { x: "kaptan_web3", telegram: "kaptan_web3", discord: "kaptan_web3" },
    ],
    links: {
      app: "https://upside-xi.vercel.app/",
      akindo: "https://app.akindo.io/communities/DreDaBDBACZK1KnpK/products/JB1X4J9e7S79VKJg",
      github: "https://github.com/karagozemin/Upside",
      video: "https://www.youtube.com/embed/Qu_CDlwvOcc",
    },
  },
  {
    slug: "tradefirewall",
    name: "TradeFirewall",
    tagline: "Avoid bad crypto trades before execution with real-time risk scoring.",
    waveRank: 9,
    categories: without("Social & Narratives"),
    builder: { name: "Emmy123222", github: "Emmy123222", x: "EmmanuelOg75160" },
    participating: true,
    team: [
      { x: "EmmanuelOg75160", telegram: "Ogheneovo123", discord: "manuel_12x" },
      { x: "johnsdanlami", telegram: "johnsdanlami", discord: "johnsdanlami" },
    ],
    links: {
      app: "https://trade-firewall-p7zn.vercel.app/",
      akindo: "https://app.akindo.io/communities/LavZG8X3Rt49K68N/products/jaMJmo4XDuOleOZL",
      github: "https://github.com/Emmy123222/TradeFirewall",
    },
  },
  {
    slug: "sectorpulse",
    name: "SectorPulse",
    tagline: "Watches SoSoValue's sector, index, and ETF-flow data for rotation before it's priced in.",
    waveRank: 10,
    categories: without("Wallet Tracking", "Social & Narratives"),
    builder: { name: "Euphoria-p", github: "Euphoria-p", x: "KingsleyCaesar1" },
    participating: true,
    team: [
      { x: "KingsleyCaesar1", telegram: "TZARblue", discord: "caesar581" },
    ],
    links: {
      app: "https://sector-pulse-inky.vercel.app/",
      akindo: "https://app.akindo.io/communities/K8E6MleeRUQOV2gKd/products/GL9d1A8AOHonL94gD",
      github: "https://github.com/Euphoria-p/SectorPulse",
      video: "https://youtu.be/fyNZHLeHcYI",
    },
  },
  {
    slug: "soso-analyst",
    name: "SoSo Analyst",
    tagline: "Autonomous on-chain research agency.",
    waveRank: 11,
    categories: [...without("Risk & Alerts", "Social & Narratives"), "Education"],
    builder: { name: "fourWayz", github: "fourWayz", x: "0xSpectreSec" },
    participating: true,
    team: [
      { x: "0xSpectreSec", discord: "fourways_" },
    ],
    links: {
      app: "https://soso-analyst.vercel.app/",
      akindo: "https://app.akindo.io/communities/Z4Rpzpe4PC7262K6Q/products/DreGPgkV3iEn9RQl",
      github: "https://github.com/fourWayz/soso-analyst",
      video: "https://youtu.be/Dym42pRUtjY",
    },
  },
  {
    slug: "sonarr",
    name: "SoNarr",
    tagline: "Turn market noise into your one-person finance desk.",
    waveRank: 12,
    categories: without("Infrastructure"),
    builder: { name: "Manan Kapoor", github: "M4N4N22", x: "mananbuilds" },
    participating: true,
    links: {
      app: "https://so-narr.vercel.app/",
      akindo: "https://app.akindo.io/communities/wKWWqQl00t8D8BroL/products/1P4wN1ezntEnP3wr",
      github: "https://github.com/M4N4N22/SoNarr",
      video: "https://youtu.be/F7DUKecgXWQ",
    },
  },
  {
    slug: "indexpilot",
    name: "IndexPilot",
    tagline: "Your personal on-chain index fund. Set weights, detect drift, rebalance with precision.",
    waveRank: 13,
    categories: [...without("Risk & Alerts", "Social & Narratives"), "Education"],
    builder: { name: "Ludarep", github: "rudazy", x: "Ludarep" },
    participating: true,
    links: {
      app: "https://indexpilots.vercel.app/",
      akindo: "https://app.akindo.io/communities/GL9p0LBj3cOrv7zL/products/vjR10pPMWTZqM2vZB",
      github: "https://github.com/rudazy/IndexPilot",
      video: "https://www.youtube.com/embed/hA4JzEeGRb4",
    },
  },
  {
    slug: "sosomind",
    name: "sosomind",
    tagline: "Evidence in. Risk gated. Mainnet executed.",
    waveRank: 14,
    categories: without("Social & Narratives"),
    builder: { name: "DEVMO", github: "mohamedwael201193" },
    participating: true,
    links: {
      app: "https://sosomind.vercel.app/",
      akindo: "https://app.akindo.io/communities/Z4ZAB4pRWuMaNRzo/products/nPMd7o12eiVA49L2",
      github: "https://github.com/mohamedwael201193/sosomind",
      video: "https://youtu.be/UpSWFtVP3SY",
    },
  },
  {
    slug: "mara",
    name: "MARA 2.0",
    tagline: "Your autonomous hedge fund, powered by SoSoValue.",
    waveRank: 15,
    categories: ALL,
    builder: { name: "harsh11067", github: "harsh11067" },
    participating: true,
    links: {
      app: "https://mara-neon.vercel.app/edge",
      akindo: "https://app.akindo.io/communities/lrM6ZNrwntjx0Po1/products/X4M92mwLnSzXnk3g",
      github: "https://github.com/harsh11067/mara",
      video: "https://www.youtube.com/watch?v=QMgnuoda54Y",
    },
  },
  {
    slug: "basisdesk",
    name: "BasisDesk",
    tagline: "Earn real yield on crypto without betting on the price.",
    waveRank: 16,
    categories: without("Social & Narratives"),
    builder: { name: "Ritik Pandey", github: "Ritik200238", x: "ritik_pandey999" },
    participating: true,
    team: [
      { x: "ritik_pandey999", telegram: "ritik_p2002", discord: "ritikp_2002" },
    ],
    links: {
      app: "https://basisdesk.vercel.app/",
      akindo: "https://app.akindo.io/communities/Vw2gPZdQaTDOKZKg/products/lrM6DVdMzTDjZZom",
      github: "https://github.com/Ritik200238/BasisDesk",
    },
  },
  {
    slug: "strategy-dex",
    name: "Strategy Dex",
    tagline: "Explore 220+ trading strategies, scan live signals, and demo-trade before going live on SoDEX.",
    waveRank: 17,
    categories: ["Trading Agents", "SoDEX Execution", "Risk & Alerts", "Market Data", "ETFs & Indices"],
    builder: { name: "muammeryldrm42", github: "muammeryldrm42", x: "muammeryldrm42" },
    participating: true,
    links: {
      app: "https://straw-pearl.vercel.app/",
      akindo: "https://app.akindo.io/communities/QlD2zJvqqcoBOx83/products/ENOqRReM7fzRRkZpd",
      github: "https://github.com/muammeryldrm42/straw",
      video: "https://www.youtube.com/embed/oeRU67-bZuE",
    },
  },
  {
    slug: "sovibe",
    name: "SoVibe",
    tagline: "AI-augmented perpetual trading terminal. Trade the signal, not the noise.",
    waveRank: 18,
    categories: without("ETFs & Indices", "Social & Narratives"),
    builder: { name: "Kiter", github: "PhiBao", x: "0xKiter" },
    participating: true,
    team: [
      { x: "0xKiter", telegram: "kiter9", discord: "kiter99" },
    ],
    links: {
      app: "https://so-vibe.vercel.app/",
      akindo: "https://app.akindo.io/communities/1PrjMj61aiJnq8mJ/products/4e4Pg0MZzf2XzLOjX",
      github: "https://github.com/PhiBao/so-vibe",
      video: "https://youtu.be/dNwYF9fS6FE",
    },
  },
  {
    slug: "etfsignal-ai",
    name: "ETFSignal AI",
    tagline: "Live ETF flows → Claude AI signal → SoDEX trade. Connect wallet to start.",
    waveRank: 19,
    categories: without("Social & Narratives"),
    builder: { name: "Girum", github: "girume1", x: "theinvisivle" },
    participating: true,
    team: [
      { x: "theinvisivle", telegram: "Gir1st", discord: "mrgt_07" },
    ],
    links: {
      app: "https://etfsignal.vercel.app/",
      akindo: "https://app.akindo.io/communities/jan7NaMR3hgV7EzP/products/0nZk8nGgjCQg2Q1K",
      github: "https://github.com/girume1/etfsignal",
      video: "https://youtu.be/bl_OMr886is",
    },
  },
  {
    slug: "drift",
    name: "DRIFT",
    tagline: "Dynamic Risk-Informed Futures Trading.",
    waveRank: 20,
    categories: ["Trading Agents", "Risk & Alerts", "Market Data", "ETFs & Indices", "Wallet Tracking"],
    builder: { name: "Giang Le", github: "lthuangiang", x: "junxcrypto" },
    participating: true,
    team: [
      { x: "junxcrypto", discord: "junxcrypto" },
    ],
    links: {
      app: "https://drift.junxcrypto.xyz/",
      akindo: "https://app.akindo.io/communities/rgV1Wlz4lT89vpKo/products/q3Gg44ZoLIwWKaO2",
      github: "https://github.com/lthuangiang/apex",
      video: "https://www.youtube.com/embed/V3YBdqZAiBg",
    },
  },
  {
    slug: "atlas",
    name: "Atlas",
    tagline: "Thematic on-chain index protocol.",
    waveRank: 21,
    categories: without("Risk & Alerts", "Social & Narratives"),
    builder: { name: "bodmandao", github: "bodmandao" },
    participating: true,
    links: {
      app: "https://atlas-six-sage.vercel.app/",
      akindo: "https://app.akindo.io/communities/1PXJKwRrrCDmGLwq/products/xK72gqBjoImr4Z1Z4",
      github: "https://github.com/bodmandao/atlas",
      video: "https://youtu.be/c1f0Kj07kvs",
    },
  },
  {
    slug: "policyguard",
    name: "PolicyGuard",
    tagline: "Pre-trade policy gateway for autonomous SoDEX agents.",
    waveRank: 22,
    categories: without("Social & Narratives"),
    builder: { name: "ShalyX", github: "ShalyX", x: "shalyx_04" },
    participating: true,
    team: [
      { x: "shalyx_04", telegram: "shaly00", discord: "shalyx" },
    ],
    links: {
      app: "https://policyguard-nine.vercel.app/",
      akindo: "https://app.akindo.io/communities/o6Xgma29Vun4VWEE/products/d8MDdxlmPSPBo764",
      github: "https://github.com/ShalyX/policyguard",
      video: "https://www.youtube.com/embed/a69zTGdb1nU",
    },
  },
  {
    slug: "consilium",
    name: "Consilium",
    tagline: "Three AI specialists turn SoSoValue data into risk-managed trades on SoDEX.",
    waveRank: 23,
    categories: ALL,
    builder: { name: "Maryjane Okafor", github: "Ryjen1" },
    participating: true,
    links: {
      app: "https://consilium-sodex.vercel.app/",
      akindo: "https://app.akindo.io/communities/BeGoEl0XOTRmK6qD/products/63oeGgAo8iLK6WGwn",
      github: "https://github.com/Ryjen1/Consilium",
      video: "https://youtu.be/kH2HnUX70nA",
    },
  },
  {
    slug: "cinder",
    name: "Cinder",
    tagline: "Market news that backs its own trades.",
    waveRank: 24,
    categories: ["Trading Agents", "Market Data"],
    builder: { name: "Abdulsalam Hassan", github: "Turnless", x: "turnless_HQ" },
    participating: true,
    team: [
      { x: "turnless_HQ", telegram: "turnlessHQ", discord: "turnless" },
    ],
    links: {
      app: "https://cinderhq.vercel.app/",
      akindo: "https://app.akindo.io/communities/JB1PM8ralCKzrzqV/products/ENOnWN98KtzgE64oL",
      github: "https://github.com/Turnless/Cinder",
      video: "https://www.youtube.com/embed/SG-L5XBZBe4",
    },
  },
  {
    slug: "hype-node",
    name: "Hype Node",
    tagline: "Autonomous crypto index platform: an AI agent researches market signals.",
    waveRank: 25,
    categories: without("Risk & Alerts"),
    builder: { name: "mdlog", github: "mdlog" },
    participating: true,
    links: {
      app: "https://hypenode.mdloglabs.org/",
      akindo: "https://app.akindo.io/communities/63dv68BletWx7Od7/products/zKgvRWnM1IOAGKoNq",
      github: "https://github.com/mdlog/hype-node",
      video: "https://youtu.be/JrTSXzoDrOE",
    },
  },
];
