# Change Proposal: Add Repetition Detection Pattern

**Change ID:** `add-repetition-pattern`
**Author:** Codex
**Date:** 2025-10-15  
**Status:** Draft

---

## Why

Repetitive wording—especially repeated transition words, bigrams, and trigrams—is a common signal in AI-generated text. The current pattern registry lacks a dedicated detector for repeated lexical units across varying text lengths. Adding this pattern strengthens low-severity detection by flagging unnatural reiteration that often appears in synthesized prose.

---

## What Changes

- **NEW** low-severity pattern that counts repeated unigrams, bigrams, and trigrams across the normalized text.
- **NEW** thresholds that scale with input length:
  - ≤5,000 characters: flag when a unit repeats ≥3 times
  - 5,001–10,000 characters: flag when repeated ≥4 times
  - >10,000 characters: flag when repeated ≥5 times
- **NEW** detection logic integrated into the analyzer/normalizer so the pattern returns match contexts and counts for the most repeated units.

---

## Impact

### Affected Specs
- **MODIFIED** `specs/text-analysis/` – update requirements to include repetition detection behavior and thresholds.

### Affected Code
- Pattern registry to register the new low-severity pattern.
- Analyzer/preprocessing pipeline to compute frequency statistics for unigrams, bigrams, and trigrams.
- Possibly new utility to tokenize and tally n-grams, including case normalization.

### Infrastructure
- No backend infrastructure changes; computations happen within existing worker limits.

---

## Success Criteria

- Pattern activates only when repetition exceeds the length-specific thresholds.
- Match data includes the repeated unit, frequency, and representative context snippets.
- Combined runtime remains within current performance budget (e.g., analyzing 10k chars < 50ms).

---

## Dependencies

- Existing text normalization utilities for consistent tokenization.
- Analyzer module for integrating the detection results.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Legitimate stylistic repetition (e.g., rhetoric) misfires | Classify as LOW severity and provide clear context so reviewers can override |
| Processing overhead for large texts | Optimize tokenization, reuse normalized tokens, early exit once threshold met |
| False positives on word variants (case, punctuation) | Normalize tokens (lowercase) and strip punctuation before counting |

---

## Open Questions

- [ ] Should we provide configurable stop-lists to ignore common short words irrespective of repetition?  
- [ ] Should repeated phrases inside quoted dialogue be treated differently?  
- [ ] Do we need separate metadata fields exposing the top repeated n-grams for use in explanations?

