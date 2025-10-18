# Frontend UI Capability - Spec Delta

## ADDED Requirements

### Requirement: Extension Independence

The Chrome extension SHALL operate independently of the web frontend build artefacts.

#### Scenario: Bundled configuration
- **WHEN** the extension is built for distribution
- **THEN** it embeds its own default (api.slopdetector.me) API endpoint (with optional build-time override) without importing code from the web frontend project.
