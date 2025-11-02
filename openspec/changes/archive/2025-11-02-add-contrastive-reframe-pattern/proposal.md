# Add Contrastive Reframe Pattern Detection

**Change ID:** add-contrastive-reframe-pattern
**Status:** Draft
**Author:** AI Assistant
**Date:** 2025-11-01

## Summary

Add a new regex pattern to detect "contrastive reframe" writing structures where AI negates a simpler or more obvious idea (X) and replaces it with a more complex or profound one (Y). This pattern commonly appears in AI-generated text as "It's not just X, it's Y" or variations with "only," "merely," "simply" as intensifiers. The pattern helps identify AI's tendency to artificially elevate simple concepts into more complex ones.

## Problem Statement

AI models frequently employ a rhetorical technique where they:
1. Acknowledge a simpler or surface-level interpretation (X)
2. Negate it with "not just/only/merely/simply"
3. Replace it with a more complex or profound reframing (Y)

**Examples of this pattern:**
- "It's not just a tool, it's a paradigm shift"
- "It's not only about efficiency—it's about transformation"
- "It is not merely a framework; it is a comprehensive ecosystem"
- "It's not simply a design choice. It's a fundamental philosophy"

**Why this matters:**
- This rhetorical structure is a strong signal of AI authorship
- Human writers typically state complex ideas directly rather than negating simpler ones first
- The pattern creates artificially elevated language that feels formulaic
- It's distinctive enough to be a reliable detection signal

**Current gap:**
- The pattern registry has no dedicated detection for this contrastive reframe structure
- While individual words like "merely" or "paradigm" might trigger other patterns, the structural "X→Y reframe" goes undetected
- This is a missed opportunity for a high-severity pattern detection

## Goals

- Add a new HIGH severity pattern to detect contrastive reframe structures
- Implement the regex: `(?is)\b(?:it['']s|it\s+is)\s+not\s+(?:(?:just|only|merely|simply)\s+)?(?<X>.+?(?=\s*(?:[,;:]|[—–-]|\.\s+)\s*(?:it['']s|it\s+is)\s+))\s*(?:[,;:]|[—–-]|\.\s+)\s*(?:it['']s|it\s+is)\s+(?<Y>.+)`
- Capture both parts (X and Y) for reporting and analysis
- Include comprehensive test coverage for variations (punctuation, spacing, intensifiers)
- Classify as HIGH severity due to strong AI signal strength

## Non-Goals

- Detecting other negation patterns (e.g., "not only...but also" is already covered by `negative-parallelism`)
- Creating separate patterns for different negation intensifiers (all handled by one regex)
- Analyzing the semantic content of X or Y clauses
- Detecting similar patterns that don't use "it's/it is" construction

## User Stories

1. **As a content reviewer**, I want to detect when AI uses formulaic "it's not just X, it's Y" structures so I can identify artificially elevated language.

2. **As an educator**, I want to flag student submissions that use contrastive reframes typical of AI-generated essays.

3. **As a journalist**, I want to identify when press releases or articles use this characteristic AI rhetorical pattern.

## Current Behavior

The pattern registry does not detect contrastive reframe structures:

```
Text: "It's not just a framework, it's a complete ecosystem"
Current detection: May trigger 'ai-nouns' for "framework" and "ecosystem" (VERY LOW severity)
```

## Proposed Behavior

The new pattern will specifically detect and flag contrastive reframes:

```
Text: "It's not just a framework, it's a complete ecosystem"
Proposed detection:
  - Triggers 'contrastive-reframe' (HIGH severity)
  - Captures X="a framework" and Y="a complete ecosystem"
  - Match count: 1
```

## Pattern Specification

| Field | Value |
|-------|-------|
| **id** | `contrastive-reframe` |
| **name** | `Contrastive Reframe` |
| **description** | `AI pattern that negates a simpler idea (X) and replaces it with a more complex one (Y)` |
| **regex** | `(?is)\b(?:it['']s|it\s+is)\s+not\s+(?:(?:just|only|merely|simply)\s+)?(?<X>.+?(?=\s*(?:[,;:]|[—–-]|\.\s+)\s*(?:it['']s|it\s+is)\s+))\s*(?:[,;:]|[—–-]|\.\s+)\s*(?:it['']s|it\s+is)\s+(?<Y>.+)` |
| **severity** | `HIGH` |
| **weight** | `8` (SEVERITY_WEIGHTS.HIGH) |
| **examples** | See below |

### Examples that SHOULD match:

- "It's not just a tool, it's a paradigm shift"
- "It's not only about efficiency, it's about transformation"
- "It is not merely a framework; it is a comprehensive ecosystem"
- "It's not simply a design choice. It's a fundamental philosophy"
- "It's not a bug—it's a feature request"
- "It's not about speed, it's about acceleration"

### Examples that should NOT match:

