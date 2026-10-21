import { XIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { Wordmark } from "./site-header";

const LINKS = [
  { label: "SoSoValue", href: site.links.sosovalue },
  { label: "SoDEX", href: site.links.sodex },
  { label: "ValueChain", href: site.links.valuechain },
  { label: "Buildathon on Akindo", href: site.links.buildathon },
  { label: "Discord", href: site.links.discord },
  { label: "Telegram", href: site.links.telegram },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Wordmark />
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-faint">
            Wave 3 Builder Race · SoDEX builder codes
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="transition hover:text-fg">
              {l.label}
            </a>
          ))}
          <a
            href={site.links.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SoSoValue on X"
            className="grid size-8 place-items-center rounded-full border border-line transition hover:border-line-strong hover:text-fg"
          >
            <XIcon className="size-3.5" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
