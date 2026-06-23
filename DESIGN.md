---
name: ALT-DECK
description: Constraint engine for improvised music workshops — rigorous, experimental, austere.
colors:
  terracotta: "#b84a30"
  terracotta-deep: "#8c3622"
  cobalt: "#2d5fa0"
  forest: "#2d7a53"
  ochre: "#9a7820"
  ink: "#1a1a18"
  ink-mid: "#4f4f49"
  ink-muted: "#6b6560"
  surface: "#faf7f4"
  ground: "#f5f0eb"
  border: "#ddd5cc"
typography:
  display:
    fontFamily: "Poppins, Arial, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.15em"
  headline:
    fontFamily: "Poppins, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.1em"
  title:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Poppins, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Poppins, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.15em"
rounded:
  none: "0px"
  xs: "2px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  "2xl": "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "10px 24px"
  button-primary-hover:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.surface}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  badge-nature:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.surface}"
    rounded: "{rounded.xs}"
    padding: "4px 8px"
  badge-role:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.xs}"
    padding: "4px 8px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "20px"
---

# Design System: ALT-DECK

## 1. Overview

**Creative North Star: "The Rehearsal Room"**

ALT-DECK's visual language is that of a space designed for work, not presentation. Bare walls. A music stand. No decoration that doesn't serve the session. The interface is spare, utilitarian, and confident — a professional working surface that treats its users as capable adults operating under deliberate pressure.

Color is structural, not decorative. The warm ground (`#f5f0eb`) and off-white surface (`#faf7f4`) don't carry warmth as a style choice — they are the neutral room. The terracotta accent (`#b84a30`) functions like a highlighter pen on a score: it marks what matters. The four nature colors (terracotta, cobalt, forest, ochre) are functional category signals, not visual embellishment.

Type is the primary design material. Card titles render in monospace at large weights; labels run in tight tracked uppercase. The Poppins + Lora pairing separates two registers: the systematic (constraints, scores, status) and the human (descriptions, rules text, prose context). Every size and weight decision is a hierarchy decision, not an aesthetic one.

