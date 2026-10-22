"use client";

import { ArrowUpRight, Check, Copy, Link2, Play, X } from "lucide-react";
import { motion, useDragControls } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import { DiscordIcon, TelegramIcon, XIcon } from "@/components/icons";
import { UsdcIcon } from "@/components/icons-usdc";
import { BuilderAvatar } from "@/components/marks";
import { formatPercent, ordinal } from "@/lib/format";
import type { Leaderboard, RankedEntry, SortKey } from "@/lib/ranking";
import { hostname } from "@/lib/utils";
import { youtubeEmbedUrl, youtubeId, youtubeThumb } from "@/lib/youtube";
import { videoUrl } from "./link-buttons";

export function ProjectSheet({
  entry,
  sort,
  totals,
  isPreview,
  unavailable,
  onClose,
}: {
  entry: RankedEntry | null;
  sort: SortKey;
  totals: Leaderboard["totals"];
  isPreview: boolean;
  unavailable: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (entry && !dialog.open) dialog.showModal();
    if (!entry && dialog.open) dialog.close();
  }, [entry]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="sheet-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {entry && (
        <SheetBody
          key={entry.project.slug}
          entry={entry}
          sort={sort}
          totals={totals}
          isPreview={isPreview}
          unavailable={unavailable}
          onClose={onClose}
        />
      )}
    </dialog>
  );
}

function SheetBody({
  entry,
  sort,
  totals,
  isPreview,
  unavailable,
  onClose,
}: {
  entry: RankedEntry;
  sort: SortKey;
  totals: Leaderboard["totals"];
  isPreview: boolean;
  unavailable: boolean;
  onClose: () => void;
}) {
  const { project, metrics, rank } = entry;
  const videoId = youtubeId(project.links.video);
  const share = metrics && totals.revenue > 0 ? metrics.revenue / totals.revenue : 0;
  const dragControls = useDragControls();

  return (
    <motion.div
      // Phones: drag the handle down to dismiss. Desktop never starts a drag (no handle).
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.7 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 120 || info.velocity.y > 600) onClose();
      }}
      className="relative flex max-h-[inherit] flex-col overflow-hidden rounded-2xl border border-line bg-canvas max-sm:rounded-b-none max-sm:border-b-0"
    >
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="flex shrink-0 cursor-grab touch-none justify-center pt-3 pb-1 sm:hidden"
        aria-hidden="true"
      >
        <span className="h-1.5 w-10 rounded-full bg-fg/20" />
      </div>
      <button
        type="button"
        onClick={onClose}
        autoFocus
        aria-label="Close"
        className="absolute top-4 right-4 z-10 grid size-8 sm:top-5 sm:right-5 place-items-center rounded-full text-muted transition hover:bg-fg/[0.06] hover:text-fg"
      >
        <X className="size-4" />
      </button>

      <div className="no-scrollbar overflow-y-auto overscroll-contain px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pr-10">
          <h2 id="sheet-title" className="font-race text-2xl font-semibold tracking-tight sm:text-3xl">
            {project.name}
          </h2>
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
            {rank ? `${ordinal(rank)} by ${sort === "revenue" ? "builder fees" : "users"}` : "Unranked"}
          </span>
        </div>
        <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-muted">{project.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={project.links.app}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-gradient inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink"
          >
            Open app <ArrowUpRight className="size-4" />
          </a>
          <ShareButtons name={project.name} slug={project.slug} rank={isPreview ? null : rank} sort={sort} />
        </div>

        {/* Stats: one row, hairline separated */}
        {metrics ? (
          <dl className="mt-8 grid grid-cols-2 border-y border-line sm:grid-cols-4">
            <Stat label="Builder fees">
              <span className="inline-flex items-center gap-1.5">
                <UsdcIcon className="size-4" />
                <AnimatedNumber value={metrics.revenue} format="fee" />
              </span>
            </Stat>
            <Stat label="Authorized users">
              <AnimatedNumber value={metrics.users} format="int" />
            </Stat>
            <Stat label="Fee share">{formatPercent(share)}</Stat>
            <Stat label="Volume routed">
              {metrics.volume ? <AnimatedNumber value={metrics.volume} format="usdCompact" /> : "—"}
            </Stat>
          </dl>
        ) : (
          <p className="mt-8 border-y border-line py-5 text-sm text-muted">
            {unavailable
              ? "Live data is temporarily unavailable."
              : project.builderId
                ? "No builder fee activity yet."
                : "No live data yet — no SoDEX builder code registered."}
          </p>
        )}

        {/* Details */}
        <dl className="divide-y divide-line text-sm">
          <Row label="Builder">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-2 text-fg">
                <BuilderAvatar github={project.builder.github} name={project.builder.name} size={20} />
                {project.builder.name}
              </span>
              <TextLink href={`https://github.com/${project.builder.github}`}>GitHub</TextLink>
            </span>
          </Row>
          <Row label="Contact">
            {project.team?.length ? (
              <ul className="space-y-2.5">
                {project.team.map((member, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    {project.team!.length > 1 && <span className="w-full text-xs text-muted sm:w-auto">Member {i + 1}</span>}
                    {member.x && (
                      <ContactLink href={`https://x.com/${member.x}`} icon={<XIcon className="size-3.5" />}>
                        @{member.x}
                      </ContactLink>
                    )}
                    {member.telegram && (
                      <ContactLink href={`https://t.me/${member.telegram}`} icon={<TelegramIcon className="size-4" />}>
                        @{member.telegram}
                      </ContactLink>
                    )}
                    {member.discord && <DiscordHandle handle={member.discord} />}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted">Not shared yet</span>
            )}
          </Row>
          <Row label="Links">
            <span className="flex flex-wrap gap-x-4 gap-y-1">
              <TextLink href={project.links.app}>{hostname(project.links.app)}</TextLink>
              {project.links.github && <TextLink href={project.links.github}>Source code</TextLink>}
              <TextLink href={project.links.akindo}>Akindo</TextLink>
              {project.links.video && <TextLink href={videoUrl(project)!}>Demo video</TextLink>}
            </span>
          </Row>
          <Row label="Categories">
            <span className="text-muted">{project.categories.join(" · ")}</span>
          </Row>
        </dl>

        {videoId && (
          <div className="mt-4">
            <LiteYouTube id={videoId} title={`${project.name} demo`} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-line py-4 pr-4 even:border-l even:pl-4 [&:nth-child(n+3)]:border-t sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0 sm:[&:nth-child(n+3)]:border-t-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="num mt-1 truncate text-xl font-semibold text-fg">{children}</dd>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

function ContactLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-fg underline decoration-line-strong underline-offset-4 transition hover:decoration-fg"
    >
      <span className="text-muted">{icon}</span>
      {children}
    </a>
  );
}

/** Discord usernames have no public profile URL, so offer a copy instead. */
function DiscordHandle({ handle }: { handle: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(handle);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard blocked */
        }
      }}
      aria-label={`Copy Discord username ${handle}`}
      className="inline-flex items-center gap-1.5 text-fg transition hover:text-soft"
    >
      <DiscordIcon className="size-4 text-muted" />
      {handle}
      {copied ? <Check className="size-3.5 text-up" /> : <Copy className="size-3.5 text-faint" />}
      <span role="status" className="sr-only">
        {copied ? "Discord username copied" : ""}
      </span>
    </button>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 text-fg underline decoration-line-strong underline-offset-4 transition hover:decoration-fg"
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="size-3.5 text-faint" />
    </a>
  );
}

