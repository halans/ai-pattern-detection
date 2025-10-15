# Change Proposal: Add PDF Download Button

**Change ID:** `add-pdf-download`  
**Author:** Codex  
**Date:** 2025-10-14  
**Status:** Draft

---

## Why

Users can export analysis results as JSON and Markdown, but sharing the report with stakeholders who expect a print-friendly document still takes extra effort. Providing a PDF export that mirrors the Markdown presentation makes it easy to distribute a polished report without additional tooling.

---

## What Changes

- **NEW**: Add a “Download PDF” button alongside the JSON and Markdown export controls in the results view.
- **NEW**: Render the existing Markdown report to PDF on the client, keeping layout and content synchronized across formats.
- **NEW**: Ensure the PDF includes headings, pattern breakdown, metadata, and warnings in a readable format (mirroring Markdown).

---

## Impact

### Affected Specs
- **MODIFIED** `specs/frontend-ui/` – Export controls gain a PDF option with requirements for layout parity.

### Affected Code
- Frontend export utilities to generate Markdown, render it into PDF (likely via a library such as `pdfmake` or `jsPDF` + `markdown-it`), and trigger download.
- Results component to surface the new control.

### Infrastructure
- No backend changes; potential increase in frontend bundle size (must be evaluated).

---

## Success Criteria

- PDF download contains the same information and section ordering as the Markdown export.
- Rendering preserves basic styling (headings, bullet lists for patterns, tables if introduced later).
- Button states mirror JSON/Markdown behavior (enabled only when analysis results are available).
- Export completes within ~1 second for typical reports (<5,000 characters).

---

## Dependencies

- Existing analysis result state and Markdown generator.
- Addition of a PDF generation library that can run in the browser (e.g., `pdfmake`, `jspdf` with markdown plugin, or `@react-pdf/renderer`).

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Large PDF library increases bundle size | Evaluate library footprint; consider dynamic import or lightweight options |
| Markdown-to-PDF feature parity | Render Markdown to HTML first and then to PDF to avoid divergent paths |
| Performance issues on low-powered devices | Optimize generation flow, keep styling minimal, lazy-load PDF tooling |

---

## Open Questions

- [ ] Should we offer layout customization (e.g., include logo, header/footer) or keep it minimal?
- [ ] Should PDF generation happen client-side only, or do we anticipate a backend service in future?

