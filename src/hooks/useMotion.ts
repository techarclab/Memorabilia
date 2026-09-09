/* ------------------------------------------------------------------
   The motion layer.

   Everything here moves transform and opacity only, is driven by
   IntersectionObserver or requestAnimationFrame, and is a no-op under
   prefers-reduced-motion. Each hook re-scans when its dependency
   changes, which is how the filtered product grid keeps animating.
   ------------------------------------------------------------------ */
import { useEffect, useRef } from "react";
import { colourTone } from "@/data/catalog";

export const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer:coarse)").matches;

const all = <T extends Element>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Paint the page's ambient accent to match a colourway. */
export function setTone(colour: string) {
  const t = colourTone[colour] || colourTone.Blue;
  document.documentElement.style.setProperty("--tone", t[0]);
  document.documentElement.style.setProperty("--wash", t[1]);
}

/** Reveal-on-scroll for `.rv` elements. Pass anything that changes the DOM. */
export function useReveal(dep?: unknown) {
  useEffect(() => {
    const els = all<HTMLElement>(".rv:not(.in)");
    if (!els.length) return;
    if (reduced()) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

/** Counts `[data-count]` numbers up when they scroll into view. */
export function useCountUp(dep?: unknown) {
  useEffect(() => {
    const els = all<HTMLElement>("[data-count]");
    if (!els.length) return;
    if (reduced()) { els.forEach((e) => { e.textContent = e.dataset.count!; }); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        const to = parseFloat(el.dataset.count!);
        let t0 = 0;
        const step = (ts: number) => {
          if (!t0) t0 = ts;
          const k = Math.min(1, (ts - t0) / 1500);
          const e = 1 - Math.pow(1 - k, 3);
          el.textContent = to % 1 ? (to * e).toFixed(1) : Math.round(to * e).toLocaleString("en-IN");
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

/**
 * Splits `.split` headlines into per-word masks that rise on reveal.
 * Words are joined with a non-breaking space so `text-wrap: balance`
 * can't open gaps between the inline-block masks.
 */
export function useSplitText(dep?: unknown) {
  useEffect(() => {
    const els = all<HTMLElement>(".split");
    if (!els.length) return;
    els.forEach((el) => {
      if (el.dataset.split) return;
      el.dataset.split = "1";
      el.innerHTML = el.innerHTML
        .split(/<br\s*\/?>/i)
        .map((linePart) =>
          linePart.trim().split(/\s+/).map((w) => `<span class="w"><i>${w}</i></span>`).join("&nbsp;"))
        .join("<br>");
      all<HTMLElement>(".w > i", el).forEach((n, i) => {
        n.style.transitionDelay = `${(i * 0.045).toFixed(3)}s`;
      });
    });
    if (reduced()) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.2 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

/** `.mag` wrappers pull gently toward the cursor. */
export function useMagnetic(dep?: unknown) {
  useEffect(() => {
    if (reduced() || coarse()) return;
    const cleanups: (() => void)[] = [];
    all<HTMLElement>(".mag").forEach((el) => {
      let rx = 0, ry = 0, tx = 0, ty = 0, on = false, id = 0;
      const loop = () => {
        tx = lerp(tx, rx, 0.16); ty = lerp(ty, ry, 0.16);
        el.style.transform = `translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0)`;
        if (on || Math.abs(tx) > 0.1 || Math.abs(ty) > 0.1) id = requestAnimationFrame(loop);
        else el.style.transform = "";
      };
      const enter = () => { on = true; cancelAnimationFrame(id); id = requestAnimationFrame(loop); };
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        rx = (e.clientX - r.left - r.width / 2) * 0.28;
        ry = (e.clientY - r.top - r.height / 2) * 0.38;
      };
      const leave = () => { on = false; rx = 0; ry = 0; };
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        cancelAnimationFrame(id);
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, [dep]);
}

/** A soft light that follows the cursor across `.spot` panels. */
export function useSpotlight(dep?: unknown) {
  useEffect(() => {
    if (reduced() || coarse()) return;
    const cleanups: (() => void)[] = [];
    all<HTMLElement>(".spot").forEach((el) => {
      if (el.querySelector(":scope > .spot__l")) return;
      const l = document.createElement("span");
      l.className = "spot__l";
      el.prepend(l);
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        l.style.left = `${e.clientX - r.left}px`;
        l.style.top = `${e.clientY - r.top}px`;
      };
      el.addEventListener("mousemove", move);
      cleanups.push(() => { el.removeEventListener("mousemove", move); l.remove(); });
    });
    return () => cleanups.forEach((c) => c());
  }, [dep]);
}

/** Sections carrying `data-tone` retint the page as they take the viewport. */
export function useAmbient(dep?: unknown) {
  useEffect(() => {
    const zones = all<HTMLElement>("[data-tone]");
    if (!zones.length) return;
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.4) setTone((e.target as HTMLElement).dataset.tone!);
      }),
      { threshold: [0.4, 0.7] },
    );
    zones.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, [dep]);
}

/** Images inside `[data-para-img]` frames drift against the scroll. */
export function useFrameParallax(dep?: unknown) {
  useEffect(() => {
    if (reduced()) return;
    const els = all<HTMLElement>("[data-para-img]");
    if (!els.length) return;
    let tick = false;
    const run = () => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > innerHeight + 100) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        const img = el.querySelector("img");
        if (img) img.style.transform = `translate3d(0,${(p * -18).toFixed(1)}px,0) scale(1.06)`;
      });
    };
    const h = () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; run(); }); } };
    addEventListener("scroll", h, { passive: true });
    addEventListener("resize", h, { passive: true });
    run();
    return () => { removeEventListener("scroll", h); removeEventListener("resize", h); };
  }, [dep]);
}

/**
 * Scroll progress through a pinned section, 0 → 1.
 *
 * The section is taller than the viewport and its inner panel is sticky,
 * so scrolling through it advances a story rather than moving past one.
 * Returns nothing directly — it writes `--p` on the element and calls back
 * with the step, because reading scroll into React state on every frame is
 * how a scroll handler ends up janky.
 */
export function useScrollScene(
  ref: React.RefObject<HTMLElement>,
  steps: number,
  onStep: (i: number) => void,
) {
  const at = useRef(-1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) { onStep(steps - 1); return; }
    let tick = false;
    const run = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - innerHeight;
      // Below the breakpoint the section is no longer taller than the
      // viewport and nothing is pinned, so there is no scroll to read.
      // The steps are buttons there instead — driving them from here would
      // fight the tap.
      if (span <= 0) return;
      const p = clamp(-r.top / span, 0, 1);
      el.style.setProperty("--p", p.toFixed(4));
      // Bias slightly forward so the last step is reached before the
      // section lets go of the viewport, rather than at the exact end.
      const i = clamp(Math.floor(p * steps * 1.06), 0, steps - 1);
      if (i !== at.current) { at.current = i; onStep(i); }
    };
    const h = () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; run(); }); } };
    addEventListener("scroll", h, { passive: true });
    addEventListener("resize", h, { passive: true });
    run();
    return () => { removeEventListener("scroll", h); removeEventListener("resize", h); };
  }, [ref, steps, onStep]);
}

