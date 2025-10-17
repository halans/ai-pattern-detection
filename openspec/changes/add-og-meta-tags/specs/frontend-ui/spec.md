# Frontend UI Capability - Spec Delta

## ADDED Requirements

### Requirement: Social Preview Metadata

The application SHALL expose Open Graph metadata so shared links render a branded preview.

#### Scenario: Base OG tags present
- **WHEN** the root document (`index.html`) is delivered
- **THEN** the head contains `og:title`, `og:description`, `og:type`, and `og:url` meta tags that describe the Slop Detector experience.

#### Scenario: Preview image reference
- **WHEN** the page is shared on an Open Graph consumer (e.g., Facebook, X, LinkedIn)
- **THEN** the metadata references `slopdetector_og.jpg` via `og:image`
- **AND** the `og:image:alt` tag provides descriptive alt text for accessibility.
