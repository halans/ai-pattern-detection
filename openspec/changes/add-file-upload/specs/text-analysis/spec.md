# Text Analysis Capability - Spec Delta

## MODIFIED Requirements

### Requirement: Text Input Sources

The analysis pipeline SHALL accept normalized text from multiple sources.

#### Scenario: Analyze uploaded text file content
- **WHEN** text is sourced from an uploaded `.txt`, `.md`, or `.html` file
- **THEN** the normalization stage processes it identically to pasted text (whitespace cleanup, HTML stripping, etc.)
- **AND** the analyzer runs without format-specific differences.

#### Scenario: Enforce character limit after parsing
- **WHEN** the parsed text exceeds 20,000 characters
- **THEN** the system returns a validation error and does not run analysis.

