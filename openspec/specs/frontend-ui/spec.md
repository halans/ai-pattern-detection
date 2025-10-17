# frontend-ui Specification

## Purpose
Document user-facing UI requirements that govern theme controls, accessibility, and other interaction details delivered by the frontend.
## Requirements
### Requirement: Theme Control

The application SHALL allow users to choose between light and dark color themes.

#### Scenario: Toggle theme via footer control
- **WHEN** the user activates the footer toggle button
- **THEN** the application switches between light and dark palettes instantly
- **AND** focus remains on the toggle after activation.

#### Scenario: Persist theme preference
- **WHEN** the user revisits the site
- **THEN** the previously selected theme is restored (overriding system preference).

---

### Requirement: Accessibility of Theme Toggle

The theme toggle SHALL be accessible to keyboard and screen reader users.

#### Scenario: Accessible theme toggle
- **WHEN** the toggle receives focus
- **THEN** it has a visible focus style and exposes an accessible name describing the current state (e.g., “Switch to dark theme”).

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

### Requirement: Keyboard Navigation

The application SHALL be fully operable with a keyboard.

#### Scenario: Tab order follows layout
- **WHEN** the user navigates using Tab/Shift+Tab
- **THEN** focus moves through interactive elements in a logical, top-to-bottom order.

#### Scenario: Visible focus indicators
- **WHEN** an element receives keyboard focus
- **THEN** a visible focus style is present (meeting contrast requirements) in both light and dark themes.

#### Scenario: Skip navigation
- **WHEN** the user presses Tab from the top of the page
- **THEN** a “Skip to content” link appears, allowing the user to jump to the main analysis area.

---

### Requirement: Accessible Components

UI components SHALL expose appropriate semantics for assistive technologies.

#### Scenario: Form controls
- **WHEN** users interact with inputs, buttons, or file uploads
- **THEN** each control has an accessible name (via label or aria-label) and relevant instructions.

#### Scenario: Results reporting
- **WHEN** analysis results render
- **THEN** pattern groups and metadata are presented with clear headings/roles (lists, tables) and can be visited via keyboard.

---

### Requirement: Dynamic Updates

The UI SHALL announce key updates for screen readers.

#### Scenario: Analysis completion
- **WHEN** an analysis finishes
- **THEN** the system triggers an accessible announcement (e.g., aria-live region) summarizing completion.

### Requirement: Social Preview Metadata

The application SHALL expose Open Graph metadata so shared links render a branded preview.

#### Scenario: Base OG tags present
- **WHEN** the root document (`index.html`) is delivered
- **THEN** the head contains `og:title`, `og:description`, `og:type`, and `og:url` meta tags that describe the Slop Detector experience.

#### Scenario: Preview image reference
- **WHEN** the page is shared on an Open Graph consumer (e.g., Facebook, X, LinkedIn)
- **THEN** the metadata references `slopdetector_og.jpg` via `og:image`
- **AND** the `og:image:alt` tag provides descriptive alt text for accessibility.

