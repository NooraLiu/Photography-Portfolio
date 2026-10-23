---
description: learned preferences, project conventions, and Do-Not-Repeat rules
budget_tokens: 2000
---
# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-09-23

## User Preferences

<!-- How the user likes things done. Code style, tools, patterns, communication. -->

- **Visual design: prefers minimal/restrained over explanatory.** Shown three app-icon
  variants (aperture+checkmark, aperture with one gold blade, pure aperture), chose the
  pure aperture — rejecting the versions that added a semantic element to spell out
  function. Offer the clean geometric option; don't assume added meaning-signals win.

## Key Learnings

- **Project:** photography-portfolio
- **Description:** Photography Portfolio with image upload

## Do-Not-Repeat

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
<!-- Format: [YYYY-MM-DD] Description of what went wrong and what to do instead. -->

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->

- **[2026-10-02] App icon = pure 6-blade iris**, geometry derived from the lightbox
  shutter animation in script.js:870 (N=6, blade lines offset by half a blade, `HALF = pi/N`),
  palette #1a1a1a / #c9a962 from styles.css. Two renderings ship: master (>=96px) and a
  small variant (<=64px) with a heavier gold ring and lighter blades, because at 32px the
  thin ring and dark-on-dark blades turned to mud.
