# Change Proposal: Adjust Scoring Thresholds and Severities

**Change ID:** `adjust-scoring`
**Author:** Codex
**Date:** 2025-10-16  
**Status:** Draft

---

## Why

Academic writing often uses transitional phrases, repetition, and formal structure that overlap with AI-writing indicators. Our current weighted scoring frequently reaches 100, leading to false positives that erode trust in the classifier. We need to rebalance severity weights and scoring thresholds so the system remains conservative while still highlighting AI-like signals.

---

## What Changes

- **NEW** informational severity with minimal scoring weight (0.2) for extremely common, low-risk signals.
- **NEW** very-low severity with a small weight (1.0) for mild indicators that should contribute less to the final score.
- **UPDATED** scoring aggregation so informational/very-low severities are considered but cannot dominate the final classification.
- **UPDATED** classification thresholds (Likely AI, Mixed, Human) to reflect the expanded scoring scale and reduce runaway totals.
- **UPDATED** reporting metadata/explanations to show the new severity tiers.

---

## Impact

### Affected Specs
- **MODIFIED** `specs/reporting/` – scoring, severity weights, and classification thresholds.
- **MODIFIED** `specs/text-analysis/` – pattern metadata must support informational/very-low severities.

### Affected Code
- Severity constants in pattern registry and analyzer.
- Score calculation and classification logic in the analyzer.
- Reporting output and UI to display the new severity categories.

### Infrastructure
- No backend infrastructure impact, but analytical dashboards may need recalibration due to new scoring ranges.

---

## Success Criteria

- Typical academic or formal human text no longer spikes to score 100 without multiple strong indicators.
- Patterns tagged informational/very-low contribute minimally but still display in reports for transparency.
- Classification thresholds yield fewer false positives while still catching high-signal AI content.

---

## Dependencies

- Existing pattern registry and analyzer modules.
- Frontend reporting components that display severity groups.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Under-detects AI content if weights too low | Monitor detection metrics; adjust after evaluation period |
| Added severities confuse users | Update documentation and UI legends to explain severity meaning |
| Legacy reports misaligned | Version the scoring logic and annotate reports with scoring engine version |

---

## Open Questions

- [ ] What new classification thresholds best reflect the rescaled weights? (e.g., 60/30 vs. current 70/31)
- [ ] Should we retrofit existing patterns with informational/very-low severities or only apply to new patterns?
- [ ] Do we need a migration note for historical analytics?

