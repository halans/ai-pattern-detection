# Change Proposal: Add Markdown Download Button

**Change ID:** `add-markdown-download`  
**Author:** Codex  
**Date:** 2025-10-14  
**Status:** Draft

---

## Why

Users can currently export the analysis report as JSON, but the raw structure is difficult to read and share without additional tooling. Providing a Markdown export will let non-technical stakeholders review the findings quickly in tools like email clients, ticketing systems, and documentation wikis.

---

## What Changes

- **NEW**: Add a “Download Markdown” control alongside the existing JSON export on the results view.
- **NEW**: Transform the backend response (classification, scores, pattern breakdown, metadata, warnings) into a readable Markdown report before triggering download.
- **NEW**: Reuse the existing download infrastructure while ensuring UTF-8 safe output and consistent filenames.

---

## Impact

### Affected Specs
- **MODIFIED** `specs/frontend-ui/` – Results view gains an additional export control and formatting rules for Markdown.

### Affected Code
- Frontend React results component and utility functions responsible for export logic.

### Infrastructure
- No infrastructure or build pipeline changes required.

---

## Success Criteria

- Markdown download contains the same information as the JSON export, organized into sections that mirror the UI.
- Export uses semantic Markdown (headers, bullet lists, tables where appropriate) and renders cleanly on GitHub/GitLab/wiki viewers.
- Button state mirrors JSON download behavior (disabled when no results, enabled otherwise).

---

## Dependencies

- Existing results state management and download utilities within the frontend project.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Large reports may exceed browser URL limits | Generate the file client-side using Blob URIs (same as JSON export) |
| Markdown rendering varies by platform | Stick to basic Markdown constructs with broad viewer support |
| Localization and formatting drift | Derive Markdown directly from the analysis result object to avoid duplication |

---

## Open Questions

- [ ] Should we offer both `.md` and `.txt` export options (same content, different extension)?
- [ ] Do we need inline links or formatting hints for patterns (e.g., linking to documentation)?

