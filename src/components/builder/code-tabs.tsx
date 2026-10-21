"use client";

import { Check, Copy } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useId, useState } from "react";
import { cn } from "@/lib/utils";

export type Snippet = {
  key: string;
  label: string;
  lang: "json" | "ts" | "sol" | "http" | "text";
  code: string;
  caption: ReactNode;
};

const KEYWORDS = /\b(const|let|function|return|external|returns|view|event|indexed|uint256|uint160|uint64|uint8|bytes32|bytes|address|string|GET|POST|bigint)\b/;

/** Tiny tokenizer — enough colour for short snippets without a highlighting dependency. */
function highlight(code: string, lang: Snippet["lang"]) {
  const out: ReactNode[] = [];
  const re =
    /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")(\s*:)?|(\b0x[0-9a-fA-F]+\b|\b\d[\d_]*n?\b)|([A-Za-z_][A-Za-z0-9_]*)(?=\()|([A-Za-z_][A-Za-z0-9_]*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const [full, comment, str, colon, num, fn, word] = m;
    const k = i++;
    if (comment) out.push(<span key={k} className="tok-com">{comment}</span>);
    else if (str) {
      out.push(
        <span key={k} className={colon && lang === "json" ? "tok-key" : "tok-str"}>
          {str}
        </span>,
      );
      if (colon) out.push(colon);
    } else if (num) out.push(<span key={k} className="tok-num">{num}</span>);
    else if (fn) out.push(<span key={k} className="tok-fn">{fn}</span>);
    else if (word && KEYWORDS.test(word)) out.push(<span key={k} className="tok-kw">{word}</span>);
    else out.push(full);
    last = m.index + full.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CodeTabs({ snippets }: { snippets: Snippet[] }) {
  const [active, setActive] = useState(snippets[0].key);
  const [copied, setCopied] = useState(false);
  const id = useId();
  const snippet = snippets.find((s) => s.key === active) ?? snippets[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="panel overflow-hidden !rounded-2xl">
      <div className="flex items-center gap-2 border-b border-line bg-canvas/60 px-3 py-2.5">
        <div className="hidden gap-1.5 px-1 sm:flex" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-fg/10" />
          <span className="size-2.5 rounded-full bg-fg/10" />
          <span className="size-2.5 rounded-full bg-fg/10" />
        </div>
        <div role="tablist" aria-label="Code examples" className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]">
          {snippets.map((s) => {
            const selected = s.key === active;
            return (
              <button
                key={s.key}
                type="button"
                role="tab"
                id={`${id}-tab-${s.key}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                onClick={() => setActive(s.key)}
                className={cn(
                  "relative shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-colors",
                  selected ? "text-fg" : "text-faint hover:text-muted",
                )}
              >
                {selected && (
                  <motion.span layoutId={`${id}-tab`} className="absolute inset-0 rounded-lg bg-fg/[0.07]" transition={{ type: "spring", stiffness: 420, damping: 36 }} />
                )}
                <span className="relative">{s.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-faint transition hover:bg-fg/[0.06] hover:text-fg"
        >
          {copied ? <Check className="size-4 text-up" /> : <Copy className="size-4" />}
        </button>
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${snippet.key}`}>
        <pre className="overflow-x-auto px-5 py-5 font-mono text-[0.8125rem] leading-relaxed text-soft">
          <code>{highlight(snippet.code, snippet.lang)}</code>
        </pre>
        <div className="border-t border-line px-5 py-3.5 text-xs leading-relaxed text-muted">{snippet.caption}</div>
      </div>
    </div>
  );
}
