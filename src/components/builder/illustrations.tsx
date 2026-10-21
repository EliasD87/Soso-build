import { box, cylinder, iso, isoCircle, poly } from "./iso";

/*
 * Isometric line-art in the style of technical drawings: faces filled with the
 * card colour (so hidden edges disappear), strokes in currentColor, a single
 * brand-orange element. Hover motion is driven by `.tactile:hover` rules in
 * globals.css via the `art-*` classes.
 */

const VB = "-120 -118 240 196";

function Faces({ b, accent }: { b: ReturnType<typeof box>; accent?: boolean }) {
  if (accent) {
    return (
      <>
        <polygon points={b.left} className="art-accent-side" />
        <polygon points={b.right} className="art-accent-dark" />
        <polygon points={b.top} className="art-accent-top" />
      </>
    );
  }
  return (
    <>
      <polygon points={b.left} className="art-face" />
      <polygon points={b.right} className="art-face" />
      <polygon points={b.top} className="art-face" />
    </>
  );
}

function Line({ from, to, className = "art-line" }: { from: readonly [number, number, number]; to: readonly [number, number, number]; className?: string }) {
  const [x1, y1] = iso(...from);
  const [x2, y2] = iso(...to);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={className} />;
}

function Dust({ seed = 1 }: { seed?: number }) {
  // A few scattered dots, like the specks in a technical sketch.
  const dots = Array.from({ length: 14 }, (_, i) => {
    const a = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    const b = Math.sin(i * 39.3467 + seed * 11.135) * 24634.6345;
    return [((a - Math.floor(a)) - 0.5) * 220, ((b - Math.floor(b)) - 0.5) * 170 - 20] as const;
  });
  return (
    <g className="art-dust">
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.9} />
      ))}
    </g>
  );
}

/** 001 — users approve a max builder fee (a seal pressing onto a key card). */
export function ApproveArt() {
  const slab = box(-46, -32, 0, 92, 64, 7);
  const seal = cylinder(14, 6, 46, 14, 12);
  const [gx, gy] = iso(14, 6, 52);
  return (
    <svg viewBox={VB} className="art" aria-hidden="true">
      <Dust seed={2} />
      <path d={isoCircle(0, 0, 0, 74)} className="art-guide" />
      <Faces b={slab} />
      {/* text lines + checkbox on the card */}
      <Line from={[-36, -22, 7]} to={[-4, -22, 7]} />
      <Line from={[-36, -14, 7]} to={[-14, -14, 7]} />
      <polygon points={poly([iso(-36, 6, 7), iso(-26, 6, 7), iso(-26, 16, 7), iso(-36, 16, 7)])} className="art-face" />
      <polyline points={poly([iso(-34, 11, 7), iso(-31, 14, 7), iso(-27, 7, 7)])} className="art-check" />
      <path d={isoCircle(14, 6, 7, 18)} className="art-ring" />
      <Line from={[14, 6, 9]} to={[14, 6, 44]} className="art-dash" />
      <g className="art-press">
        <circle cx={gx} cy={gy} r={22} className="art-glow" />
        <path d={seal.body} className="art-accent-side" />
        <path d={seal.top} className="art-accent-top" />
        <path d={cylinder(14, 6, 58, 5, 14).body} className="art-face" />
        <path d={cylinder(14, 6, 58, 5, 14).top} className="art-face" />
      </g>
    </svg>
  );
}

/** 002 — orders carry the builder code (a tagged ticket slides off the stack). */
export function AttachArt() {
  const tickets = [0, 13, 26].map((z) => box(-50, -34, z, 96, 64, 6));
  const tag = box(26, -30, 32, 14, 14, 14);
  const [gx, gy] = iso(33, -23, 54);
  return (
    <svg viewBox={VB} className="art" aria-hidden="true">
      <Dust seed={5} />
      <path d={isoCircle(-2, -2, 0, 74)} className="art-guide" />
      <Faces b={tickets[0]} />
      <Faces b={tickets[1]} />
      <g className="art-slide">
        <Faces b={tickets[2]} />
        <Line from={[-40, -24, 32]} to={[-6, -24, 32]} />
        <Line from={[-40, -16, 32]} to={[-20, -16, 32]} />
        <Line from={[-40, -8, 32]} to={[-12, -8, 32]} />
        <g className="art-pop">
          <circle cx={gx} cy={gy} r={18} className="art-glow" />
          <Faces b={tag} accent />
        </g>
      </g>
    </svg>
  );
}

/** 003 — fees stream in (bars rise, a coin rides the tallest). */
export function EarnArt() {
  const heights = [22, 34, 28, 46, 62];
  const bars = heights.map((h, i) => ({ b: box(-58 + i * 22, -6, 0, 14, 14, h), i }));
  const coin = cylinder(37, 1, 66, 8, 5);
  const [gx, gy] = iso(37, 1, 74);
  return (
    <svg viewBox={VB} className="art" aria-hidden="true">
      <Dust seed={9} />
      <Line from={[-70, 16, 0]} to={[60, 16, 0]} className="art-guide" />
      {bars.map(({ b, i }) => (
        <g key={i} className="art-bar" style={{ transitionDelay: `${i * 40}ms` }}>
          <Faces b={b} />
        </g>
      ))}
      <g className="art-bounce">
        <circle cx={gx} cy={gy} r={16} className="art-glow" />
        <path d={coin.body} className="art-accent-side" />
        <path d={coin.top} className="art-accent-top" />
      </g>
    </svg>
  );
}

/** Leaderboard podium — used on the home page. */
export function PodiumArt() {
  const blocks = [
    { b: box(-50, -10, 0, 26, 26, 30), accent: false },
    { b: box(-14, -24, 0, 26, 26, 50), accent: true },
    { b: box(22, -38, 0, 26, 26, 20), accent: false },
  ];
  const [gx, gy] = iso(-1, -11, 60);
  return (
    <svg viewBox={VB} className="art" aria-hidden="true">
      <Dust seed={13} />
      <path d={isoCircle(0, -10, 0, 70)} className="art-guide" />
      {/* back-to-front: larger x + y sits closer to the viewer */}
      {blocks.map(({ b, accent }, i) => (
        <g key={i} className="art-bar">
          <Faces b={b} accent={accent} />
        </g>
      ))}
      <g className="art-bounce">
        <circle cx={gx} cy={gy} r={16} className="art-glow" />
        <path d={cylinder(-1, -11, 50, 7, 4).body} className="art-face" />
        <path d={cylinder(-1, -11, 50, 7, 4).top} className="art-face" />
      </g>
    </svg>
  );
}
