# Frontend UI Capability - Spec Delta

## MODIFIED Requirements

### Requirement: Result Export Controls

The results view SHALL provide export controls for sharing analysis output.

#### Scenario: Download PDF report
- **GIVEN** an analysis result is present
- **WHEN** the user clicks “Download PDF”
- **THEN** a `.pdf` file is downloaded
- **AND** the PDF mirrors the Markdown report content and section ordering.

#### Scenario: PDF download disabled without results
- **GIVEN** no analysis result is currently available
- **WHEN** the user views the export controls
- **THEN** the “Download PDF” button is disabled.
