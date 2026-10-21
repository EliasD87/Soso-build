export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Two harmonious hues for a project's monogram, stable per slug. */
export function projectHues(slug: string) {
  const h = hashString(slug);
  const a = h % 360;
  const b = (a + 40 + ((h >>> 9) % 60)) % 360;
  return [a, b] as const;
}

export function initials(name: string) {
  const words = name.replace(/[^\p{L}\p{N}\s]/gu, " ").trim().split(/\s+/);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  const word = words[0] ?? "?";
  return word.slice(0, 2).replace(/^./, (c) => c.toUpperCase());
}

export function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
