# chat-mockup

A complete worked example for the motion-animations skill: a Slack-style mobile conversation animated on loop inside a phone frame.

What it demonstrates:

- Script-driven playback (the conversation is a data array, one async effect plays it)
- Typing indicator with phase-shifted bouncing dots
- Ghost typing: a keyboard slides up and types the reply character by character with live key highlights
- Send button press feedback
- Staggered card carousel entrance
- Link preview card with a delayed reaction pop
- Auto-scroll as content grows
- Loop with a held final frame

Run it:

```bash
bun install
bun run dev
```

The `App` component takes a `ghostTyping` prop (default `true`). Set it to `false` to skip the keyboard sequence and play an extended script where every message just arrives.
