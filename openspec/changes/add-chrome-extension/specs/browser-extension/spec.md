# Browser Extension Capability - Spec Delta

## ADDED Requirements

### Requirement: Chrome Extension Sidebar

The system SHALL provide a Chrome extension that captures webpage text and displays Slop Detector results in a side panel.

#### Scenario: Capture highlighted text
- **WHEN** the user highlights ≥100 characters and activates the extension
- **THEN** the extension submits the selection to the analyzer API
- **AND** the sidebar renders the JSON response (classification, score, metadata) in a human-readable format (like the web app) with loading/error states.

#### Scenario: Capture full page
- **WHEN** no text is selected and the extension is triggered
- **THEN** the extension extracts readable page text (stripping scripts/styles) and submits it, provided the 100-character minimum is met.

#### Scenario: Handle short selections
- **WHEN** the captured text is shorter than 100 characters
- **THEN** the extension surfaces an inline message prompting the user to select more content.

### Requirement: Authentication & Permissions

The extension SHALL respect Chrome Manifest V3 policies and only request necessary permissions.

#### Scenario: Minimal permissions
- **WHEN** the extension is installed
- **THEN** it requests `activeTab`, `scripting`, and the backend host permission, avoiding blanket `<all_urls>` host access if not required.

#### Scenario: Side panel availability
- **WHEN** the user clicks the extension action
- **THEN** the side panel opens using Chrome's side panel API
- **AND** the panel persists across navigation until manually closed.
