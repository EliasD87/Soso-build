import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { CodeTabs, type Snippet } from "@/components/builder/code-tabs";
import { FeeCalculator } from "@/components/builder/fee-calculator";
import { HeroFolders } from "@/components/builder/hero-folders";
import { ApproveArt, AttachArt, EarnArt } from "@/components/builder/illustrations";
import { TactileCard } from "@/components/builder/tactile-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Builder Codes · SoSoValue Buildathon",
  description:
    "How SoDEX builder codes work: users approve a max fee, your app attaches a builder code to each order, and builder fees settle in real time.",
};

const SNIPPETS: Snippet[] = [
  {
    key: "order",
    label: "order.json",
    lang: "json",
    code: `{
  "builder": {
    "id": 456,
    "fee": 50
  }
}`,
    caption: (
      <>
        Add <code className="text-soft">builder</code> as the last field of each order (or batch), <code className="text-soft">id</code> before{" "}
        <code className="text-soft">fee</code>, before you hash and sign. <code className="text-soft">fee: 50</code> requests 5 bp.
      </>
    ),
  },
  {
    key: "approve",
    label: "approve.eip712",
    lang: "text",
    code: `ApproveBuilderFeeAction(
  uint64 chainID,     // 286623 mainnet · 138565 testnet
  uint64 nonce,
  uint64 accountID,   // user's primaryAccountID
  uint64 builderID,   // your builder account ID
  uint64 maxFeeRate   // 0 – 2000, 0 revokes
)`,
    caption: (
      <>
        Signed by the user&apos;s <strong className="font-medium text-soft">master wallet</strong>, not an API key. Or combine it with key registration via{" "}
        <code className="text-soft">AddAPIKeyWithBuilder</code>.
      </>
    ),
  },
  {
    key: "verify",
    label: "verify.http",
    lang: "http",
    code: `GET https://mainnet-gw.sodex.dev/api/v1/user/{userAddress}/builders

// → data.spot[] and data.perps[]
//   { "userID": 1001, "builderID": 456, "feeRate": 100 }`,
    caption: <>Approval lands per engine — check both arrays before routing orders, and re-query after a timeout instead of retrying blind.</>,
  },
  {
    key: "wealth",
    label: "wealth.sol",
    lang: "sol",
    code: `// bits 0–159 builder · 160–175 feeRate · 176–191 maxFeeRate
bytes32(uint256(uint160(builder)) | (feeRate << 160) | (maxFeeRate << 176))

encodeBuilderFee(builder, 500n);         // charge 0.5%, leave the cap unchanged
encodeBuilderFee(builder, 500n, 2_000n); // set the cap to 2% and charge 0.5%`,
    caption: (
      <>
        Pass it to <code className="text-soft">requestRedeem</code> or a TigrisRFQ <code className="text-soft">sell</code>. Index the lock event on the receipt — the stored rate
        can&apos;t be read back later.
      </>
    ),
  },
];

const CHECKLIST = [
  { title: "Fund your builder account", body: "Hold 100 vUSDC in Spot and Perps. Your account ID is your builder ID." },
  { title: "Get the user's account", body: "Use data.primaryAccountID from Query Subaccounts." },
  { title: "Ask for approval once", body: "The user signs ApproveBuilderFeeAction with their master wallet." },
  { title: "Verify both engines", body: "Check data.spot and data.perps via GET /user/{address}/builders." },
  { title: "Tag every order", body: "Add builder { id, fee } to each signed order." },
];

export default function BuilderCodesPage() {
  return (
    <div id="top">
      <SiteHeader active="builder-codes" />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-10 sm:pt-40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h1 className="animate-rise text-center font-display text-[clamp(3rem,10vw,6.75rem)] leading-[0.92] font-semibold tracking-[-0.045em] [animation-delay:80ms]">
              Builder <span className="text-brand-gradient">Codes</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl animate-rise text-center text-base text-balance text-muted sm:text-lg [animation-delay:140ms]">
              Earn a fee on every fill your app routes on SoDEX.
            </p>
            <div className="mt-8 flex animate-rise flex-wrap justify-center gap-2.5 [animation-delay:200ms]">
              <a
                href="#how"
                className="bg-brand-gradient inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-ink transition"
              >
                How it works
              </a>
              <Link
                href="/"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-fg/[0.03] px-5 text-sm text-soft transition hover:bg-fg/[0.07] hover:text-fg"
              >
                See the leaderboard
              </Link>
            </div>
            <div className="mt-14 animate-rise [animation-delay:280ms]">
              <HeroFolders />
            </div>
          </div>
        </section>

        <div className="space-y-24 pb-24 sm:space-y-32">
          {/* How it works */}
          <section id="how" aria-labelledby="how-title" className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
            <SectionHead title="How it works" id="how-title" />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <TactileCard index="001" title="Approve" art={<ApproveArt />}>
                Users sign a max builder fee once.
              </TactileCard>
              <TactileCard index="002" title="Attach" art={<AttachArt />}>
                Add <code className="font-mono text-[0.8125rem] text-[color:var(--tc-fg)]">builder {"{ id, fee }"}</code> to every order.
              </TactileCard>
              <TactileCard index="003" title="Earn" art={<EarnArt />}>
                Fees land in your account in real time.
              </TactileCard>
            </div>
          </section>

          {/* Calculator */}
          <section aria-labelledby="calc-title" className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead title="Fee calculator" id="calc-title" />
            <div className="mt-10">
              <FeeCalculator />
            </div>
          </section>

          {/* Code */}
          <section aria-labelledby="code-title" className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead title="Integrate in five steps" id="code-title" />
            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
              <ol className="relative space-y-1">
                {CHECKLIST.map((step, i) => (
                  <li key={step.title} className="group relative flex gap-4 rounded-2xl p-3 transition hover:bg-fg/[0.025]">
                    <span className="num grid size-9 shrink-0 place-items-center rounded-full border border-line-strong bg-surface text-sm text-soft transition group-hover:border-brand/50 group-hover:text-brand-soft">
                      {i + 1}
                    </span>
                    <div className="pt-1.5">
                      <p className="font-medium text-fg">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
                <CodeTabs snippets={SNIPPETS} />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="panel inverse px-6 py-14 text-center sm:px-12 sm:py-20">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
                Ship your code, then climb the board
              </h2>
              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                <Link
                  href="/"
                  className="bg-brand-gradient inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-ink transition"
                >
                  View the leaderboard
                </Link>
                <DocLink href={site.links.builderCodesDocs}>Perps &amp; Spot docs</DocLink>
                <DocLink href={site.links.wealthDocs}>Wealth docs</DocLink>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SectionHead({ title, id, center }: { title: string; id: string; center?: boolean }) {
  return (
    <h2 id={id} className={`font-display text-3xl font-semibold tracking-tight sm:text-4xl ${center ? "text-center" : ""}`}>
      {title}
    </h2>
  );
}


function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line-strong bg-fg/[0.03] px-5 text-sm text-soft transition hover:bg-fg/[0.07] hover:text-fg"
    >
      {children} <ArrowUpRight className="size-4" />
    </a>
  );
}
