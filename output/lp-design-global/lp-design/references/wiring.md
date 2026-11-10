# Lenis + GSAP shell

One shell per app. React client component at the layout root.

```tsx
"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return children;
}
```

Import `lenis/dist/lenis.css` once, next to the global stylesheet.

ScrollTrigger scenes live in the section component, inside `gsap.context`, and `ctx.revert()` on cleanup. They bale out on `prefers-reduced-motion`. They do not create a second Lenis.

Scrub and layered `y` belong here. `background-attachment: fixed` is not the parallax.

Do not set `pin: true` on a node React rendered. Pin wraps that node in a spacer outside React's tree. The next client navigation then throws `NotFoundError: removeChild`. Scrub a transform on the node instead, and revert the `gsap.context` in a `useLayoutEffect` cleanup.
