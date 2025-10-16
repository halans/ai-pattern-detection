# Change Proposal: Add Text File Upload Capability

**Change ID:** `add-file-upload`
**Author:** Codex
**Date:** 2025-10-16  
**Status:** Draft

---

## Why

Users want to analyze longer pieces of writing they already have in documents (lecture notes, essays, reports). Manually copy-pasting content is cumbersome and introduces formatting issues. Providing direct upload support for plain-text formats will streamline the workflow while respecting the existing 20,000-character limit.

---

## What Changes

- **NEW** frontend UI controls to upload `.txt`, `.md`, and `.html` files.
- **NEW** file-processing pipeline in the backend to read, normalize, and validate uploaded content (same character limit and sanitization as text input).
- **UPDATED** API endpoint to accept multipart/form-data for file uploads and reuse the analysis pipeline.
- **UPDATED** validation/reporting to surface file metadata (filename, type) alongside analysis results.

---

## Impact

### Affected Specs
- **MODIFIED** `specs/frontend-ui/` – upload controls, validation messaging.
- **MODIFIED** `specs/file-processing/` – parsing and normalization rules for txt/md/html.
- **MODIFIED** `specs/text-analysis/` – ensure analysis pipeline handles content sourced from files with size constraints.

### Affected Code
- Frontend React components and API client to add file upload option and new request path.
- Backend file parsing utilities (existing or new) for txt/md/html, feeding into analyzer.
- API routes to accept file payloads, enforce size limits, and handle errors gracefully.

### Infrastructure
- No additional infrastructure needed; Cloudflare Worker must handle multipart parsing (possibly via new dependency or custom parser).

---

## Success Criteria

- Users can upload `.txt`, `.md`, `.html` files up to 20,000 characters and receive analysis results identical to manual paste.
- Invalid files (unsupported type, too large, parse errors) return clear validation messages.
- Frontend reflects upload status, shows filename, and resets cleanly on new uploads.

---

## Dependencies

- Existing text normalization and analysis pipeline.
- Multipart/form-data handling library for Cloudflare Workers (e.g., `busboy`, `formdata-parser`).

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| HTML parsing complexity or scripts embedded | Strip scripts/styles, sanitize HTML consistently before analysis |
| Large file uploads impacting performance | Enforce strict 20,000-character post-parse limit and reject earlier if necessary |
| Worker memory/timeouts | Stream file parsing where possible; early exit on limit breach |

---

## Open Questions

- [ ] Should we support drag-and-drop or only file picker for MVP?
- [ ] Do we preserve basic Markdown/HTML structure in the analysis report, or flatten to plain text entirely?
- [ ] Should we expose file metadata (name, size) in the final report UI?

