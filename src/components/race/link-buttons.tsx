import { ArrowUpRight } from "lucide-react";
import type { ComponentType, MouseEvent, ReactNode, SVGProps } from "react";
import { GitHubIcon, XIcon } from "@/components/icons";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { youtubeId, youtubeWatchUrl } from "@/lib/youtube";

type LinkSpec = {
  key: string;
  href?: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function videoUrl(project: Project) {
  const id = youtubeId(project.links.video);
  return id ? youtubeWatchUrl(id) : project.links.video;
}

export function projectLinks(project: Project): LinkSpec[] {
  return [
    { key: "github", href: project.links.github, label: `${project.name} on GitHub`, icon: GitHubIcon },
    {
      key: "x",
      href: project.builder.x ? `https://x.com/${project.builder.x}` : undefined,
      label: `${project.builder.name} on X`,
      icon: XIcon,
    },
  ];
}

const stop = (e: MouseEvent) => e.stopPropagation();

/** Fixed-width row of icon links; missing links keep their slot so columns align. */
export function LinkButtons({ project, className }: { project: Project; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {projectLinks(project).map(({ key, href, label, icon: Icon }) =>
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={stop}
            aria-label={label}
            title={label}
            className="grid size-7 place-items-center rounded-lg text-muted ring-1 ring-transparent transition hover:bg-fg/[0.06] hover:text-fg hover:ring-fg/10"
          >
            <Icon className="size-3.5" />
          </a>
        ) : (
          <span key={key} className="grid size-7 place-items-center text-fg/10" aria-hidden="true">
            <Icon className="size-3.5" />
          </span>
        ),
      )}
    </div>
  );
}

export function AppLink({
  href,
  label,
  children,
  className,
}: {
  href: string;
  /** Accessible name; should contain the visible text. */
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={stop}
      aria-label={label}
      className={cn("group/app inline-flex items-center gap-1 hover:text-brand-soft", className)}
    >
      <span className="truncate">{children}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-3.5 shrink-0 opacity-0 transition group-hover/app:translate-x-0.5 group-hover/app:-translate-y-0.5 group-hover/app:opacity-100 group-focus-visible/app:opacity-100"
      />
    </a>
  );
}
