import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function GitHubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54 0-.27-.01-1.15-.02-2.09-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.16a10.8 10.8 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.55.23 2.7.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.33-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.78.54A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.75 2.5h3.27l-7.14 8.16 8.4 11.1h-6.58l-5.15-6.73-5.9 6.73H1.38l7.64-8.73L.96 2.5h6.74l4.66 6.16 5.39-6.16Zm-1.15 17.3h1.81L6.73 4.36H4.79L16.6 19.8Z" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.12-2.13C19.5 3.56 12 3.56 12 3.56s-7.5 0-9.38.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.13c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3 3 0 0 0 2.12-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.57V8.43L15.82 12 9.6 15.57Z" />
    </svg>
  );
}

/** Akindo — generic "project page" glyph (no official mark is bundled). */
export function AkindoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 20 12 4l8 16" />
      <path d="M7.5 13h9" />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.94 4.3 18.9 19.02c-.23 1.03-.84 1.29-1.7.8l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.34-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19L6.99 13l-4.63-1.45c-1-.31-1.02-1 .21-1.49L20.66 3.1c.84-.31 1.57.19 1.28 1.2Z" />
    </svg>
  );
}

export function DiscordIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.27 5.33A17.7 17.7 0 0 0 14.9 4l-.2.4a16.4 16.4 0 0 1 3.9 1.96 13.3 13.3 0 0 0-11.2 0A16.4 16.4 0 0 1 11.3 4.4L11.1 4a17.7 17.7 0 0 0-4.37 1.33C3.97 9.45 3.22 13.47 3.6 17.43a17.8 17.8 0 0 0 5.36 2.7l1.15-1.57a11.6 11.6 0 0 1-1.8-.87l.44-.34a12.7 12.7 0 0 0 10.5 0l.44.34c-.57.34-1.18.63-1.8.87l1.15 1.57a17.8 17.8 0 0 0 5.36-2.7c.45-4.6-.77-8.58-3.13-12.1ZM9.5 15c-1.03 0-1.88-.95-1.88-2.11 0-1.17.83-2.12 1.88-2.12 1.05 0 1.9.96 1.88 2.12 0 1.16-.83 2.11-1.88 2.11Zm5 0c-1.03 0-1.88-.95-1.88-2.11 0-1.17.83-2.12 1.88-2.12 1.05 0 1.9.96 1.88 2.12 0 1.16-.83 2.11-1.88 2.11Z" />
    </svg>
  );
}
