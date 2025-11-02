# Update Em-Dash Spam Pattern Thresholds

**Change ID:** update-em-dash-pattern-thresholds
**Status:** Draft
**Author:** AI Assistant
**Date:** 2025-10-19

## Summary

Update the em-dash spam pattern detection to use context-aware thresholds based on text length. The current implementation flags any text with 3+ em-dashes, which creates false positives in longer documents. This change introduces tiered thresholds that scale with document length to reduce false positives while maintaining detection accuracy.

## Problem Statement

The current em-dash spam pattern uses a fixed threshold of 3 em-dashes regardless of text length:

```typescript
{
  id: 'em-dash-spam',
  regex: /(—.*){3,}/g,
  severity: 'VERY_LOW',
}
```

**Issues with current approach:**
- **False positives in long documents:** A 10,000-character article legitimately using 4 em-dashes for parenthetical clauses gets flagged as spam
- **No context awareness:** The pattern doesn't consider that longer texts naturally use more em-dashes
- **Poor signal-to-noise ratio:** Em-dashes are a legitimate stylistic device; only excessive use relative to length indicates AI patterns

**Real-world impact:**
- Long-form journalism and essays are incorrectly flagged
- Technical documentation with multiple asides triggers false alarms
- Users lose trust in the detector when legitimate content is marked as AI slop

## Goals

- Implement length-aware thresholds for em-dash detection:
  - **< 5,000 characters:** Flag if > 3 em-dashes
  - **5,000-10,000 characters:** Flag if > 5 em-dashes
  - **> 10,000 characters:** Flag if > 6 em-dashes
- Reduce false positive rate for em-dash detection in longer documents
- Maintain or improve detection accuracy for actual AI-generated text
- Keep the pattern severity at VERY LOW (appropriate for stylistic indicators)

## Non-Goals

- Changing em-dash detection for texts under 5,000 characters (threshold remains at 3)
- Detecting specific em-dash usage patterns (e.g., spacing, placement)
- Creating separate patterns for different em-dash contexts
- Adjusting severity or weight of the pattern

## User Stories

1. **As a journalist**, I want to analyze my 8,000-character article that uses 5 em-dashes for parenthetical clauses without it being falsely flagged as AI spam.

2. **As a content reviewer**, I want the detector to focus on genuinely excessive em-dash usage that indicates AI generation patterns, not normal editorial style.

3. **As a technical writer**, I want my documentation with legitimate em-dash usage in long documents to pass analysis without triggering false positives.

## Current Behavior

```
Text length: 3,000 chars, em-dashes: 4 → FLAGGED ✓ (correct)
Text length: 8,000 chars, em-dashes: 4 → FLAGGED ✗ (false positive)
Text length: 12,000 chars, em-dashes: 5 → FLAGGED ✗ (false positive)
```

## Proposed Behavior

```
Text length: 3,000 chars, em-dashes: 4 → FLAGGED ✓ (correct)
Text length: 8,000 chars, em-dashes: 4 → NOT FLAGGED ✓ (fixed)
Text length: 8,000 chars, em-dashes: 6 → FLAGGED ✓ (correct)
Text length: 12,000 chars, em-dashes: 5 → NOT FLAGGED ✓ (fixed)
Text length: 12,000 chars, em-dashes: 7 → FLAGGED ✓ (correct)
```

## Threshold Rationale

The proposed thresholds are based on typical em-dash usage in human writing:

| Text Length | Threshold | Ratio |
|-------------|-----------|-------|
| < 5,000 chars | 3 | 1 per ~1,667 chars |
| 5,000-10,000 | 5 | 1 per ~2,000 chars |
| > 10,000 | 6 | 1 per ~1,667 chars |

**Reasoning:**
- Short texts (< 5,000 chars): Keep current threshold; em-dashes are less common in brief content
- Medium texts (5,000-10,000): Allow slightly more usage; professional writing legitimately uses em-dashes for variety
- Long texts (> 10,000): Maintain reasonable density; excessive use beyond this point indicates formulaic writing

## Technical Approach

The em-dash pattern requires special handling similar to the existing repetition-ngrams pattern, which already uses length-based thresholds. The implementation will:

1. Remove em-dash-spam from the regex-based PATTERNS array
2. Add custom em-dash detection logic in `PatternAnalyzer.analyze()`
3. Use text length to determine the appropriate threshold
4. Count total em-dashes in the text
5. Only create a PatternMatch if the count exceeds the threshold

**Implementation location:** `backend/src/patterns/analyzer.ts` (similar to `detectRepetitionPatterns`)

## Success Metrics

- False positive rate for em-dash pattern decreases by ≥50% on long documents
- True positive rate maintained (no decrease in detecting actual AI spam)
- Pattern continues to trigger on genuinely excessive em-dash usage
- Zero regressions in other pattern detection

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| AI-generated text adapts to new thresholds | Thresholds are based on human writing patterns; AI excess will still trigger detection |
| Reduced sensitivity in short texts | Threshold unchanged for < 5,000 chars maintains current behavior |
| Implementation complexity | Follow existing pattern from repetition detection; well-tested approach |
| Testing edge cases | Comprehensive unit tests covering all threshold boundaries |

## Dependencies

None - this is a standalone pattern update that doesn't affect other patterns or system components.

## Backward Compatibility

**Breaking change:** YES - Detection behavior changes for existing texts

**Impact:**
- Some previously flagged texts (false positives) will no longer trigger the pattern
- This is the desired outcome and improves accuracy
- Confidence scores may decrease slightly for affected texts
- Users will see improved accuracy, not degraded experience

**Migration:** None required - change takes effect immediately upon deployment

## Future Considerations

- Monitor em-dash usage patterns in newly detected AI models
- Consider further threshold refinement based on production data
- Evaluate similar length-based thresholds for other punctuation patterns
- Add configurable thresholds for custom deployment scenarios
