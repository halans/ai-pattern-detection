# Implementation Tasks: PDF Download Button

## 1. Frontend Infrastructure
- [x] 1.1 Select and install a lightweight browser-compatible PDF tooling strategy (e.g., `pdfmake`, `jspdf` with markdown support, or convert Markdown to HTML + `html2pdf.js`).
- [x] 1.2 Introduce a utility that transforms the existing Markdown report into PDF bytes, ensuring section parity.
- [x] 1.3 Gate the PDF tooling behind dynamic imports if bundle size impact is significant.

## 2. UI Integration
- [x] 2.1 Add a “Download PDF” button next to JSON and Markdown actions in the results view.
- [x] 2.2 Disable the button when no analysis result is available (consistent with other exports).
- [x] 2.3 Wire the button to the new PDF generation utility and trigger a blob download with `.pdf` extension.

## 3. Quality
- [x] 3.1 Create unit tests covering Markdown-to-PDF conversion (e.g., ensure headings/sections exist).
- [x] 3.2 Add integration test verifying that the button calls the PDF export handler when results are present.
- [x] 3.3 Manually verify PDF output for typical and edge-case reports (long pattern lists, warnings).
