# Implementation Tasks: Adjust Scoring Thresholds and Severities

## 1. Scoring Model Update
- [x] 1.1 Introduce new severity constants (`INFORMATIONAL`, `VERY_LOW`) with weights 0.2 and 1.0.
- [x] 1.2 Update score aggregation to include the new severities without inflating totals.
- [x] 1.3 Recalculate classification thresholds to reflect the expanded scoring range.

## 2. Pattern Registry
- [x] 2.1 Update type definitions/enums to support the new severity labels.
- [x] 2.2 Audit existing patterns and reassign severity levels where appropriate (e.g., move some LOW signals to VERY_LOW/INFORMATIONAL).
- [x] 2.3 Add tests ensuring severity assignments map to the correct weight.

## 3. Analyzer & Reporting
- [x] 3.1 Update analyzer classification logic to use new thresholds.
- [x] 3.2 Ensure reporting/generator includes informational/very-low groups and displays their contributions.
- [x] 3.3 Update frontend UI legends/filters to highlight the new severity tiers.

## 4. Quality & Validation
- [x] 4.1 Add regression tests covering academic-style texts to ensure scores stay below 100 without strong signals.
- [x] 4.2 Update snapshot/unit tests that reference severity names or weights.
- [x] 4.3 Perform manual benchmark against reference texts to confirm reduced false positives.
