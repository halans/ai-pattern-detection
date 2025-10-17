# Implementation Tasks: Add Text File Upload Capability

## 1. Frontend
- [x] 1.1 Add file upload control (button + drag-drop if desired) supporting `.txt`, `.md`, `.html` extensions.
- [x] 1.2 Show selected filename, enforce 20,000-character limit post-read, and surface validation errors.
- [x] 1.3 Integrate upload flow with existing analysis request (multipart form) and reset state on completion.

## 2. Backend (File Processing)
- [x] 2.1 Add multipart/form-data parsing in the Worker route.
- [x] 2.2 Implement format-specific parsing:
  - TXT: simple UTF-8 read
  - MD: strip frontmatter/convert to plain text (basic)
  - HTML: sanitize and extract text content
- [x] 2.3 Enforce 20,000-character limit after normalization; return validation errors otherwise.
- [x] 2.4 Reuse text normalization/analyzer pipeline for parsed content.

## 3. API & Reporting
- [x] 3.1 Extend `/api/analyze` or add `/api/analyze/file` to accept file payloads.
- [x] 3.2 Include file metadata (name, type, size after parse) in response metadata.
- [x] 3.3 Update frontend display to show submission source (text vs file).

## 4. Quality
- [x] 4.1 Add unit/integration tests covering successful uploads for each format.
- [x] 4.2 Add tests for size limit breach, unsupported types, and malformed HTML/Markdown.
- [x] 4.3 Update documentation and UI hints to reflect the capability.
