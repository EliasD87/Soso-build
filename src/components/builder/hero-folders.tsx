import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { Folder } from "./folder";

function CodeSheet() {
  return (
    <div className="p-3 font-mono text-[0.5625rem] leading-[1.55] sm:text-[0.625rem]">
      <p className="opacity-50">{"// order.json"}</p>
      <p>{"{"}</p>
      <p className="pl-2">&quot;builder&quot;: {"{"}</p>
      <p className="pl-4">&quot;id&quot;: 456,</p>
      <p className="pl-4">&quot;fee&quot;: 50</p>
      <p className="pl-2">{"}"}</p>
      <p>{"}"}</p>
    </div>
  );
}

function BigSheet({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex h-full flex-col justify-between p-3">
      <span className="font-mono text-[0.5rem] tracking-widest uppercase opacity-50">{label}</span>
      <span className="font-display text-3xl leading-none font-semibold tracking-tight sm:text-4xl">{value}</span>
    </div>
  );
}

function BitsSheet() {
  return (
    <div className="flex h-full flex-col justify-between p-3">
      <span className="font-mono text-[0.5rem] tracking-widest uppercase opacity-50">builderFeeData</span>
      <div>
        <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">bytes32</p>
        {/* 160 / 16 / 16 bit layout */}
        <div className="mt-2 flex h-2 gap-0.5 overflow-hidden rounded-full">
          <span className="flex-[160] bg-current" />
          <span className="flex-[16] bg-current opacity-60" />
          <span className="flex-[16] bg-current opacity-35" />
          <span className="flex-[64] bg-current opacity-10" />
        </div>
      </div>
    </div>
  );
}

function RankSheet() {
  return (
    <div className="space-y-1.5 p-3">
      <span className="font-mono text-[0.5rem] tracking-widest uppercase opacity-50">Standings</span>
      {[0.92, 0.7, 0.55, 0.4].map((w, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="font-mono text-[0.5rem] opacity-40">0{i + 1}</span>
          <span className="h-1.5 rounded-full bg-current opacity-20" style={{ width: `${w * 100}%` }} />
        </div>
      ))}
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-current/30 px-2 py-0.5 font-mono text-[0.5625rem] tracking-wide">{children}</span>;
}

export function HeroFolders() {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-auto sm:grid sm:max-w-4xl sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 [&>*]:w-[72%] [&>*]:shrink-0 [&>*]:snap-center sm:[&>*]:w-auto">
      <Folder
        href={site.links.builderCodesDocs}
        external
        tone="solid"
        title="Perps & Spot"
        meta="Account ID · paid in real time"
        sheets={[<CodeSheet key="a" />, <BigSheet key="b" value="0.2%" label="perps cap" />]}
        front={
          <div className="flex h-full items-end justify-between p-3.5">
            <Pill>EIP-712</Pill>
            <Pill>spot 2%</Pill>
          </div>
        }
      />
      <Folder
        href={site.links.wealthDocs}
        external
        tone="mid"
        title="Wealth"
        meta="Address · charged at claim"
        sheets={[<BitsSheet key="a" />, <BigSheet key="b" value="2%" label="protocol max" />]}
        front={
          <div className="relative flex h-full items-end justify-end p-3.5">
            {/* zipper detail, after the reference "Zipped" folder */}
            <span aria-hidden="true" className="absolute top-3 bottom-3 left-5 w-1.5 rounded-full bg-[repeating-linear-gradient(to_bottom,currentColor_0_2px,transparent_2px_5px)] opacity-30" />
            <span aria-hidden="true" className="absolute top-4 left-3.5 h-6 w-4 rounded-md border border-current/40 bg-current/15" />
            <Pill>ValueChain · 286623</Pill>
          </div>
        }
      />
      <Folder
        href="/"
        tone="outline"
        title="Builder Race"
        meta="Live leaderboard · Wave 3"
        sheets={[<RankSheet key="a" />, <BigSheet key="b" value="#1" label="who's leading?" />]}
        front={
          <div className="flex h-full items-end justify-between p-3.5">
            <Pill>25 builders</Pill>
            <Pill>Live · 30s</Pill>
          </div>
        }
      />
    </div>
  );
}
