# Pattern Registry Update v1.6.0

**Date:** 2025-11-01
**Update Type:** Targeted Enhancement
**Pattern Engine:** v1.5.0 → v1.6.0

---

## Summary

This incremental release introduces the `contrastive-reframe` detector for the signature “It’s not just X, it’s Y” construction, expands high-severity coverage to 14 patterns, and aligns all documentation and UI surfaces with `v1.6.0`. The registry now spans 45 regex-based signals plus the em-dash heuristic.

---

## Highlights

- Added the HIGH-severity `contrastive-reframe` pattern that captures contrastive reframes with named groups for the X/Y clauses
- Hardened `registry.test.ts` with exhaustive positive, negative, capture-group, multiline, and multi-match scenarios
- Updated backend version constants, frontend footer messaging, E2E assertions, and documentation to show `Pattern Engine v1.6.0 (45 patterns)`

---

## New Patterns Added (since v1.5.0)

- `contrastive-reframe` (HIGH)

---

## Updated Pattern Count

| Severity | Weight | Count |
|----------|--------|-------|
| CRITICAL | 15     | 2     |
| HIGH     | 8      | 14    |
| MEDIUM   | 4      | 20    |
| LOW      | 2      | 3     |
| VERY_LOW | 1      | 5     |
| INFORMATIONAL | 0.2 | 1 |

**Total:** 45 regex patterns + 1 heuristic (em-dash spam)

---

## Files Updated

1. `backend/src/patterns/registry.ts` — added `contrastive-reframe` pattern and bumped `PATTERN_ENGINE_VERSION` to 1.6.0
2. `backend/src/patterns/registry.test.ts` — expanded coverage, updated expectations, and validated capture groups
3. `frontend/src/App.tsx` & `frontend/tests/e2e/ui-audit.spec.ts` — refreshed footer copy and Playwright assertions for the new version/count
4. Documentation (`IMPLEMENTATION_SUMMARY.md`, `README.md`) — synchronized pattern totals and release notes
5. `openspec/changes/add-contrastive-reframe-pattern/tasks.md` — recorded documentation and tooling follow-through

---

## Testing

- `npm test` (backend)
- `npm run lint` (backend)
- `openspec validate add-contrastive-reframe-pattern --strict`

---

# Pattern Registry Update v1.5.0 (Historical)

**Date:** 2025-10-19
**Update Type:** Feature Expansion
**Pattern Engine:** v1.1.0 → v1.5.0

---

## Summary

This release more than doubles the pattern surface area. We introduced 24 new regex signatures, refactored em-dash detection into a heuristic with length-aware thresholds, and refreshed the documentation/UI to publish version `v1.5.0`. The registry now covers 44 regex-based signals plus the heuristic detector, providing broader coverage of AI lexical quirks, corporate jargon, and structural markers.

---

## Highlights

- Added new HIGH-severity families targeting data-analysis jargon and overused AI helper phrases
- Expanded MEDIUM coverage with contextual, motivational, and metaphorical constructions frequently emitted by LLMs
- Introduced VERY_LOW lexical lists for AI-favored adjectives, nouns, verbs, and descriptors, plus repetition heuristics
- Moved em-dash spam detection out of the regex array into the analyzer with dynamic thresholds and downgraded severity to VERY_LOW
- Updated tests, docs, and UI chrome to surface the new pattern engine version and counts

---

## New Patterns Added (since v1.1.0)

### HIGH Severity (6 additions)
- `data-analysis-actionable-insights`
- `data-analysis-driven-decisions`
- `data-analysis-leverage-insights`
- `data-analysis-extract-insights`
- `most-overused`
- `business-jargon`

### MEDIUM Severity (12 additions)
- `ai-stock-phrases`
- `communication-styles`
- `action-words`
- `contextual-phrases`
- `conductor-music-analogy`
- `hyperbolic-phrases`
- `additional-connectives`
- `empowerment-verbs`
- `deep-noun-pattern`
- `hustle-and-bustle`
- `quantity-phrases`
- `significance-intensifiers`

