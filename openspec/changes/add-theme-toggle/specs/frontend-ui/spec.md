# Frontend UI Capability - Spec Delta

## MODIFIED Requirements

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

