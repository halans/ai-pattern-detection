# Implementation Tasks: Add Undue Notability Pattern

## Pattern Registry Updates

- [ ] Add `undue-notability` pattern to `backend/src/patterns/registry.ts`
  - Place within the HIGH severity block near other credibility/jargon detectors.
  - Regex (with `gius` flags):  
    ```typescript
    /\b(?:(?:(?:has\s+been\s+)?(?:featured|profiled|covered|mentioned|highlighted|reported)\s+(?:in|by)\s+(?:multiple|several|various|numerous)?\s*(?:(?:(?:local|regional|national|international)\s+)?(?:(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+)?(?:(?:media|news|press|business|tech|music)\s+)?(?:outlets?|publications?|sources?|media))(?:\s*(?:,?\s*including|\s+including|\s+such\s+as|\s+like|\s+among|\s+across)\s+)(?<outlet_list>(?:[A-Z][\w’'&.-]+(?:\s+[A-Z][\w’'&.-]+)*)(?:\s*,\s*(?:and\s+)?[A-Z][\w’'&.-]+(?:\s+[A-Z][\w’'&.-]+)*)*(?:\s*,?\s*(?:and|&)\s+[A-Z][\w’'&.-]+(?:\s+[A-Z][\w’'&.-]+)*)?))|(?:(?:has\s+been\s+)?(?:featured|profiled|covered|mentioned|highlighted|reported)\s+(?:in|by)\s+(?:multiple|several|various|numerous)?\s*(?:(?:(?:local|regional|national|international)\s+)?(?:(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+)?(?:(?:media|news|press|business|tech|music)\s+)?(?:outlets?|publications?|sources?|media))\s*(?:[:—–-]\s*|\s+)(?<outlet_list>(?:[A-Z][\w’'&.-]+(?:\s+[A-Z][\w’'&.-]+)*)(?:\s*,\s*(?:and\s+)?[A-Z][\w’'&.-]+(?:\s+[A-Z][\w’'&.-]+)*)*(?:\s*,?\s*(?:and|&)\s+[A-Z][\w’'&.-]+(?:\s+[A-Z][\w’'&.-]+)*)?))|(?:Independent\s+coverage(?:\s+has\s+(?:examined|analy[sz]ed|covered|noted|highlighted|discussed|assessed|reported)\b[^.]*?)?)|(?:(?:Trade|Regional|National|International)?\s*coverage\s+has\s+(?:noted|highlighted|examined|mentioned|reported)\b[^.]*?(?:with\s+)?coverage\s+by\s+(?:(?:local|regional|national|international)\s+)?(?:(?:business|tech|music)\s+)?media\b))/gius
    ```
  - Set severity to `HIGH` and weight to `SEVERITY_WEIGHTS.HIGH`.
  - Include representative examples (multi-outlet lists, colon/dash variants, “Independent coverage” phrasing).
  - Add a short comment referencing the OpenSpec proposal.

- [ ] Increment `PATTERN_ENGINE_VERSION` in `backend/src/patterns/registry.ts`
  - Bump minor version (e.g., `1.6.0 → 1.7.0`)
  - Document the bump inline (comment reason).

## Testing

- [ ] Extend `backend/src/patterns/registry.test.ts`
  - Add a dedicated `describe('Undue Notability Pattern', …)` block.
  - Positive tests: including comma-separated outlet lists, colon-separated lists, dash-separated lists, and “Independent coverage has examined … coverage by …” phrasing.
  - Capture group test: assert `match.groups.outlet_list` includes all outlets in order.
  - Multi-match test: ensure two claims in one paragraph both match.
  - Negative tests: single-outlet mentions, generic “featured in media” with no outlets, lowercase outlet names, and sentences ending before listing outlets.
  - Metadata tests: severity, weight, regex flags.

- [ ] Update existing meta tests
  - Adjust pattern count expectation (`PATTERNS.length` >= 46).
  - Update version assertion to the new `PATTERN_ENGINE_VERSION`.

## Documentation

- [ ] Update `PATTERN_UPDATE_v1.1.0.md` (or successor) with a new v1.7.0 section summarizing the change.
- [ ] Refresh `IMPLEMENTATION_SUMMARY.md` and any README references to pattern count/version.
- [ ] Ensure new change is referenced in relevant OpenSpec specs/tasks if necessary.

## Validation

- [ ] Run `npm test` within `backend/`.
- [ ] Run `npm run lint` in `backend/`.
- [ ] Run `openspec validate add-undue-notability-pattern --strict`.

