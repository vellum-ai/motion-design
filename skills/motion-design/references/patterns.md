# Motion patterns

Copy-ready code for the recurring pieces of an animated UI mockup. All snippets assume `import { motion, AnimatePresence } from "motion/react"` and React 18+.

## 1. The script

Define the whole sequence as data. Rich content (carousels, previews, reactions) hangs off optional fields so the player and renderer stay generic.

```tsx
type Message = {
  id: number;
  text: string;
  sender: "them" | "me";
  time: string;
  ghostType?: boolean;        // typed live on the fake keyboard before sending
  reactions?: string[];       // emoji that pop in after the message lands
  carousel?: Card[];          // horizontally scrollable cards that stagger in
};

const SCRIPT: Message[] = [
  { id: 1, text: "Hey! Found some options for us.", sender: "them", time: "8:32 PM" },
  { id: 2, text: "Let's do this!!", sender: "me", time: "8:32 PM", ghostType: true },
];
```

## 2. The player

One async effect owns all timing. Note the `cancelled` checks after every await and the outer `while` for looping.

```tsx
useEffect(() => {
  let cancelled = false;
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const run = async () => {
    await sleep(1000); // let the frame/entrance animation land first

    while (!cancelled) {
      setVisibleMessages([]);
      setTypedText("");
      setIsTyping(false);
      setKeyboardVisible(false);
      await sleep(500);

      for (const msg of SCRIPT) {
        if (cancelled) return;

        if (msg.ghostType) {
          setKeyboardVisible(true);
          await sleep(600); // keyboard slide-up

          for (const char of msg.text) {
            if (cancelled) return;
            setActiveKey(char === " " ? "space" : char.toLowerCase());
            setTypedText((prev) => prev + char);
            await sleep(45);
            setActiveKey(null);
            await sleep(20);
          }

          await sleep(500);
          setSendPressed(true);
          await sleep(180);
          setSendPressed(false);
          setVisibleMessages((prev) => [...prev, msg]);
          setTypedText("");
          await sleep(300);
          setKeyboardVisible(false);
          await sleep(msg.carousel ? 1200 : 450);
        } else {
          setIsTyping(true);
          await sleep(1100 + Math.random() * 400); // human-feeling variance
          if (cancelled) return;
          setIsTyping(false);
          setVisibleMessages((prev) => [...prev, msg]);
          await sleep(msg.carousel ? 1600 : 600); // room for stagger
        }
      }

      await sleep(4000); // hold final frame, then loop
    }
  };

  run();
  return () => { cancelled = true; };
}, []);
```

## 3. Message entrance

Spring in from slightly below. `layout` keeps earlier messages settling smoothly as new ones push in.

```tsx
<motion.div
  layout
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 26 }}
>
```

Wrap the message list in `AnimatePresence` with `mode="popLayout"` so exits and layout shifts coexist:

```tsx
<AnimatePresence mode="popLayout">
  {visibleMessages.map((msg) => <MessageRow key={msg.id} message={msg} />)}
</AnimatePresence>
```

Keys must be stable IDs from the script, never array indices.

## 4. Typing indicator

Three dots on infinite loop, phase-shifted by index:

```tsx
{[0, 1, 2].map((i) => (
  <motion.span
    key={i}
    className="typing-dot"
    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
  />
))}
```

Give the indicator an `exit` so it leaves gracefully when the real message replaces it:

```tsx
exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
```

## 5. Slide-up keyboard (enter/exit inside a clipped container)

Animate `height: 0 -> "auto"`, not a `y` offset. See `pitfalls.md` #1 for why.

```tsx
<AnimatePresence>
  {keyboardVisible && (
    <motion.div
      className="keyboard"
      key="keyboard"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
    >
      {/* key rows */}
    </motion.div>
  )}
</AnimatePresence>
```

## 6. Key highlight during ghost typing

Toggle a CSS class per keystroke. Do not drive per-keystroke highlights through motion props; at 20-60ms per character the spring never settles and highlights drop frames. See `pitfalls.md` #3.

```tsx
<div className={`key ${activeKey === key.id ? "key-active" : ""}`}>{key.label}</div>
```

```css
.key { transition: background 0.05s; }
.key-active { background: #9aa0a8; transform: scale(1.08); }
```

## 7. Typed text that outgrows its input

Clip from the left so the caret and newest characters stay visible, like a real input:

```css
.input-typed {
  white-space: nowrap;
  overflow: hidden;
  direction: rtl;      /* clips the left side, keeps the right edge pinned */
  text-align: left;
}
.input-caret {
  display: inline-block;
  width: 2px; height: 16px;
  background: #1264a3;
  animation: blink 1s step-end infinite;
}
```

## 8. Staggered card carousel

```tsx
{cards.map((card, i) => (
  <motion.div
    key={card.name}
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 + i * 0.18, type: "spring", stiffness: 260, damping: 24 }}
  >
```

Give the script an extra 1200-1600ms beat after a carousel message so the stagger finishes before the next step.

## 9. Reaction pop

Delayed scale-in with a bouncy spring, staggered when there are several:

```tsx
<motion.span
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.8 + i * 0.55, type: "spring", stiffness: 400, damping: 18 }}
>
  {emoji}
</motion.span>
```

## 10. Auto-scroll

Scroll to bottom whenever anything that changes content height updates:

```tsx
useEffect(() => {
  chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
}, [visibleMessages, isTyping, keyboardVisible, typedText]);
```

## 11. Device frame entrance

One-time entrance for the whole scene, custom ease for a premium feel:

```tsx
<motion.div
  className="phone-frame"
  initial={{ opacity: 0, y: 40, rotateX: 15 }}
  animate={{ opacity: 1, y: 0, rotateX: 0 }}
  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
>
```
