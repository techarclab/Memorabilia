/* ------------------------------------------------------------------
   The Memorabilia icon set — hand-drawn to one weight so nothing in the UI
   looks borrowed. Sized either by props or by the container (100%).
   ------------------------------------------------------------------ */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Icons that fill their box — used inside circular wrappers. */
const box = { viewBox: "0 0 24 24", width: "100%", height: "100%", strokeWidth: 1.7, ...line };
const sm = (n: number) => ({ viewBox: "0 0 24 24", width: n, height: n, ...line });

export const Search = (p: P) => (
  <svg {...sm(18)} strokeWidth={1.8} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const User = (p: P) => (
  <svg {...sm(18)} strokeWidth={1.8} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const Gift = (p: P) => (
  <svg {...box} {...p}><rect x="3" y="9" width="18" height="12" rx="2" /><path d="M3 13h18M12 9v12" />
    <path d="M12 9S10.5 4 8 4a2.5 2.5 0 0 0 0 5zM12 9s1.5-5 4-5a2.5 2.5 0 0 1 0 5z" /></svg>
);
export const Shield = (p: P) => (
  <svg {...box} {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const Tag2 = (p: P) => (
  <svg {...box} {...p}><path d="M20.6 13.4 12 22l-9-9V4h9l8.6 8.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="8.5" r="1.5" /></svg>
);
export const Layers = (p: P) => (
  <svg {...box} {...p}><path d="m12 2 9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5" /></svg>
);
export const Truck = (p: P) => (
  <svg {...box} {...p}><path d="M2 6h11v11H2zM13 10h4l4 4v3h-8z" /><circle cx="6.5" cy="18.5" r="1.8" /><circle cx="17" cy="18.5" r="1.8" /></svg>
);
export const Users = (p: P) => (
  <svg {...box} {...p}><circle cx="9" cy="8" r="3.4" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16.5 5.2a3.4 3.4 0 0 1 0 5.6M17.5 20a6.4 6.4 0 0 0-2-4.6" /></svg>
);
export const Star = (p: P) => (
  <svg {...box} {...p}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></svg>
);
export const Leaf = (p: P) => (
  <svg {...box} {...p}><path d="M21 3S9 3 6 8s0 12 0 12 9-1 12-6c2-3.5 3-11 3-11z" /><path d="M4 21C7 14 12 9 18 6" /></svg>
);
export const Play = (p: P) => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5.5v13l11-6.5z" /></svg>
);
export const Pencil = (p: P) => (
  <svg {...box} {...p}><path d="M17 3l4 4L8 20l-5 1 1-5z" /></svg>
);
export const Clock = (p: P) => (
  <svg {...box} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></svg>
);
export const Info = (p: P) => (
  <svg {...sm(13)} strokeWidth={1.9} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
);
export const Cart = (p: P) => (
  <svg {...sm(19)} strokeWidth={1.3} {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" />
    <path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg>
);
export const Doc = (p: P) => (
  <svg {...sm(19)} strokeWidth={1.3} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h4" /></svg>
);
export const X = (p: P) => (
  <svg {...sm(15)} strokeWidth={1.4} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const Arw = (p: P) => (
  <svg className="arw" {...sm(15)} strokeWidth={1.4} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArwL = (p: P) => (
  <svg {...sm(15)} strokeWidth={1.6} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const Check = (p: P) => (
  <svg {...sm(20)} strokeWidth={1.4} {...p}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>
);
export const Book = (p: P) => (
  <svg {...sm(20)} strokeWidth={1.2} {...p}><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" /><path d="M4 17.5h16" /></svg>
);
export const Pen = (p: P) => (
  <svg {...sm(20)} strokeWidth={1.2} {...p}><path d="M15.5 2.5 21.5 8.5M17 1l6 6-13 13-6.5 1.5L5 15z" /><path d="m5 15 4 4M13.5 4.5l6 6" /></svg>
);
export const Key = (p: P) => (
  <svg {...sm(20)} strokeWidth={1.2} {...p}><circle cx="8" cy="6" r="4" />
    <path d="M8 10v5M6 12h4M6.5 15h3v5.5a1.5 1.5 0 0 1-3 0z" /><path d="M14 4h6M14 8h6M17 4v4" /></svg>
);
export const Bottle = (p: P) => (
  <svg {...sm(20)} strokeWidth={1.2} {...p}>
    <path d="M9 2h6v3l1.5 2.5A4 4 0 0 1 17 9.7V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7a4 4 0 0 1 .5-2.2L9 5z" />
    <path d="M7 12h10" /></svg>
);
export const Box = (p: P) => (
  <svg {...sm(20)} strokeWidth={1.2} {...p}><path d="M21 8v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8M2 4h20v4H2zM10 12h4" /></svg>
);
export const Sparkle = (p: P) => (
  <svg {...box} strokeWidth={1.1} {...p}><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M18.4 5.6l-4.2 4.2M9.8 14.2l-4.2 4.2" /></svg>
);

/** Matches a line-sheet content string to the right piece icon. */
export function ItemIcon({ name }: { name: string }) {
  if (/Notebook/i.test(name)) return <Book />;
  if (/Pen/i.test(name)) return <Pen />;
  if (/Keychain/i.test(name)) return <Key />;
  if (/Flask|Bottle/i.test(name)) return <Bottle />;
  return <Box />;
}

/** The mark. A gift box drawn in one stroke weight, animated on mount. */
export function Logo() {
  return (
    <svg className="logo__mark" viewBox="0 0 24 24" strokeWidth={1.7} {...line} aria-hidden="true">
      <rect className="draw" x="3" y="9" width="18" height="12" rx="2" />
      <path d="M3 13h18M12 9v12" />
      <path d="M12 9S10.5 4 8 4a2.5 2.5 0 0 0 0 5zM12 9s1.5-5 4-5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}