### LOW / VERY_LOW / INFORMATIONAL Additions
- `ai-adjectives`, `ai-nouns`, `ai-verbs`, `ai-descriptors`, `repetition-ngrams` (VERY_LOW)
- `transitional-words` (INFORMATIONAL)

> Legacy pattern `editorializing` was superseded by the broader `ai-stock-phrases` detector. `em-dash-spam` now lives in the analyzer with dynamic thresholds instead of the registry and now scores as VERY_LOW.

---

## Updated Pattern Count

| Severity | Weight | Count |
|----------|--------|-------|
| CRITICAL | 15     | 2     |
| HIGH     | 8      | 13    |
| MEDIUM   | 4      | 20    |
| LOW      | 2      | 3     |
| VERY_LOW | 1      | 5     |
| INFORMATIONAL | 0.2 | 1 |

**Total:** 44 regex patterns + 1 heuristic (em-dash spam)

---

## Pattern Adjustments

- Em-dash spam detection is now handled in `PatternAnalyzer.detectEmDashSpam`, enforcing thresholds of 3/5/6 dashes depending on text length and scoring the detector as VERY_LOW.
- Custom patterns are scored alongside registry patterns via `customPatterns` metadata to keep `calculateScore` accurate.
- Footer copy and documentation now surface `Pattern Engine v1.5.0 (44 patterns)`.

---

## Files Updated

1. `backend/src/patterns/registry.ts` — added new pattern definitions and bumped `PATTERN_ENGINE_VERSION`
2. `backend/src/patterns/analyzer.ts` — added custom em-dash detection, heuristic scoring, and registry integration updates
3. `backend/src/patterns/analyzer.test.ts` & `backend/src/patterns/registry.test.ts` — expanded unit coverage for new thresholds and counts
4. `frontend/src/App.tsx` — refreshed footer version/count string
5. Documentation: `IMPLEMENTATION_SUMMARY.md`, this update note, and related OpenSpec deltas

---

## Scoring Impact

- Theoretical maximum raw score: **225.2** (before clamping to 100)
- Existing classification bands remain unchanged (`Likely Human` <35, `Mixed/Uncertain` 35-64, `Likely AI Slop` ≥65)
- Em-dash spam now contributes 1 point per occurrence above threshold (VERY_LOW)

---

## Testing

- Vitest suites updated to cover em-dash threshold logic and registry counts
- Playwright E2E checks refreshed to assert the new footer version and conditional "Analyze File" button behavior
- `openspec validate` run to confirm spec deltas for the frontend UI capability

---

## Performance Impact

- Regex compilation cost remains negligible; added patterns are precompiled on analyzer construction
- Runtime profiling shows <5 ms increase on 1,000-word samples (still well below the 50 ms CPU target)

---

## Migration Notes

- No API contract changes; responses include the new `pattern_engine_version` automatically
- `em-dash-spam` moves from the registry into analyzer heuristics — no consumer changes required
- Re-run automated tests after integrating to confirm local environment picks up the new version string

---

## Future Enhancements

- Add binary file parsers (PDF/DOCX) and multilingual pattern variants
- Explore punctuation cadence detectors and sentence-structure heuristics
- Continue tuning weights based on production sample feedback

---

## Changelog

### [1.6.0] - 2025-11-01
- Added HIGH-severity `contrastive-reframe` detector with named capture groups for contrastive rhetoric
- Updated backend/frontend/docs to surface `Pattern Engine v1.6.0 (45 patterns)`
- Extended registry tests to cover multi-match, multiline, and capture-group scenarios specific to the new pattern

### [1.5.0] - 2025-10-19
- Added 24 new patterns across HIGH/MEDIUM/VERY_LOW severities
- Moved em-dash spam detection into analyzer with dynamic thresholds and VERY_LOW severity
- Updated documentation and UI to display `Pattern Engine v1.5.0 (44 patterns)`
- Expanded automated tests for new detectors and thresholds

### [1.1.0] - 2025-10-14
- Added initial legal/disclaimer and formatting patterns
- Raised pattern count to 21
- Updated docs to reflect version change

---

**Status:** ✅ Complete and merged
**Next Review:** Evaluate multilingual detectors and binary file support
