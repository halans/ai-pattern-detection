# Change Proposal: Add Light/Dark Theme Toggle

**Change ID:** `add-theme-toggle`
**Author:** Codex
**Date:** 2025-10-16  
**Status:** Draft

---

## Why

The app currently follows system preferences for light/dark mode, but users often want explicit control—especially after the new color palette update. Providing a footer toggle lets users switch themes on demand, improving accessibility and usability in varied lighting conditions.

---

## What Changes

- **NEW** toggle button in the footer to switch between light and dark color palettes.
- **UPDATED** theme management to persist user preference (e.g., localStorage) and update Tailwind `dark` class appropriately.
- **UPDATED** UI styling to ensure both palettes use the new brand colors and maintain sufficient contrast.

---

## Impact

### Affected Specs
- **MODIFIED** `specs/frontend-ui/` – document theme toggle control, accessibility requirements, and preference persistence.

### Affected Code
- Footer component(s) to render toggle button with accessible labeling.
- Theme handling in React (context/hook) to apply `dark` class on `<html>` or `<body>`.
- Possibly CSS adjustments to ensure color tokens work in both themes.

### Infrastructure
- No backend changes. Potential localStorage usage on client.

---

## Success Criteria

- Users can switch themes instantly; state persists across page reloads.
- Toggle is keyboard accessible, has clear focus states, and is announced by screen readers.
- Light/dark palettes maintain contrast ratios and consistent brand colors.

---

## Dependencies

- Existing Tailwind configuration and color palette definitions.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Conflicting with system preference | Initialize with system preference but override with user choice |
| UI flash during theme switch | Add transition or manage class before render |
| Persisted preference not synced | Normalize storage read/write and handle SSR absent storage |

---

## Open Questions

- [ ] Should theme preference sync across devices via backend later?
- [ ] Do we offer a third “auto” option to follow system preference?
- [ ] Should we extend toggle to accessible text labels (e.g., icons + text)?

