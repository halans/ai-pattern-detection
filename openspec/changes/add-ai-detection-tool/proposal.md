# Change Proposal: Add Slop Detection Tool

**Change ID:** `add-ai-detection-tool`
**Author:** Halans
**Date:** 2025-10-13
**Status:** Draft

---

## Why

With the proliferation of generative AI systems, organizations, educators, and content moderators need reliable tools to distinguish between human-written and AI-generated text. Current ML-based solutions are overly complex and require significant infrastructure.

This change introduces a **simple, pattern-based AI detection system** that analyzes text using regex-based linters to identify common AI writing patterns—no ML inference required.

---

## What Changes

- **NEW**: Pattern-based text analysis using regex linters (no ML/transformers)
- **NEW**: Comprehensive detection patterns for AI signals:
  - Significance statements ("stands as", "serves as", "testament to")
  - Cultural heritage clichés ("rich tapestry", "profound legacy")
  - Editorializing phrases ("it's important to note", "worth mentioning")
  - Negative parallelisms ("not only...but also", "not just...rather")
  - AI meta-text ("as an AI", "as of my last update")
  - Formatting patterns (emoji headings, excessive bold/italics, em-dash spam)
  - Placeholder templates and collaborative phrases ("let me know if", "I hope this helps")
- **NEW**: File upload and parsing for PDF, DOCX, TXT, HTML, and Markdown
- **NEW**: Scoring system based on pattern frequency and severity weights
- **NEW**: REST API endpoints for analysis and report retrieval
- **NEW**: Frontend interface for text input, file upload, and result visualization

---

## Impact

### Affected Specs
- **NEW** `specs/text-analysis/` - Pattern-based detection logic and scoring algorithm
- **NEW** `specs/file-processing/` - Multi-format document parsing and text extraction
- **NEW** `specs/reporting/` - Output format and pattern breakdown visualization

### Affected Code
- New backend API service (Cloudflare Workers with TypeScript)
- New frontend application (React/TypeScript with Vite)
- Optional caching layer for processed results

### Infrastructure
- Cloudflare Workers deployment (primary compute)
- Optional KV storage for caching (no database required)
- Monitoring via Cloudflare Analytics

---

## Success Criteria

- Pattern detection coverage: ≥20 unique AI signal patterns
- Average response time: ≤500ms per 1,000 words
- Support for 5 file formats (TXT, PDF, DOCX, HTML, MD)
- Zero data retention (ephemeral processing only)
- Cloudflare Workers CPU time: <50ms per request

---

## Dependencies

- Cloudflare Workers platform
- File parsing libraries (pdf-parse, mammoth, markdown-it)
- No ML libraries required
- No GPU/Kubernetes infrastructure needed

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Pattern evasion as AI writing evolves | Maintain updateable pattern registry, community contributions |
| False positives on technical writing | Weight patterns by severity, allow threshold tuning |
| Privacy concerns with file uploads | Ephemeral processing only, no storage or logging of content |
| Pattern regex performance at scale | Pre-compile patterns, use streaming for large texts |

---

## Open Questions

- [ ] Should pattern weights be configurable via API/UI?
- [ ] Should we support batch analysis via API?
- [ ] What rate limiting should be implemented?
- [ ] Should we provide pattern contribution/suggestion mechanism?