- "It's not ready yet" (no Y clause)
- "This is not just a tool" (doesn't start with "it's/it is")
- "Not only X but also Y" (different structure, covered by negative-parallelism)
- "It isn't just a tool, it's more" (uses "isn't" instead of "is not")

## Regex Breakdown

The regex captures the following structure:

```
(?is)                                    # Case-insensitive, dotall mode
\b(?:it['']s|it\s+is)                   # "It's" or "It is" (with curly apostrophe support)
\s+not\s+                                # " not "
(?:(?:just|only|merely|simply)\s+)?     # Optional intensifier
(?<X>.+?                                 # Capture X (lazy)
  (?=\s*(?:[,;:]|[—–-]|\.\s+)          # Lookahead for punctuation separator
     \s*(?:it['']s|it\s+is)\s+))        # Followed by "it's/it is"
\s*(?:[,;:]|[—–-]|\.\s+)\s*            # Punctuation separator
(?:it['']s|it\s+is)\s+                  # Second "it's/it is"
(?<Y>.+)                                 # Capture Y (greedy to end or sentence)
```

**Key features:**
- Case-insensitive (`i` flag) catches "It's" and "it's"
- Dotall mode (`s` flag) allows multiline matching
- Named capture groups `(?<X>...)` and `(?<Y>...)` for both clauses
- Handles various punctuation: commas, semicolons, colons, em-dashes, en-dashes, periods
- Supports curly apostrophes (`'`) and straight apostrophes (`'`)
- Optional intensifiers: just, only, merely, simply

## Technical Approach

**Implementation location:** `backend/src/patterns/registry.ts`

**Steps:**
1. Add new pattern object to the PATTERNS array
2. Insert in the HIGH severity section (after existing HIGH patterns, before MEDIUM)
3. Use the pattern object structure:
   ```typescript
   {
     id: 'contrastive-reframe',
     name: 'Contrastive Reframe',
     description: 'AI pattern that negates a simpler idea (X) and replaces it with a more complex one (Y)',
     regex: /(?is)\b(?:it['']s|it\s+is)\s+not\s+(?:(?:just|only|merely|simply)\s+)?(?<X>.+?(?=\s*(?:[,;:]|[—–-]|\.\s+)\s*(?:it['']s|it\s+is)\s+))\s*(?:[,;:]|[—–-]|\.\s+)\s*(?:it['']s|it\s+is)\s+(?<Y>.+)/gisu,
     severity: 'HIGH',
     weight: SEVERITY_WEIGHTS.HIGH,
     examples: [
       "It's not just a tool, it's a paradigm shift",
       "It's not only about efficiency, it's about transformation",
       "It is not merely a framework; it is a comprehensive ecosystem",
       "It's not simply a design choice. It's a fundamental philosophy",
     ],
   }
   ```
4. Increment PATTERN_ENGINE_VERSION (minor version bump: 1.5.0 → 1.6.0)
5. Add comprehensive unit tests in `backend/src/patterns/registry.test.ts`

## Test Coverage Requirements

**Unit tests must cover:**
- Basic pattern matching with different intensifiers (just, only, merely, simply)
- Pattern matching without intensifiers ("It's not X, it's Y")
- Various punctuation separators (comma, semicolon, colon, em-dash, en-dash, period)
- Straight vs. curly apostrophes
- Case variations (It's vs. it's vs. It is)
- Multiline text with pattern spanning lines
- Named capture groups properly extract X and Y clauses
- Negative cases (should NOT match):
  - Missing Y clause
  - Different opening ("This is not...")
  - Contractions like "isn't" instead of "is not"
  - "not only...but also" structures

**Expected test count:** Minimum 15 test cases covering positive and negative scenarios

## Success Metrics

- Pattern successfully added to registry without breaking existing patterns
- All unit tests pass (existing + new)
- Pattern count increases by 1 (from current 44 to 45)
- Pattern engine version correctly incremented
- Validation passes with `openspec validate add-contrastive-reframe-pattern --strict`
- Zero regressions in existing pattern detection

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Regex complexity may cause performance issues | Use lazy quantifiers and lookaheads; test on large texts; similar complexity already exists in other patterns |
| False positives in legitimate writing | HIGH severity is appropriate; pattern is distinctive; human writers rarely use this structure |
| Named capture groups may not be supported in all JS engines | Named groups supported in Node 10+ and all modern browsers; project already uses ES2018+ features |
| Overlapping with existing patterns | This structure is unique; negative-parallelism uses "not only...but also" which is different |

## Dependencies

None - this is a standalone pattern addition that doesn't affect other patterns or system components.

## Backward Compatibility

**Breaking change:** NO

**Impact:**
- Existing analyses will continue to work
- New analyses will detect additional pattern
- Confidence scores may increase slightly for texts containing this pattern
- This is additive only—no changes to existing pattern behavior

**Migration:** None required - change takes effect immediately upon deployment

## Future Considerations

- Monitor false positive rate in production to adjust severity if needed
- Consider extracting X and Y clauses for semantic analysis (e.g., detecting specific word pairs)
- Evaluate adding similar patterns for other contrastive structures
- Consider adding pattern variations for other language constructs ("this isn't X, this is Y")
