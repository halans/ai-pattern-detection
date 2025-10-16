# File Processing Capability - Spec Delta

## ADDED Requirements

### Requirement: Plain Text File Handling

The system SHALL process uploaded `.txt` files.

#### Scenario: Parse TXT file
- **WHEN** a user uploads a `.txt` file
- **THEN** the system reads the file as UTF-8 text
- **AND** forwards the content to the normalization stage.

---

### Requirement: Markdown File Handling

The system SHALL process uploaded `.md` files.

#### Scenario: Parse Markdown file
- **WHEN** a user uploads a `.md` file
- **THEN** the system strips frontmatter (if present) and converts Markdown to plain text (basic block-level stripping)
- **AND** forwards the content to the normalization stage.

---

### Requirement: HTML File Handling

The system SHALL process uploaded `.html` files.

#### Scenario: Parse HTML file
- **WHEN** a user uploads a `.html` file
- **THEN** the system sanitizes and extracts readable text (removing scripts/styles/tags)
- **AND** forwards the content to the normalization stage.

---

### Requirement: File Size Enforcement

The system SHALL enforce content length limits for uploaded files.

#### Scenario: Reject files exceeding character limit after parsing
- **WHEN** the extracted text exceeds 20,000 characters
- **THEN** the system returns a validation error and aborts processing.

