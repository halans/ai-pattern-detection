# Frontend UI Capability - Spec Delta

## MODIFIED Requirements

### Requirement: Result Export Controls

The results view SHALL provide export controls for sharing analysis output.

#### Scenario: Download JSON report (unchanged)
- _Existing behavior maintained._

#### Scenario: Download Markdown report
- **GIVEN** an analysis result is present
- **WHEN** the user clicks “Download Markdown”
- **THEN** a `slop_report.md` file is downloaded
- **AND** the file contains the current analysis data formatted as Markdown with readable sections for classification, scores, pattern breakdown, metadata, and warnings.

#### Scenario: Markdown download disabled without results
- **GIVEN** no analysis result is currently available
- **WHEN** the user views the export controls
- **THEN** the “Download Markdown” button is disabled.

