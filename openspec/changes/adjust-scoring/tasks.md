# Implementation Tasks: Adjust Scoring Thresholds and Severities

## 1. Scoring Model Update
- [ ] 1.1 Introduce new severity constants (`INFORMATIONAL`, `VERY_LOW`) with weights 0.2 and 1.0.
- [ ] 1.2 Update score aggregation to include the new severities without inflating totals.
- [ ] 1.3 Recalculate classification thresholds to reflect the expanded scoring range.

## 2. Pattern Registry
- [ ] 2.1 Update type definitions/enums to support the new severity labels.
- [ ] 2.2 Audit existing patterns and reassign severity levels where appropriate (e.g., move some LOW signals to VERY_LOW/INFORMATIONAL).
- [ ] 2.3 Add tests ensuring severity assignments map to the correct weight.

## 3. Analyzer & Reporting
- [ ] 3.1 Update analyzer classification logic to use new thresholds.
- [ ] 3.2 Ensure reporting/generator includes informational/very-low groups and displays their contributions.
- [ ] 3.3 Update frontend UI legends/filters to highlight the new severity tiers.

## 4. Quality & Validation
- [ ] 4.1 Add regression tests covering academic-style texts to ensure scores stay below 100 without strong signals.
- [ ] 4.2 Update snapshot/unit tests that reference severity names or weights.
- [ ] 4.3 Perform manual benchmark against reference texts to confirm reduced false positives.
