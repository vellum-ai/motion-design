# motion-design

A Vellum plugin that teaches your assistant to build polished UI animations with [Motion](https://motion.dev) for React.

Ask for an animated product mockup, a chat conversation replay, a typing effect, or a staggered card reveal, and the assistant follows the patterns in this plugin instead of improvising. The patterns come from a real build: an animated Slack-style chat inside a phone frame, with ghost typing on a slide-up keyboard, a typing indicator, a card carousel, and a link preview.

## What it ships

One skill, `motion-design`, containing:

- **SKILL.md**: the workflow the assistant follows, from project setup to visual verification.
- **references/patterns.md**: copy-ready code for the core patterns (script-driven playback, springs, stagger, ghost typing, AnimatePresence enter/exit).
- **references/pitfalls.md**: bugs that cost real debugging time, and how to avoid them (overflow clipping, React strict mode, rapid state flips).
- **examples/chat-mockup**: a complete working Vite + React + Motion project you can run with `bun install && bun run dev`.

## Install

```
assistant plugins install vellum-ai/motion-design
```

Or copy the directory into your workspace at `plugins/motion-design/`.

## How to use

Once installed, just ask your assistant for an animation. The skill activates automatically when the request matches. For example:

- "Build an animated mockup of a chat conversation between two people"
- "Make a demo animation of my app's onboarding flow"
- "Add a typing effect and staggered card reveal to this React component"
- "Create a looping product animation I can screen-record for a landing page"

The assistant scaffolds a Vite + React project, pulls the right patterns from the skill's references (script-driven playback, springs, ghost typing, enter/exit transitions), and verifies the result visually in a browser before calling it done.

To point it at the worked example directly: "use the chat-mockup example from the motion-design plugin as a starting point."

## The example

The bundled example animates a Slack mobile conversation on loop: messages arrive with spring physics, a typing indicator bounces, a keyboard slides up and ghost-types a reply character by character, a villa carousel staggers in, and a link preview card pops with a reaction. Run it:

```
cd skills/motion-design/examples/chat-mockup
bun install
bun run dev
```

## License

MIT
