/**
 * Minimal isometric projection helpers for the line-art illustrations.
 * World axes: x → lower-right, y → lower-left, z → up.
 */

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;

export type Pt = readonly [number, number];

export function iso(x: number, y: number, z = 0): Pt {
  return [(x - y) * COS, (x + y) * SIN - z];
}

export function poly(points: Pt[]) {
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

/** Visible faces of an axis-aligned box: top, left (+y side) and right (+x side). */
export function box(x: number, y: number, z: number, w: number, d: number, h: number) {
  return {
    top: poly([iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)]),
    left: poly([iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x, y + d, z + h)]),
    right: poly([iso(x + w, y, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x + w, y, z + h)]),
  };
}

/** Ellipse (as a path) for a horizontal circle of radius r centred at (cx, cy, z). */
export function isoCircle(cx: number, cy: number, z: number, r: number, steps = 48) {
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    pts.push(iso(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z));
  }
  return `M${poly(pts).replaceAll(" ", " L")}Z`;
}

/** Upright cylinder: returns the top ellipse and the visible body outline. */
export function cylinder(cx: number, cy: number, z: number, r: number, h: number) {
  const top = isoCircle(cx, cy, z + h, r);
  // Silhouette edges sit where the ellipse is widest on screen: angle -45° and 135° in world space.
  const a = -Math.PI / 4;
  const b = (3 * Math.PI) / 4;
  const l0 = iso(cx + Math.cos(b) * r, cy + Math.sin(b) * r, z);
  const l1 = iso(cx + Math.cos(b) * r, cy + Math.sin(b) * r, z + h);
  const r1 = iso(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z + h);
  // Front half of the bottom ellipse (angles from -45° through 45° to 135°).
  const front: Pt[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = a + (i / 24) * Math.PI;
    front.push(iso(cx + Math.cos(t) * r, cy + Math.sin(t) * r, z));
  }
  const body = `M${l1[0].toFixed(2)},${l1[1].toFixed(2)} L${l0[0].toFixed(2)},${l0[1].toFixed(2)} L${poly([...front].reverse()).replaceAll(" ", " L")} L${r1[0].toFixed(2)},${r1[1].toFixed(2)}Z`;
  return { top, body };
}
