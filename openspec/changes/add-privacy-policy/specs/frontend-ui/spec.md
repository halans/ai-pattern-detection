# Frontend UI Capability - Spec Delta

## ADDED Requirements

### Requirement: Privacy Policy Page

The frontend SHALL provide an accessible privacy policy describing data handling across web app, backend, and browser extension.

#### Scenario: Dedicated policy route
- **WHEN** users navigate to the privacy policy URL
- **THEN** the page renders the latest policy text with headings describing web app, backend API, and browser extension behaviour.

#### Scenario: Discoverable links
- **WHEN** the user views the global navigation or footer
- **THEN** a link to the privacy policy is present and focusable, opening in the same tab.

#### Scenario: Accessibility compliance
- **WHEN** the privacy policy is read using assistive technologies
- **THEN** the page uses semantic headings, readable contrast, and preserves keyboard navigation.
