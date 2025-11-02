# Implementation Tasks: Add Superficial Analyses Pattern

**Change ID:** add-superficial-analyses-pattern
**Status:** Draft

## Task Checklist

### Phase 1: Pattern Implementation

- [ ] **Add superficial-analyses pattern to registry**
  - Location: `backend/src/patterns/registry.ts`
  - Add new pattern object in HIGH severity section after `undue-notability`
  - Use pattern specification from proposal.md
  - Include id, name, description, regex, severity, weight, and examples
  - Ensure regex includes all named capture groups: `gerund`, `finite`, `finite2`, `claim`, `claim2`, `claim3`

- [ ] **Increment PATTERN_ENGINE_VERSION**
  - Location: `backend/src/patterns/registry.ts` (line 551)
  - Update from `1.7.0` to `1.8.0`
  - Update comment to reflect new pattern: `// v1.8.0: Added superficial-analyses pattern`

### Phase 2: Test Implementation

- [ ] **Add unit tests for gerund forms (post-comma/dash)**
  - Location: `backend/src/patterns/registry.test.ts`
  - Test comma separator: "The policy was announced, highlighting the commitment"
  - Test semicolon separator: "The company expanded; underscoring its dominance"
  - Test em-dash separator: "The monument was unveiled—showcasing the heritage"
  - Test en-dash separator: "The initiative launched–emphasizing engagement"
  - Test hyphen separator: "The report was published-reflecting progress"
  - Test "further" modifier: "The event occurred, further demonstrating impact"
  - Test multi-word verbs: "The decision was made, attesting to commitment"
  - Verify `gerund` and `claim` capture groups

- [ ] **Add unit tests for finite forms with demonstratives**
  - Test "This underscores the importance of intervention"
  - Test "That highlights the challenges facing industry"
  - Test "These findings illustrate the need for reform"
  - Test "Those results demonstrate significant progress"
  - Test "It reflects the changing landscape"
  - Verify `finite` and `claim2` capture groups

- [ ] **Add unit tests for finite forms with noun subjects**
  - Test "The move underscores the organization's commitment"
  - Test "The decision highlights the committee's priorities"
  - Test "The event showcases cultural diversity"
  - Test "The designation reflects community effort"
  - Test "The appointment signals a new direction"
  - Test "The citation demonstrates widespread recognition"
  - Test "The monument sign points to historical significance"
  - Test with auxiliary: "The policy has been implemented, illustrating commitment"
  - Verify `finite` and `claim2` capture groups

- [ ] **Add unit tests for standalone finite forms**
  - Test "The strategy aligns with our core values"
  - Test "This approach contributes to long-term sustainability"
  - Test plural forms: "These initiatives align with our mission"
  - Verify `finite2` and `claim3` capture groups

- [ ] **Add negative test cases**
  - Test simple past: "They highlighted key issues" (should NOT match)
  - Test gerund as subject: "Highlighting important points requires care" (should NOT match)
  - Test noun usage: "The highlighting tool is useful" (should NOT match)
  - Test participial adjective: "Underscored text appears darker" (should NOT match)
  - Test standard construction: "She emphasizes quality over quantity" (should NOT match)
  - Test without claim: "The event was announced, highlighting" (should NOT match)

- [ ] **Verify pattern integration**
  - Run all existing tests to ensure no regressions
  - Verify pattern count incremented correctly
  - Check that severity weighting is correct (HIGH = 8)

### Phase 3: Documentation

- [ ] **Update pattern documentation**
  - Update `README.md` if it lists pattern count (verify current: 45 → new: 46)
  - Update `PATTERN_UPDATE_v1.1.0.md` or create new version doc if pattern updates are tracked separately
  - Document the new pattern's purpose and example matches

- [ ] **Update implementation summary**
  - Update `IMPLEMENTATION_SUMMARY.md` if it tracks pattern additions
  - Note version bump and new pattern capability

### Phase 4: Validation and Testing

- [ ] **Run pattern registry tests**
  - Execute: `npm test -- backend/src/patterns/registry.test.ts`
  - Verify all tests pass
  - Check code coverage for new pattern code

- [ ] **Run end-to-end tests**
  - Execute: `npm run test:e2e` or relevant E2E test command
  - Verify frontend displays the new pattern correctly when detected
  - Test with sample text containing superficial analyses phrasing

- [ ] **Validate with OpenSpec**
  - Run: `openspec validate add-superficial-analyses-pattern --strict`
  - Resolve any validation errors
  - Ensure all spec requirements are met

- [ ] **Manual testing**
  - Test pattern detection with sample Wikipedia articles
  - Test with AI-generated press releases
  - Test with human-written analytical text to check false positive rate
  - Verify named capture groups appear correctly in output

### Phase 5: Final Checks

- [ ] **Code review checklist**
  - Pattern regex is correctly formatted with proper escaping
  - Named capture groups use correct syntax: `(?<name>...)`
  - Examples in pattern definition match the proposal
  - Test coverage is comprehensive (minimum 20 test cases)
  - No syntax errors in TypeScript code

- [ ] **Performance verification**
  - Test pattern on large text samples (>10,000 words)
  - Verify no significant performance degradation
  - Compare execution time with other HIGH severity patterns

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
openspec validate add-superficial-analyses-pattern --strict

# Check for specific pattern
openspec show add-superficial-analyses-pattern --json --deltas-only
```

## Success Criteria

- ✅ All unit tests pass (existing + new)
- ✅ Pattern count: 46 (increased from 45)
- ✅ Pattern engine version: 1.8.0
- ✅ OpenSpec validation passes with --strict flag
- ✅ No regressions in existing pattern detection
- ✅ Named capture groups correctly extract verb and claim text
- ✅ Pattern detects all example cases from proposal
- ✅ Pattern does NOT match negative test cases
- ✅ Performance impact is negligible (<5% increase in analysis time)

## Notes

- The regex uses multiple conditional branches, so only one set of named capture groups will populate per match
- Reporting logic should check all capture group variants (gerund/finite/finite2, claim/claim2/claim3)
- This pattern targets Wikipedia-style superficial analysis, which is a strong AI signal
- HIGH severity (weight 8) is appropriate given the distinctive nature of this construction
