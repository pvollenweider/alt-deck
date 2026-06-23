---
target: app/session/page.tsx
total_score: 23
p0_count: 0
p1_count: 3
timestamp: 2026-06-23T18-51-50Z
slug: app-session-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Phase banner + timer strong; no ARIA announcement when auto-advance fires |
| 2 | Match System / Real World | 3 | French throughout; STR/DIS/PER are English abbreviations in French UI |
| 3 | User Control and Freedom | 2 | One-directional phase machine; no undo; no end state |
| 4 | Consistency and Standards | 2 | Difficulty dots hardcoded terracotta in SessionCard, breaking nature encoding from CardDisplay |
| 5 | Error Prevention | 2 | ALÉATOIRE silently replaces session mid-PLAYING, no confirmation |
| 6 | Recognition Rather Than Recall | 3 | Phase labels clear; STR/DIS/PER require domain recall |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcut for phase advance — critical for projector use |
| 8 | Aesthetic and Minimalist Design | 3 | Very clean; action bar crowded on mobile (4 buttons) |
| 9 | Error Recovery | 2 | No recovery from accidental phase advance or ALÉATOIRE; sessionStorage only |
| 10 | Help and Documentation | 1 | No tooltip for Tension value; no phase-flow explanation for first-time facilitators |
| **Total** | | **23/40** | **Acceptable — significant improvements before live sessions** |

## Anti-Patterns Verdict

Not AI-sloppy. System has clear voice. Detector: 1 warning (border-l-4 — documented functional exception), 2 radius advisories (2pt in print CSS, equivalent to system xs token), 2 shadow-color advisories (rgba values not in DESIGN.md sidecar tokens).

## Priority Issues

**[P1]** Difficulty dots in SessionCard hardcoded to terracotta (#b84a30) regardless of card nature (line 344). CardDisplay correctly uses NATURE_DOT[card.nature]. Breaks nature color encoding at the most visible surface. Fix: replace hardcoded value with NATURE_DOT[card.nature].

**[P1]** No end-of-session state. Phase machine terminates at PLAYING with no resolution, no next action, no session-complete UI. Peak-end rule failure. Fix: add COMPLETE phase with "SESSION TERMINÉE" banner and "NOUVELLE SESSION" CTA.

**[P1]** ALÉATOIRE button silently replaces live session with no confirmation (line 482). Accidental tap during PLAYING ends the session in progress. Fix: guard against active phases or hide button when phase !== IDLE.

**[P2]** No keyboard shortcut for phase advance. Spacebar should call handleAdvancePhase/handleStartSession. Critical for facilitators running session on projector without mouse access.

**[P2]** STR/DIS/PER abbreviations are English in a French interface (line 352). Replace with French equivalents or single letters.

**[P2]** No ARIA live region for phase transitions. When timer auto-advances, screen reader gets no announcement.

## Persona Red Flags

Facilitateur en performance: no spacebar to advance phase, ALÉATOIRE is dangerous and prominent, no session-end signal.
Sam (Accessibility): focus doesn't move to new CTA on phase advance, "● LIVE" has no accessible label.
Riley (Stress Tester): closure-captured session in timer effect may use stale data if session updated between mount and timer fire.

## Minor Observations

Loading state missing role="status". Mobile status bar pipes missing on small screens. rounded-full on dots is undocumented system exception. Two shadow values (rgba(0,0,0,0.06) and rgba(0,0,0,0.08)) not in DESIGN.md sidecar.