This system explicitly rejects the productivity-tool aesthetic (Notion's neutral sans-serif domesticity), the music streaming aesthetic (dark album-art grids, consumer entertainment UI), and academic paper formatting (dense type, institutional passivity).

**Key Characteristics:**
- Zero-radius everywhere. No rounded corners. The interface has edges.
- Uppercase tracking (0.15em–0.20em) for all labels and category signals.
- Monospace for card titles — the constraint as notation.
- Subtle shadow vocabulary (ambient, never structural) — surfaces float just enough to read at a distance.
- Left-border on cards is functional (nature color signal), not decorative.
- Color restricted to category signals and one accent. Nothing else competes.

## 2. Colors: The Working Palette

Four functional layers: ground, surfaces, ink, and signal.

### Primary
- **Terracotta** (`#b84a30`): The system's one voice. Used for accent marks, active nav states, the `border-left` category signal on STRUCTURAL cards, risk indicators at level 3, the underline accent on hero headings, and interactive focus rings. Hover state for primary actions.
- **Terracotta Deep** (`#8c3622`): Pressed/hover state for terracotta elements. Never used as a standalone color.

### Secondary
- **Cobalt** (`#2d5fa0`): Category signal for COGNITIVE cards exclusively.
- **Forest** (`#2d7a53`): Category signal for SONIC cards exclusively.
- **Ochre** (`#9a7820`): Category signal for PHYSICAL cards and risk level 2 indicators.

### Neutral
- **Ink** (`#1a1a18`): Primary text, headings, bold data values. Also used as primary button background.
- **Ink Mid** (`#4f4f49`): Body text on surface backgrounds. Passes 4.5:1 on `#faf7f4`.
- **Ink Muted** (`#6b6560`): Secondary text, labels, metadata. 4.5:1 against ground; use only for decorative or secondary content on surface.
- **Surface** (`#faf7f4`): Card backgrounds, nav background. One step lighter than ground.
- **Ground** (`#f5f0eb`): Page body background. The room.
- **Border** (`#ddd5cc`): All dividers, card borders, input strokes. Never solid, always structural.

### Named Rules
**The One Voice Rule.** Terracotta appears on ≤15% of any screen. Its presence marks active state, danger, or the primary accent; its scarcity is the system's authority. Do not use it for decoration.

**The Category Rule.** The four nature colors (terracotta, cobalt, forest, ochre) are reserved for card category signals. No other UI element may use them except the `border-left` stripe on cards and the nature badge chip. Their meaning is categorical; re-using them elsewhere corrupts the encoding.

## 3. Typography

**Display Font:** Poppins (with Arial, sans-serif fallback) — geometric sans, bold weights, tight tracked uppercase.
**Body Font:** Poppins (same family, lighter weights, normal tracking) for prose.
**Accent Font:** Lora (with Georgia, serif fallback) — used for card descriptions and rules text, where the constraint needs a human, literary register.
**Monospace:** System mono or Poppins font-weight 700 with `font-mono` — used for card titles to signal "this is the notation."

**Character:** Poppins provides the systematic register — clinical, precise, institutional confidence. Lora provides the human register — the constraint written in prose, not shorthand. They don't compete; they divide the labor. The pair runs at opposite ends of a score sheet.

### Hierarchy
- **Display** (Bold 700, `clamp(2rem, 5vw, 3rem)`, lh 1.1, tracking 0.15em, uppercase): Page hero titles (`ALT-DECK`). One instance per page.
- **Headline** (Bold 700, `1.25rem`, lh 1.2, tracking 0.1em, uppercase, mono): Card titles. The constraint name. Must read at 3m on a projector.
- **Title** (Lora Medium 500, `1rem`, lh 1.4): Card description, section prose headers.
- **Body** (Poppins 400, `0.875rem`, lh 1.6): Card rules text, navigation context. Max 65ch line length.
- **Label** (Poppins Bold 700, `0.75rem`, lh 1, tracking 0.15em, uppercase): Category badges, score labels, axis names, nav items.

### Named Rules
**The Mono Rule.** Card titles always render in monospace. The constraint is notation. Prose fonts are for descriptions and rules; the title is the code.

**The Uppercase Ceiling.** Uppercase tracking applies only to labels (12px and below) and display headings. Body copy and Lora descriptions are set in sentence case. All-caps body text fails at distance.

## 4. Elevation

This system is flat by default. Surfaces are distinguished by background color (`#f5f0eb` vs `#faf7f4`), not by shadow. Shadow appears only as an ambient functional signal — faint, diffuse, indicating that a surface is interactive or needs to read at distance.

The rehearsal room has no high-gloss finishes. Nothing lifts dramatically. Shadow is dust, not drama.

### Shadow Vocabulary
- **Ambient low** (`0 2px 12px rgba(0,0,0,0.05)`): Stat blocks, navigation grid containers. Barely perceptible at desktop; helps surfaces separate on a projector.
- **Ambient card** (`0 4px 16px rgba(0,0,0,0.06)`): Individual cards. Same intent — slight lift for readability at distance.
- **Nav ambient** (`0 0 18px rgba(0,0,0,0.07)`): Navigation bar. One persistent surface that reads above the page.

### Named Rules
**The Flat-By-Default Rule.** No surface adds a shadow to signal status, hierarchy, or importance. Shadows exist only where distance-readability requires it — cards on projectors, nav separation. If you're using shadow for aesthetics, remove it.

## 5. Components

### Buttons
The button is restrained: confidence through understatement, not heavy chrome.
- **Shape:** Zero radius (square corners). No exceptions.
- **Primary (dark):** Ink background (`#1a1a18`), surface text (`#faf7f4`). Padding `10px 24px`. Label at 0.75rem, tracking 0.1em, uppercase.
- **Primary hover:** Background transitions to terracotta (`#b84a30`). Transition 150ms ease-out.
- **Ghost:** Transparent background, ink-muted text (`#6b6560`). Border `1px solid #ddd5cc`. Hover: text to ink, border to `#4f4f49`.
- **Focus:** `outline: 2px solid #b84a30; outline-offset: 2px`. No box-shadow alternative.

### Chips / Badges
Two types, both with `border-radius: 2px` (barely-round, almost-square):
- **Nature badge:** Solid category color background, white text, 0.75rem bold, tracking 0.15em, uppercase.
- **Role badge:** Ground background (`#f5f0eb`), ink-muted text, border `1px solid #ddd5cc`.

### Cards (CardDisplay)
The card is the primary content object. Everything else is infrastructure.
- **Corner style:** No radius. The card has edges.
- **Left border:** 4px solid in the card's nature color. This is the one place the category colors appear as a structural border. Intentional; functional.
- **Background:** Surface (`#faf7f4`).
- **Shadow:** Ambient card (`0 4px 16px rgba(0,0,0,0.06)`).
- **Internal padding:** `20px` (default), `32px` (large/session view).
- **Title:** Monospace, bold, tracked uppercase.
- **Description:** Lora text, `0.875rem`, ink-mid (`#4f4f49`).
- **Rules list:** Left-bordered with `2px solid #ddd5cc`, ink-muted text, `0.75rem`.
- **Difficulty dots:** 5 dots, filled with nature color, empty with border color.
- **Risk badge:** Outlined, not filled. Ink, ochre, or terracotta depending on risk level.

### Navigation
- **Background:** Surface (`#faf7f4`). Bottom border `1px solid #ddd5cc`. Ambient nav shadow.
- **Logo:** SVG mark + separator `—` + "DECK" label in tracked uppercase.
- **Nav links:** `0.75rem`, tracking `0.2em`, uppercase. Default: ink-muted. Hover: ink. Active: terracotta, bold.
- **No underlines, no hover backgrounds.** State is carried by color and weight alone.
- **Mobile:** Logo row + horizontal scrollable nav items. No hamburger menu.

### Grid Containers (Stats, Navigation Sections)
Flat bordered grid structures, no radius, surface background. Cells divided by `1px solid #ddd5cc`. Ambient low shadow. This is the system's version of a table — the constraint as ledger.

### Signature Component: Session Display
Large-format dual card view for projector use. Two `CardDisplay` in `size="large"` mode, padding `32px`, title `text-3xl`, description `text-base`. The session view has no chrome; the cards take the full screen. Background stays ground (`#f5f0eb`). No shadows heavier than ambient card.

## 6. Do's and Don'ts

### Do:
- **Do** use zero border-radius everywhere. The square edge is a deliberate system choice, not an oversight.
- **Do** set card titles in monospace. They are notation, not prose.
- **Do** reserve terracotta for active states, risk signals, and the primary accent mark only.
- **Do** use the four nature colors (terracotta, cobalt, forest, ochre) for category signals only — `border-left`, nature badges, difficulty dots.
- **Do** set all labels and nav items in uppercase with 0.15em–0.20em tracking at 0.75rem.
- **Do** use Lora for card descriptions and constraint prose — the human register belongs in serif.
- **Do** test card text at 3m distance. If the contrast isn't clear, increase the text weight or darken the color, not the background.
- **Do** use tonal layering (surface vs. ground) to separate surfaces. Shadows are secondary.
- **Do** include `outline: 2px solid #b84a30; outline-offset: 2px` on all interactive focus states.

### Don't:
- **Don't** use a SaaS / Notion-style aesthetic: neutral geometric sans throughout, soft rounded corners, card grids with icons. This system is categorically not a productivity tool.
- **Don't** use music streaming UI patterns (dark mode with album art grids, consumer entertainment layouts). The rehearsal room is not a streaming service.
- **Don't** use academic / institutional formatting (dense body text blocks, paper-white backgrounds, passive tone).
- **Don't** apply `border-radius` above `2px` to any component. Use `2px` only where barely-round is needed; default is `0`.
- **Don't** add color for decoration. If a color value isn't encoding category, state, risk, or the primary accent, remove it.
- **Don't** use gradient text (`background-clip: text`). The system has one accent color; gradient text dilutes it.
- **Don't** use glassmorphism. The rehearsal room has no frosted glass.
- **Don't** add new sans-serif fonts. Poppins carries the system register; adding a second sans creates a false sibling. Pair on the Poppins/Lora contrast axis.
- **Don't** use side-stripe borders (`border-left` or `border-right` > `1px`) for decoration. The card's `border-left: 4px` is the one functional exception — it encodes nature category. No other element uses a side stripe.
- **Don't** soften copy. The interface is declarative. "Deux cartes. Une session. Pas de négociation." is the register. Don't rewrite constraints as suggestions.
