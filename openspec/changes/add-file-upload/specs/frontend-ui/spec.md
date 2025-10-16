# Frontend UI Capability - Spec Delta

## MODIFIED Requirements

### Requirement: User Input Methods

The frontend SHALL provide mechanisms for users to submit text for analysis.

#### Scenario: Upload textual files
- **GIVEN** the user selects a `.txt`, `.md`, or `.html` file
- **WHEN** the file is uploaded through the UI
- **THEN** the UI reads the file client-side, validates size (≤20,000 characters after processing), and sends it to the analysis API.

#### Scenario: File validation errors
- **WHEN** the user selects an unsupported type or the processed text exceeds 20,000 characters
- **THEN** the UI displays a descriptive error message and rejects the upload.

---

### Requirement: Submission Feedback

The frontend SHALL surface submission details to the user.

#### Scenario: Display uploaded file metadata
- **WHEN** the user uploads a file successfully
- **THEN** the UI shows the filename and type prior to analysis
- **AND** allows the user to clear or replace the file.

