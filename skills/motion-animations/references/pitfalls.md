# Pitfalls

Each of these cost real debugging time on the worked example. Check this list before debugging an animation that "does nothing."

## 1. Elements animated in from outside a clipped container are invisible

**Symptom:** the element never appears. No error, no flash, nothing.

**Cause:** animating from an offset like `initial={{ y: 300 }}` inside a parent with `overflow: hidden` (a phone frame, a card, a modal). The element spends its start position outside the clip region, and if anything interrupts or misconfigures the transition it stays clipped forever. Even when it works, the element overlaps content during the slide.

**Fix:** for slide-up panels inside clipped containers, animate `height: 0 -> "auto"` instead of a `y` transform. The element stays inside the clip region the whole time and pushes sibling content naturally:

```tsx
initial={{ height: 0, opacity: 0 }}
animate={{ height: "auto", opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
```

## 2. React strict mode kills "run once" effects guarded by a ref

**Symptom:** the entire animation sequence never starts in development. The page renders its static frame and sits there.

**Cause:** strict mode runs mount -> unmount -> mount. A guard like:

```tsx
const startedRef = useRef(false);
useEffect(() => {
  if (startedRef.current) return;  // BUG
  startedRef.current = true;
  run();
}, []);
```

The first run sets the ref, then gets cancelled by the unmount cleanup. The second (surviving) mount sees the ref already true and never starts. Result: zero animation, zero errors.

**Fix:** no ref guard. Use a `cancelled` flag flipped in cleanup, and check it after every `await`:

```tsx
useEffect(() => {
  let cancelled = false;
  const run = async () => { /* check cancelled after each await */ };
  run();
  return () => { cancelled = true; };
}, []);
```

The first run dies cleanly via the flag; the second run proceeds.

## 3. Rapid state flips through motion props drop frames

**Symptom:** per-keystroke key highlights on a fake keyboard flicker inconsistently or skip entirely.

**Cause:** driving a 20-60ms on/off cycle through `animate={{ backgroundColor: ... }}`. Springs and tweens need time to settle; at keystroke speed each animation is interrupted before it renders.

**Fix:** toggle a plain CSS class and let a short CSS transition (or none) handle it. Reserve motion props for transitions long enough to be perceived (roughly 150ms and up).

## 4. Importing from "motion" instead of "motion/react"

The npm package is `motion`, but React components import from the `motion/react` entry point. Importing `motion` directly gets the vanilla-JS API and no `<motion.div>`.

## 5. Unstable keys break AnimatePresence

Exit animations track elements by key. Array-index keys reshuffle when items are added or removed, so exits fire on the wrong element or not at all. Always key by a stable ID from the script data.

## 6. Claiming done without looking

The recurring meta-bug: every pitfall above produces a build that compiles cleanly and renders a plausible static frame. The only reliable check is visual: run the dev server, screenshot at several points in the sequence, confirm elements are visible and moving. If a stakeholder shows you a screenshot that contradicts your claim, they are right and the code is wrong.
