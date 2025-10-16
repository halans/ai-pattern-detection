# Reporting Capability - Spec Delta

## MODIFIED Requirements

### Requirement: Scoring Weights

The reporting engine SHALL apply severity-based weights when calculating the confidence score.

#### Scenario: Apply informational severity weight
- **WHEN** a pattern is tagged as `INFORMATIONAL`
- **THEN** the scoring engine multiplies its match count by weight 0.2
- **AND** the contribution is included in the final score but cannot alone exceed classification thresholds.

#### Scenario: Apply very-low severity weight
- **WHEN** a pattern is tagged as `VERY_LOW`
- **THEN** the scoring engine multiplies its match count by weight 1.0
- **AND** the contribution scales linearly with repetitions.

---

### Requirement: Classification Thresholds

The reporting engine SHALL classify the overall result based on the aggregated score.

#### Scenario: Updated thresholds with expanded weights
- **WHEN** the total score ≥ 65
- **THEN** the classification is “Likely AI Slop.
- **WHEN** the total score is between 35 and 64 (inclusive)
- **THEN** the classification is “Mixed/Uncertain”.
- **WHEN** the total score ≤ 34
- **THEN** the classification is “Likely Human.

---

### Requirement: Severity Breakdown Display

The reporting engine SHALL present detected patterns grouped by severity.

#### Scenario: Include new severity tiers
- **WHEN** the report is generated
- **THEN** the output includes sections for `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `VERY_LOW`, and `INFORMATIONAL` severities (if present)
- **AND** informational patterns are annotated as advisory only.