function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  // Hand focus to the player once it replaces the poster button.
  useEffect(() => {
    if (playing) frameRef.current?.focus();
  }, [playing]);
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      {playing ? (
        <iframe
          ref={frameRef}
          src={youtubeEmbedUrl(id)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 rounded-xl focus-visible:-outline-offset-[3px]"
          aria-label={`Play ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube thumbnail, loaded on demand */}
          <img src={youtubeThumb(id)} alt="" loading="lazy" className="size-full object-cover opacity-70 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90" />
          <span className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black">
            <Play className="ml-1 size-6 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}

function ShareButtons({ name, slug, rank, sort }: { name: string; slug: string; rank: number | null; sort: SortKey }) {
  const [copied, setCopied] = useState(false);

  // Shared links keep the ranking the rank was quoted in.
  const url = () => {
    const u = new URL(window.location.href);
    u.search = "";
    if (sort === "users") u.searchParams.set("sort", "users");
    u.searchParams.set("project", slug);
    return u.toString();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  const tweet = () => {
    const text = rank
      ? `${name} is #${rank} by ${sort === "revenue" ? "builder fee revenue" : "authorized users"} in the @SoSoValueCrypto Buildathon Wave 3 Builder Race 🏁`
      : `Check out ${name} in the @SoSoValueCrypto Buildathon Wave 3 Builder Race 🏁`;
    const intent = new URL("https://x.com/intent/post");
    intent.searchParams.set("text", text);
    intent.searchParams.set("url", url());
    window.open(intent.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <button
        type="button"
        onClick={tweet}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-line px-3.5 text-sm text-soft transition hover:border-fg hover:text-fg max-sm:w-9 max-sm:px-0"
      >
        <XIcon className="size-3.5" />
        <span className="max-sm:sr-only">Share</span>
      </button>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-line px-3.5 text-sm text-soft transition hover:border-fg hover:text-fg max-sm:w-9 max-sm:px-0"
      >
        {copied ? <Check className="size-4 text-up" /> : <Link2 className="size-4" />}
        <span className="max-sm:sr-only">{copied ? "Copied" : "Copy link"}</span>
      </button>
      <span role="status" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </>
  );
}
