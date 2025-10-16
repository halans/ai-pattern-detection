# Text Analysis Capability - Spec Delta

## MODIFIED Requirements

### Requirement: Pattern Metadata

Each pattern definition SHALL specify severity, weight, and context to support scoring.

#### Scenario: Support informational severity
- **WHEN** a pattern is marked `INFORMATIONAL`
- **THEN** its severity value is stored as `INFORMATIONAL`
- **AND** analyzers/reporters treat it as advisory only.

#### Scenario: Support very-low severity
- **WHEN** a pattern is marked `VERY_LOW`
- **THEN** its severity value is stored as `VERY_LOW`
- **AND** the analyzer includes it in scoring with weight 1.0.

---

### Requirement: Pattern Registry Validation

The system SHALL validate severity values when initializing the pattern registry.

#### Scenario: Reject unknown severities
- **WHEN** a pattern is registered with an unsupported severity label
- **THEN** initialization fails with a descriptive error.

#### Scenario: Allow new severities
- **WHEN** a pattern uses `INFORMATIONAL` or `VERY_LOW`
- **THEN** registry initialization succeeds.

