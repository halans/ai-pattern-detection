# Implementation Tasks: Add Rule of Three Pattern

**Change ID:** add-rule-of-three-pattern
**Status:** Draft

## Task Checklist

### Phase 1: Pattern Implementation

- [x] **Add rule-of-three pattern to registry**
  - Location: `backend/src/patterns/registry.ts`
  - Add new pattern object in MEDIUM severity section
  - Position after `significance-intensifiers` and before INFORMATIONAL section
  - Use pattern specification from proposal.md
  - Include id, name, description, regex, severity, weight, and examples
  - Use named capture groups: `item1`, `item2`, `item3` for better reporting

- [x] **Increment PATTERN_ENGINE_VERSION**
  - Location: `backend/src/patterns/registry.ts` (line 583)
  - Updated from `1.8.0` to `1.9.0`
  - Update comment to reflect new pattern: `// v1.9.0: Added rule-of-three pattern`

### Phase 2: Test Implementation

- [x] **Add unit tests for short-phrase triplets with "and"**
  - Location: `backend/src/patterns/registry.test.ts`
  - Test: "keynote sessions, panel discussions, and networking opportunities"
  - Test: "global SEO professionals, marketing experts, and growth hackers"
  - Test: "efficiency, innovation, and growth"
  - All three items are captured correctly via named groups

- [x] **Add unit tests for short-phrase triplets with "or"**
  - Test: "fast, reliable, or affordable"
  - "or" conjunction is properly detected

- [x] **Add unit tests for triple-adjective patterns**
  - Test: "innovative, dynamic, and transformative solutions"
  - Adjectives captured correctly

- [x] **Add unit tests for mixed case handling**
  - Test: "Fast, Reliable, And Affordable" (matches, pattern is case-insensitive)
  - Test: "INNOVATION, EFFICIENCY, AND GROWTH" (matches)
  - Case-insensitive flag works correctly

- [x] **Add negative test cases**
  - Test two-item list: "apples and oranges" (does NOT match)
  - Test two-item list: "fast and reliable" (does NOT match)
  - Test four-item list: "red, blue, green, and yellow" (matches last 3 items - acceptable behavior)
  - Test single item: "innovation" (does NOT match)
  - Test without commas: "sessions discussions and opportunities" (does NOT match)

- [x] **Verify capture groups**
  - Named groups (`item1`, `item2`, `item3`) verify correctly
  - Capture groups handle apostrophes: "SEO's, PPC's, and ROI's"
  - Capture groups handle compound words: "co-founders, co-workers, and co-creators"

- [x] **Verify pattern integration**
  - All existing tests pass (no regressions)
  - Pattern count incremented correctly (47 → 48 total patterns)
  - Severity weighting is correct (MEDIUM = 4)

### Phase 3: Documentation

- [ ] **Update pattern documentation**
  - Update `README.md` if it lists pattern count (verify current: 46 → new: 47)
  - Update `PATTERN_UPDATE_v1.1.0.md` or create new version doc if pattern updates are tracked separately
  - Document the new pattern's purpose and example matches
  - Note the MEDIUM severity and explain why (legitimate rhetorical device but overused by AI)

- [ ] **Update implementation summary**
  - Update `IMPLEMENTATION_SUMMARY.md` if it tracks pattern additions
  - Note version bump and new pattern capability
  - Explain the two regex variants and why we chose the general triplet pattern

### Phase 4: Validation and Testing

- [ ] **Run pattern registry tests**
  - Execute: `npm test -- backend/src/patterns/registry.test.ts`
  - Verify all tests pass
  - Check code coverage for new pattern code

- [ ] **Run end-to-end tests**
  - Execute: `npm run test:e2e` or relevant E2E test command
  - Verify frontend displays the new pattern correctly when detected
  - Test with sample text containing multiple triplets

- [ ] **Validate with OpenSpec**
  - Run: `openspec validate add-rule-of-three-pattern --strict`
  - Resolve any validation errors
  - Ensure all spec requirements are met

- [ ] **Manual testing**
  - Test pattern detection with AI-generated marketing copy (expected: multiple matches)
  - Test with product descriptions and event announcements
  - Test with human-written analytical text (expected: fewer matches)
  - Verify false positive rate is acceptable for MEDIUM severity

### Phase 5: Final Checks

- [ ] **Code review checklist**
  - Pattern regex is correctly formatted with proper escaping
  - Case-insensitive flag (`i`) is set
  - Global flag (`g`) is set for multiple matches
  - Named capture groups use correct syntax: `(?<name>...)`
  - Examples in pattern definition match the proposal
  - Test coverage is comprehensive (minimum 15 test cases)
  - No syntax errors in TypeScript code

- [ ] **Performance verification**
  - Test pattern on large text samples (>10,000 words)
  - Verify no significant performance degradation
  - Compare execution time with other MEDIUM severity patterns
  - Pattern should not cause noticeable slowdown

- [ ] **Documentation accuracy**
  - All version numbers updated correctly
  - Pattern count matches reality
  - Examples in documentation actually trigger the pattern
  - Proposal, spec, and implementation are aligned

## Verification Commands

```bash
# Run pattern tests
npm test -- backend/src/patterns/registry.test.ts

# Run all backend tests
npm test

# Run E2E tests
npm run test:e2e

# Validate OpenSpec
openspec validate add-rule-of-three-pattern --strict

# Check for specific pattern
openspec show add-rule-of-three-pattern --json --deltas-only
```

## Success Criteria

- ✅ All unit tests pass (existing + new)
- ✅ Pattern count: 47 (increased from 46)
- ✅ Pattern engine version: 1.9.0
- ✅ OpenSpec validation passes with --strict flag
- ✅ No regressions in existing pattern detection
- ✅ Capture groups correctly extract all three items
- ✅ Pattern detects all example cases from proposal
- ✅ Pattern does NOT match negative test cases
- ✅ Performance impact is negligible (<5% increase in analysis time)
- ✅ False positive rate is acceptable for MEDIUM severity (pattern appears in legitimate writing but less frequently than in AI text)

## Notes

- **Severity rationale:** MEDIUM (weight 4) because rule of three is used in legitimate writing, but AI overuses it
- **Frequency matters:** Single occurrence is normal; multiple triplets in short text is a stronger signal
- **Capture groups:** Using named groups (`item1`, `item2`, `item3`) makes reporting clearer than numbered groups
- **Alternative pattern:** The triple-adjective regex is available for future enhancement but not needed for initial implementation
- **Pattern placement:** Add to MEDIUM section, as it's more indicative than VERY_LOW (word-level) but less definitive than HIGH (AI self-reference)

## Future Enhancements (Post-Implementation)

- Implement frequency-based scoring (adjust weight based on triplet density)
- Add semantic similarity detection for near-synonym triplets
- Consider context filtering to reduce false positives
- Explore detecting other rule-of-three variants (parallel clauses, sentence patterns)
