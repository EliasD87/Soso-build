/** Extracts the video id from youtu.be, watch?v=, /embed/ and /shorts/ URLs. */
export function youtubeId(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return clean(u.pathname.slice(1));
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const v = u.searchParams.get("v");
      if (v) return clean(v);
      const match = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
      if (match) return clean(match[1]);
    }
  } catch {
    return null;
  }
  return null;
}

function clean(id: string) {
  const trimmed = id.split(/[/?#&]/)[0];
  return /^[\w-]{6,}$/.test(trimmed) ? trimmed : null;
}

export function youtubeEmbedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

export function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}
