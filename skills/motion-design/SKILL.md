---
name: motion-design
description: >-
  Build polished UI animations with Motion (motion.dev) for React. Use when
  the user asks for an animated product mockup, an animated chat or messaging
  interface, a typing effect, a demo animation of an app or feature, staggered
  card or list reveals, or any React animation built with Motion or Framer
  Motion. Covers project setup, script-driven playback, spring physics,
  enter/exit transitions, and the visual verification loop.
metadata:
  emoji: "🎬"
  vellum:
    display-name: "Motion Design"
    category: "creative"
    activation-hints:
      - "User wants an animated mockup or demo of a UI (chat, feed, dashboard, onboarding flow)"
      - "User asks for animations with Motion, motion.dev, or Framer Motion"
      - "User wants a typing effect, message replay, or staggered reveal in React"
      - "User wants a looping product animation for a landing page or video capture"
    avoid-when:
      - "User wants CSS-only or GSAP animations with no React involved"
      - "User wants video editing or motion graphics in After Effects"
---

Build UI animations with Motion (the library at motion.dev, npm package `motion`) in React. Follow this workflow instead of improvising; every pattern here was verified in a real build.

## Setup

New project:

```bash
bun create vite my-animation --template react-ts
cd my-animation && bun install && bun add motion
```

Import from the React entry point, not the package root:

```tsx
import { motion, AnimatePresence } from "motion/react";
```

## The core architecture: script-driven playback

Animated mockups are not interactive apps. Model them as a **script** (a data array of steps) plus a **player** (one async effect that walks the script and flips state). This keeps timing in one place and makes the whole sequence loopable.

```tsx
useEffect(() => {
  let cancelled = false;
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const run = async () => {
    while (!cancelled) {
      resetAllState();
      for (const step of SCRIPT) {
        if (cancelled) return;
        // flip state, await sleep(...) between beats
      }
      await sleep(4000); // hold the final frame, then loop
    }
  };

  run();
  return () => { cancelled = true; };
}, []);
```

Two rules that are not optional:

1. **Use a `cancelled` flag in cleanup, never a "started" ref guard.** React strict mode mounts, unmounts, and remounts. A ref guard blocks the second (surviving) run while cleanup kills the first, and the animation silently never starts.
2. **Check `cancelled` after every await.** Otherwise a stale run keeps mutating state after unmount.

See `references/patterns.md` for the full player, ghost typing, stagger, and enter/exit code. See `references/pitfalls.md` before debugging anything.

## Timing and physics defaults

These values were tuned by eye on a real chat replay; start here.

| Use | Values |
| --- | --- |
| Message/card entrance | `{ type: "spring", stiffness: 300, damping: 26 }` with `initial={{ opacity: 0, y: 16 }}` |
| Staggered cards | same spring, `delay: 0.3 + i * 0.18` |
| Reaction/badge pop | `{ type: "spring", stiffness: 400, damping: 18 }` from `scale: 0.5` |
| Button press | animate `scale: 0.8` for ~180ms, spring back |
| Ghost typing | 15-65ms per character (15 feels fast, 65 feels human) |
| Typing indicator dots | `y: [0, -4, 0]`, 0.8s, `repeat: Infinity`, `delay: i * 0.15` |
| Beat between script steps | 450-700ms plain, 1200-1600ms when rich content needs room to stagger in |

## Verify visually before claiming done

An animation that compiles is not an animation that works. The failure mode is silent: everything renders, nothing moves, or elements animate outside a clipped container and are invisible.

1. Run the dev server (`bun run dev`).
2. Open it in a real browser or take screenshots at multiple points in the sequence.
3. Confirm each animated element is actually visible at its start and end position.
4. Only then report the result.

If a screenshot shows nothing where something should be, check `references/pitfalls.md` first; the top three bugs there account for most invisible-animation reports.

## Component library

`components/` holds ready-to-use animated React components sourced from [Originkit](https://originkit.dev) (free animated component library), served as Vite + TypeScript + CSS variants. Browse `components/INDEX.md` for the full catalog with categories and descriptions: particle effects, text animations, 3D galleries, interactive backgrounds, and more.

When a request matches one of these (a black hole hero, smoky text reveal, infinite gallery, pixel reveal, and so on), start from the library component instead of building from scratch: copy `components/<name>/<name>.tsx` into the project, check `meta.json` for dependencies (most have none; a few need `framer-motion`), and adapt props. Components marked *pending* in the index are not yet imported; build those from the patterns instead.

## Worked example

`examples/chat-mockup/` is a complete project: a Slack-style mobile chat in a phone frame that loops forever. It demonstrates every pattern in the references: script-driven playback, typing indicator, ghost typing on a slide-up keyboard, staggered carousel, link preview pop, reaction badges, and auto-scroll. Run it with `bun install && bun run dev` from that directory, and copy structure from it rather than starting cold.
