# CutLog UI Direction

## Core feel
- Editorial, athletic, and personal.
- Warm paper background instead of sterile white.
- Dark ink blocks for moments that should feel committed or focused.
- Accent colors should mean something:
  - burnt orange for calories and action
  - green for protein / progress
  - blue for water

## Product mood
- This should feel like a private performance tool, not a social fitness app.
- More “personal dashboard + training journal” than “consumer calorie counter.”
- The UI should feel disciplined but still warm enough to use multiple times a day.

## Screen ideas for Figma

### 1. Today dashboard
- Large date rail near the top with previous/next day controls.
- Hero summary card with calories left and protein left, not just totals consumed.
- A saved daily ledger section with time-stamped meals.
- Hydration quick-add row that feels tactile and obvious.
- Planned meals lower on the page as support context, not the main focus.

### 2. Photo log flow
- One clean card for note entry and image selection.
- Review state should feel like an “AI draft”:
  - confidence chip
  - meal title
  - explanation text
  - editable macro cards
- Confirmation CTA should explicitly name the selected day.

### 3. Weekly plan
- Treat the week like a stack of disciplined cards, one per day.
- Lock state should feel premium and deliberate, not like a tiny settings toggle.
- Generated meals should be visibly marked but not visually noisy.

### 4. Chat
- More coaching notebook than chatbot.
- Assistant bubbles should feel paper-card like.
- User messages should feel like ink blocks.
- Pending actions should be rendered as action cards, not buried in chat text.

## Component ideas
- `DaySwitcher`
  Rounded strip with left/right controls, center date label, and save-state chip.
- `LedgerRow`
  Time pill, meal title, note, calorie value.
- `GoalSummaryCard`
  “Calories left”, “Protein left”, “Water progress”.
- `ActionChip`
  One consistent pattern for regenerate, swap, lock, and save-state chips.
- `EstimateCard`
  AI review card with image, confidence, editable macros, confirm CTA.

## Figma file structure suggestion
- Page 1: `Foundations`
  - color tokens
  - type scale
  - spacing
  - corner radius system
- Page 2: `Components`
  - cards
  - chips
  - day switcher
  - ledger row
  - chat bubbles
  - tab bar
- Page 3: `Core Screens`
  - Today
  - Log
  - Review Estimate
  - Weekly Plan
  - Chat
- Page 4: `Explorations`
  - more editorial
  - more athletic
  - darker high-focus mode

## Suggested visual references to explore in Figma
- premium sports journaling
- nutrition notebook
- editorial dashboard
- analog paper + digital performance hybrid

## What to avoid
- bright generic fitness gradients
- glossy gamification tropes
- default SaaS cards on white
- overusing purple or neon accents
- tiny hard-to-hit mobile controls