/**
 * A few degrees of tilt towards the cursor on `.tilt3` cards.
 *
 * Deliberately small — two degrees reads as the card noticing you, ten
 * reads as a demo of a tilt library.
 */
export function useTilt(dep?: unknown) {
  useEffect(() => {
    if (reduced() || coarse()) return;
    const cleanups: (() => void)[] = [];
    all<HTMLElement>(".tilt3").forEach((el) => {
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        el.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${(x * 4).toFixed(2)}deg`);
      };
      const off = () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", off);
      cleanups.push(() => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", off);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, [dep]);
}

/** Sticky header state and the thin gold reading-progress bar. */
export function useHeaderBehaviour(locked: boolean) {
  const lockRef = useRef(locked);
  lockRef.current = locked;
  useEffect(() => {
    let last = 0, tick = false;
    const run = () => {
      const hdr = document.getElementById("hdr");
      const prog = document.getElementById("prog");
      if (hdr) {
        const y = scrollY;
        hdr.classList.toggle("is-stuck", y > 30);
        hdr.classList.toggle("is-hidden", y > 420 && y > last && !lockRef.current);
        last = y;
      }
      if (prog) {
        const h = document.body.scrollHeight - innerHeight;
        prog.style.width = `${h > 0 ? (scrollY / h) * 100 : 0}%`;
      }
    };
    const h = () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; run(); }); } };
    addEventListener("scroll", h, { passive: true });
    addEventListener("resize", h, { passive: true });
    run();
    return () => { removeEventListener("scroll", h); removeEventListener("resize", h); };
  }, []);
}

/** Everything a freshly rendered page needs, in one call. */
export function usePageMotion(dep?: unknown) {
  useReveal(dep);
  useCountUp(dep);
  useSplitText(dep);
  useMagnetic(dep);
  useSpotlight(dep);
  useAmbient(dep);
  useFrameParallax(dep);
  useTilt(dep);
}

export { clamp, lerp };
