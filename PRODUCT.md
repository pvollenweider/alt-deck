# Product

## Register

brand

## Users

Two roles, equally important:

- **Workshop facilitators** (organizers, composers, pedagogues): set up sessions beforehand, select cards, configure parameters, display on a projector or shared screen in the room.
- **Musician participants**: read constraints off a shared display during live performance. Need clarity at a distance, under dim or variable ambient light.

Context: a physical room with a group of musicians. The tool runs during the session — it is part of the performance environment, not a post-session report.

## Product Purpose

ALT-DECK is a constraint engine for improvised music workshops. It generates and validates sessions by combining two or three cards from a 45-card deck, each carrying difficulty scores across three axes (structure, disorientation, performance). The tool enforces composition rules so facilitators can't accidentally build an unbalanced or impossible session.

Success looks like: a facilitator arrives at a session, pulls up ALT-DECK, generates a valid pair in under a minute, and the display is readable from across the room with no ambiguity about what the constraints are.

## Brand Personality

Rigorous, experimental, austere.

Voice: terse, declarative. No hedging. Constraints are not suggestions. The interface treats musicians as capable adults operating under deliberate pressure.

Emotional goal: focused intensity — not anxiety, not playfulness. The feel of a score, not an app.

## References

- **altsessions.ch**: The parent organization's site. Visual and editorial decisions made for ALT-DECK should feel coherent with that identity.
- **Avant-garde record labels (Shelter Press, PAN)**: Oblique, graphic, typographically strong. The constraint IS the art — the format makes that legible.
- **Oulipo**: The rule system as aesthetic object. Structure and play coexist.

## Anti-references

- Corporate SaaS / Notion-style: neutral, productivity-tool aesthetic. Too domestic.
- Music streaming apps (Spotify, Apple Music): dark album-art grids, consumer entertainment UI.
- Academic / institutional: paper-white, dense text, conference-proceedings look. Too passive.

## Design Principles

1. **The constraint is the content.** Cards and their rules are the primary visual object. Everything else recedes.
2. **Readable at distance, in any light.** Contrast and scale must work on a projector in a dim room, not just a laptop screen at a desk.
3. **Terse and declarative.** No instructional copy that softens the constraint. The interface speaks with the same authority as the session rules.
4. **System integrity over decoration.** Visual decisions reinforce the logic of the engine (difficulty axes, tension, composition rules), not generic "music app" aesthetics.
5. **Earned warmth.** The terracotta accent and serif type carry personality without drifting into craft-fair warmth or editorial nostalgia.

## Accessibility & Inclusion

- WCAG AA minimum (4.5:1 body text, 3:1 large text and UI components).
- Projector legibility: effective contrast at distance means aiming above the 4.5:1 floor where possible, especially for card text and constraint labels.
- Keyboard navigable for facilitators setting up sessions.
- Reduced motion: animations (if any) must have `prefers-reduced-motion` alternatives.
