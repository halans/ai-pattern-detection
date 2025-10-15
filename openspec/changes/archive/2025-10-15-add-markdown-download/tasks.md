# Implementation Tasks: Markdown Download Button

## 1. Frontend UI
- [x] 1.1 Add a “Download Markdown” button beside the existing JSON export control.
- [x] 1.2 Disable the button when no analysis result is available (mirrors JSON behavior).
- [x] 1.3 Trigger a shared export handler that receives the current `AnalysisResult`.

## 2. Markdown Generation
- [x] 2.1 Create a utility to convert an `AnalysisResult` into Markdown (classification, score, patterns by severity, metadata, warnings).
- [x] 2.2 Ensure Markdown is UTF-8 safe and uses consistent headings / bullet lists for readability.
- [x] 2.3 Add unit tests covering key transformation cases (results with/without patterns, warnings, etc.).

## 3. Integration
- [x] 3.1 Hook the Markdown exporter into the results component and download pipeline (Blob download with `.md` extension).
- [x] 3.2 Add integration tests verifying the button invocation and generated file content snapshot.
