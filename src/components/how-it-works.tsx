import Link from "next/link";
import { ApproveArt, AttachArt, EarnArt } from "@/components/builder/illustrations";
import { TactileCard } from "@/components/builder/tactile-card";

export function HowItWorks({ isPreview }: { isPreview: boolean }) {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 id="how-title" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            How the race works
          </h2>
        </div>
        <Link
          href="/builder-codes"
          className="group inline-flex items-center gap-1.5 self-start text-sm text-muted transition hover:text-fg sm:self-auto"
        >
          How builder codes work
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <TactileCard index="001" title="Ship a builder code" art={<AttachArt />}>
          Apps tag each order with their builder code.
        </TactileCard>
        <TactileCard index="002" title="Users authorize" art={<ApproveArt />}>
          One wallet signature approves a max fee.
        </TactileCard>
        <TactileCard index="003" title="Fees stream in" art={<EarnArt />}>
          {isPreview ? "Every fill pays the builder in vUSDC." : "Every fill pays the builder in vUSDC. Refreshed every 30s."}
        </TactileCard>
      </div>
    </section>
  );
}
