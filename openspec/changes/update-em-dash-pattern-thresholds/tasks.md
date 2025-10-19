# Implementation Tasks: Update Em-Dash Pattern Thresholds

## Pattern Registry Updates

- [ ] Remove em-dash-spam pattern from PATTERNS array in `backend/src/patterns/registry.ts`
  - Locate the em-dash-spam pattern definition (around line 510-518)
  - Delete the entire pattern object from the PATTERNS array
  - Verify no other code references the pattern in the registry

## Pattern Analyzer Implementation

- [ ] Add em-dash detection threshold determination method in `backend/src/patterns/analyzer.ts`
  - Create `determineEmDashThreshold(length: number): number` method
  - Return 3 for length < 5000
  - Return 5 for length >= 5000 and < 10000
  - Return 6 for length >= 10000
  - Place method near `determineRepetitionThreshold()` for consistency

- [ ] Add em-dash occurrence counting method in `backend/src/patterns/analyzer.ts`
  - Create `countEmDashes(text: string): number` method
  - Use regex `/—/g` to match all em-dash characters
  - Return total count of matches

- [ ] Add em-dash detection method in `backend/src/patterns/analyzer.ts`
  - Create `detectEmDashSpam(text: string): PatternMatch | null` method
  - Get threshold using `determineEmDashThreshold(text.length)`
  - Count em-dashes using `countEmDashes(text)`
  - Return null if count <= threshold
  - If count > threshold, create PatternMatch with:
    - patternId: 'em-dash-spam'
    - patternName: 'Em-Dash Spam'
    - severity: 'VERY_LOW'
    - matches: array of em-dash locations with context
    - count: total em-dash count
  - Use existing `findMatches()` logic or create new method to locate em-dashes

- [ ] Integrate em-dash detection in `analyze()` method in `backend/src/patterns/analyzer.ts`
  - Add call to `detectEmDashSpam(text)` after repetition pattern detection
  - Push result to results array if not null
  - Ensure em-dash detection runs for all text inputs

## Testing

- [ ] Add unit tests for em-dash threshold determination in `backend/src/patterns/analyzer.test.ts`
  - Test length < 5000 returns threshold 3
  - Test length = 5000 returns threshold 5
  - Test length = 7500 returns threshold 5
  - Test length = 10000 returns threshold 5
  - Test length = 10001 returns threshold 6
  - Test length > 10000 returns threshold 6

- [ ] Add unit tests for em-dash counting in `backend/src/patterns/analyzer.test.ts`
  - Test text with 0 em-dashes returns 0
  - Test text with 3 em-dashes returns 3
  - Test text with 10 em-dashes returns 10
  - Test em-dashes in various contexts (middle of sentences, start, end)

- [ ] Add integration tests for em-dash detection with different text lengths
  - Test short text (3000 chars) with 3 em-dashes → NOT flagged
  - Test short text (3000 chars) with 4 em-dashes → FLAGGED
  - Test medium text (7500 chars) with 5 em-dashes → NOT flagged
  - Test medium text (7500 chars) with 6 em-dashes → FLAGGED
  - Test long text (12000 chars) with 6 em-dashes → NOT flagged
  - Test long text (12000 chars) with 7 em-dashes → FLAGGED
  - Test boundary cases (exactly 5000 and 10000 characters)

- [ ] Add test for pattern match structure in `backend/src/patterns/analyzer.test.ts`
  - Verify PatternMatch has correct patternId
  - Verify PatternMatch has correct severity (VERY_LOW)
  - Verify PatternMatch count equals number of em-dashes
  - Verify matches array contains em-dash locations with context

## Pattern Registry Version Update

- [ ] Increment PATTERN_ENGINE_VERSION in `backend/src/patterns/registry.ts`
  - Change from current version to next minor version (e.g., 1.4.0 → 1.5.0)
  - Document version change in code comment
  - This version change will appear in analysis metadata

## Documentation and Code Quality

- [ ] Add code comments explaining em-dash threshold logic
  - Document why each threshold value was chosen
  - Explain the length-based approach
  - Reference this proposal for context

- [ ] Update any pattern documentation if it exists
  - Check for README or docs mentioning em-dash pattern
  - Update examples to reflect new behavior
  - Document threshold tiers

## Validation

- [ ] Run unit tests to verify all new functionality
  - Execute `npm test` in backend directory
  - Ensure all em-dash tests pass
  - Verify no regressions in existing pattern tests

- [ ] Run integration tests with sample texts
  - Test with real-world text samples at various lengths
  - Verify false positive reduction in long documents
  - Confirm true positives still detected

- [ ] Manual testing with edge cases
  - Test text exactly at boundary lengths (5000, 10000)
  - Test text with em-dashes in unusual positions
  - Test text mixing em-dashes with en-dashes and hyphens

- [ ] Verify pattern no longer in registry
  - Confirm em-dash-spam not in PATTERNS array
  - Verify `getPatternById('em-dash-spam')` returns undefined for registry lookup
  - Ensure analysis still detects em-dash spam through custom logic

## Type Safety and Build

- [ ] Verify TypeScript compilation
  - Run `npm run type-check` or `tsc --noEmit`
  - Ensure no type errors introduced
  - Verify Pattern type still correct

- [ ] Run ESLint and Prettier
  - Execute `npm run lint`
  - Execute `npm run format` if needed
  - Fix any style violations

## Deployment Preparation

- [ ] Update changelog or release notes
  - Document em-dash threshold change
  - Explain impact on existing analyses
  - Note that some previously flagged texts may no longer trigger pattern

- [ ] Prepare communication for breaking change
  - Users should know detection behavior changes
  - Explain that this improves accuracy (reduces false positives)
  - Document new threshold values
