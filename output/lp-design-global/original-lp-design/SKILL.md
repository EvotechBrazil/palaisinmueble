---
name: lp-design
description: >
  Builds a cinematic landing page or marketing site with Lenis, GSAP
  ScrollTrigger, and Motion. Use when the user runs /lp-design, asks for a
  landing page, LP, site de marca, página com parallax, scroll cinematográfico,
  preloader, or says the page looks flat, lifeless, or template-like.
argument-hint: "<marca | rota | seções ou mundo>"
license: MIT
compatibility: "Any LLM with a shell. Node.js. React or static HTML."
metadata:
  short-description: "Cinematic landing pages for any agent"
---

# lp-design

Agent Skills format. Any LLM that can edit files and run a shell can execute it.
This skill builds the page. A moodboard is not the delivery.

Read `references/wiring.md` before writing the scroll shell. That file owns the Lenis + GSAP init. Do not invent a second init.

## Decide the mode

- **Sections** (default). A marketing or editorial page: hero, proof, offer, action. Stack is Lenis + GSAP ScrollTrigger + Motion.
- **World.** Only when the user asks for one continuous 3D flight through scenes. Then use the installed `scroll-world` skill if it exists. If it does not, say so and build Sections. Do not fake a WebGL world with CSS.

Paid kits (Aceternity All-Access, Magic UI Pro) are vocabulary, not source. Do not paste their paid files. Implement the effect in this repo.

## Before code

1. Read the product that already exists: routes, data, brand words. Do not replace a working flow with a fake SaaS page.
2. Name the desire in one sentence (what the visitor should want). The sentence becomes the hero.
3. Pick one accent and one display face. Keep the project's color tokens. If the project uses `hsl(var(--...))`, new color stays in that form.
4. Pick at least four motions from the grammar below. A page with only a fade-in fails the skill.

## Grammar

Use these as real scroll or gesture, not as decoration on a static card.

| Effect | Engine | What it does |
| --- | --- | --- |
| Smooth scroll | Lenis | Wraps native scroll. Sticky, anchors, and keyboard stay. |
| Pin + scrub | GSAP ScrollTrigger | A section stays while type, image, or clip changes with the scroll. |
| Layered parallax | ScrollTrigger | Two or more layers move at different speeds. Not `background-attachment`. |
| Letter stagger | GSAP or Motion | The headline arrives per character or per word. |
| Marquee | CSS or GSAP | A line of names or words loops. Pause when reduced motion is on. |
| Horizontal strip | ScrollTrigger | A row translates on vertical scroll, or a real horizontal section. |
| Magnetic control | Motion | The main action shifts toward the pointer. |
| Spotlight | Motion or CSS | A glow follows the pointer on the hero only. |
| Preloader | GSAP or Motion | One short open. Skip it when reduced motion is on. Do not replay on every client navigation. |

Motion owns small UI (hover, tap, page bits). GSAP owns the scroll story. Do not run two timelines on the same element.

## Build

1. Add `lenis`, `gsap`, and `motion` when the app is React. Static HTML uses Lenis and GSAP from the wiring file.
2. Mount one smooth-scroll shell at the layout root, using `references/wiring.md`.
3. If `prefers-reduced-motion: reduce`, do not start Lenis, do not pin, do not run the preloader. Content is fully visible.
4. Hero is a viewport, not a paragraph under a navbar. The desire sentence is the largest type on the page.
5. The next section is the product's real data (offers, cities, articles, prices from the API). Empty state is designed, not a broken fetch.
6. Keep each view file under 500 lines. Put motion in its own client components.
7. Do not put secrets, tokens, or prices that the product stores in the database into the component as the only source.

## Verify

Open the page. Scroll the hero through the pin. Click the main action. Reload with reduced motion and confirm the page is still readable and still. Check a narrow viewport: type does not overflow, the marquee does not cover the action, the nav still reaches every route.

Fix what fails and look again. Do not declare the landing done from the source alone.
