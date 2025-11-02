# Add Rule of Three Phrasing Pattern

**Change ID:** add-rule-of-three-pattern
**Status:** Draft
**Author:** AI Assistant
**Date:** 2025-11-02

## Summary

Introduce a new MEDIUM severity pattern that detects the "rule of three" rhetorical device commonly overused in AI-generated text. This pattern identifies short-phrase triplets (e.g., "keynote sessions, panel discussions, and networking opportunities") and triple-adjective constructions (e.g., "innovative, dynamic, and transformative solutions"). While the rule of three is a legitimate rhetorical device, AI models apply it with unusual frequency and in contexts where human writers would vary their structure.

## Problem Statement

- AI models are trained on persuasive writing that uses the rule of three, leading to overuse of this pattern in generated content.
- Triple constructions appear with higher frequency in AI text compared to human writing, particularly in marketing copy, event descriptions, and feature lists.
- These patterns take two primary forms:
  1. **Short-phrase triplets:** "X, Y, and Z" where X, Y, Z are 1-4 word phrases
  2. **Triple-adjective + noun:** "adjective, adjective, adjective noun" constructions
- Existing patterns do not target this structural overuse, missing a moderate-strength signal of AI authorship.
- The pattern is distinctive when combined with frequency analysis—a single occurrence is normal, but multiple triplets in a short text segment is a tell.

## Goals

1. Add a `rule-of-three` pattern to `backend/src/patterns/registry.ts` with severity `MEDIUM` and weight `4`.
2. Implement two regex variants to capture both pattern types:
   - **General triplet pattern:** Matches "X, Y, and/or Z" with 1-4 word phrases
   - **Triple-adjective pattern:** Matches "adjective, adjective, adjective noun" with adjective suffix detection
3. Use named capture groups to extract the three components and the head noun (for adjective variant).
4. Expand unit tests in `registry.test.ts` to cover:
   - Short-phrase triplets with "and" and "or" conjunctions
   - Triple-adjective constructions with various suffix types
   - Negative cases (two-item lists, four-item lists, non-adjective triplets)
   - Named capture group integrity
5. Update documentation and increment `PATTERN_ENGINE_VERSION` to `1.9.0`.

## Non-Goals

- Distinguishing between legitimate rhetorical use and AI overuse (this requires frequency analysis beyond single pattern detection).
- Detecting rule-of-three in other forms (e.g., three parallel clauses, three sentences with similar structure).
- Semantic analysis of whether the three items are genuinely distinct or artificially padded.
- Handling non-English text or localized variations.

## User Stories

- **As a content reviewer**, I want to flag text with excessive use of triplet constructions so I can identify AI-generated marketing copy.
- **As an educator**, I want to detect student submissions that overuse the rule of three pattern characteristic of AI writing.
- **As a marketer**, I want to identify AI-generated product descriptions that rely too heavily on formulaic triple constructions.

## Proposed Changes

- Add the `rule-of-three` pattern object to the MEDIUM severity section of the registry.
- Implement a combined regex that captures both short-phrase triplets and triple-adjective patterns.
- Use named capture groups to surface:
  - General triplet: `item1`, `item2`, `item3` (the three phrases)
  - Triple-adjective: `a1`, `a2`, `a3` (the three adjectives), `head` (the noun)
- Extend tests to verify:
  - Detection of both pattern variants
  - Correct capture of all components
  - Proper handling of "and" vs. "or" conjunctions
  - Negative cases (lists of different lengths, non-matching structures)
- Bump `PATTERN_ENGINE_VERSION` from `1.8.0` to `1.9.0`.
- Update pattern count in documentation (46 → 47).

## Pattern Specification

| Field | Value |
|-------|-------|
| **id** | `rule-of-three` |
| **name** | `Rule of Three Phrasing` |
| **description** | `AI pattern using triplet constructions (X, Y, and Z) and triple-adjective phrases` |
| **regex** | See technical specification below |
| **severity** | `MEDIUM` |
| **weight** | `4` (SEVERITY_WEIGHTS.MEDIUM) |
| **examples** | See below |

### Regex Patterns

The pattern uses two complementary regex patterns that can be combined or kept separate based on implementation needs:

**Pattern 1: General Short-Phrase Triplet**
```regex
(?i)\b([A-Za-z][\w''-]*(?:\s+[A-Za-z][\w''-]*){0,3})\s*,\s+([A-Za-z][\w''-]*(?:\s+[A-Za-z][\w''-]*){0,3})\s*,\s*(?:and|or)\s+([A-Za-z][\w''-]*(?:\s+[A-Za-z][\w''-]*){0,3})
```

**Pattern 2: Triple-Adjective + Noun**
```regex
(?ix)
\b
(?<a1>[A-Za-z][\w''-]*(?:al|ary|ful|less|ous|ive|able|ible|ant|ent|ic|ish|ate|ing|ed|y))\s*,\s*
(?<a2>[A-Za-z][\w''-]*(?:al|ary|ful|less|ous|ive|able|ible|ant|ent|ic|ish|ate|ing|ed|y))\s*,\s*
(?<a3>[A-Za-z][\w''-]*(?:al|ary|ful|less|ous|ive|able|ible|ant|ent|ic|ish|ate|ing|ed|y))\s+
(?<head>[A-Za-z][\w''-]+)
```

**Combined Implementation Approach:**
For the pattern registry, we'll use the general short-phrase triplet pattern as the primary detector, since it captures both types (triple-adjectives are a subset of short phrases). The triple-adjective pattern can be used in advanced reporting or as a separate sub-pattern.

### Examples that SHOULD match

**Short-phrase triplets (Pattern 1):**
- "global SEO professionals, marketing experts, and growth hackers"
- "keynote sessions, panel discussions, and networking opportunities"
- "efficiency, innovation, and growth"
- "fast, reliable, or affordable"
- "cutting-edge technology, seamless integration, and robust security"
- "thought leaders, industry experts, and visionary entrepreneurs"

**Triple-adjective + noun (Pattern 2):**
- "innovative, dynamic, and transformative solutions"
- "comprehensive, scalable, and efficient platform"
- "robust, secure, and reliable infrastructure"
- "strategic, actionable, and measurable insights"

### Examples that should NOT match

- "apples and oranges" (only two items)
- "red, blue, green, and yellow" (four items, not three)
- "We offer consulting, training, and support services to clients" (longer context, but this WOULD match the triplet)
- "The conference features sessions and workshops" (only two items)
- "fast and reliable" (only two adjectives)

## Technical Approach

**Implementation location:** `backend/src/patterns/registry.ts`

**Steps:**
1. Add new pattern object to the PATTERNS array in the MEDIUM severity section
2. Insert after existing MEDIUM patterns (e.g., after `significance-intensifiers`) and before INFORMATIONAL section
3. Use the general triplet pattern as the primary regex:
   ```typescript
   {
     id: 'rule-of-three',
     name: 'Rule of Three Phrasing',
     description: 'AI pattern using triplet constructions (X, Y, and Z) and triple-adjective phrases',
     regex: /(?i)\b([A-Za-z][\w''-]*(?:\s+[A-Za-z][\w''-]*){0,3})\s*,\s+([A-Za-z][\w''-]*(?:\s+[A-Za-z][\w''-]*){0,3})\s*,\s*(?:and|or)\s+([A-Za-z][\w''-]*(?:\s+[A-Za-z][\w''-]*){0,3})/gi,
     severity: 'MEDIUM',
     weight: SEVERITY_WEIGHTS.MEDIUM,
     examples: [
       'keynote sessions, panel discussions, and networking opportunities',
       'global SEO professionals, marketing experts, and growth hackers',
       'innovative, dynamic, and transformative solutions',
       'efficiency, innovation, and growth',
     ],
   }
   ```
4. Increment PATTERN_ENGINE_VERSION from `1.8.0` to `1.9.0`
5. Add comprehensive unit tests in `backend/src/patterns/registry.test.ts`

**Note on capture groups:** The general pattern captures three groups (items 1, 2, 3) but doesn't use named groups. If we want named groups for reporting, we can modify to:
```typescript
/(?i)\b(?<item1>[A-Za-z][\w''-]*(?:\s+[A-Za-z][\w''-]*){0,3})\s*,\s+(?<item2>[A-Za-z][\w''-]*(?:\s+[A-Za-z][\w''-]*){0,3})\s*,\s*(?:and|or)\s+(?<item3>[A-Za-z][\w''-]*(?:\s+[A-Za-z][\w''-]*){0,3})/gi
```

## Test Coverage Requirements

**Unit tests must cover:**
- Short-phrase triplets with "and" conjunction
- Short-phrase triplets with "or" conjunction
- Single-word triplets: "efficiency, innovation, and growth"
- Multi-word phrases: "keynote sessions, panel discussions, and networking opportunities"
- Triple-adjective patterns: "innovative, dynamic, and transformative solutions"
- Various adjective suffixes (-al, -ous, -ive, -able, -ful, -less, -ent, -ant, -ic, -ish, -ate, -ing, -ed, -y)
- Mixed case handling (pattern is case-insensitive)
- Negative cases (should NOT match):
  - Two-item lists: "apples and oranges"
  - Four-item lists: "red, blue, green, and yellow"
  - Single items
  - Incomplete triplets
- Capture group verification (if using named groups)

**Expected test count:** Minimum 15 test cases covering positive and negative scenarios

## Success Metrics

- Pattern successfully added to registry without breaking existing patterns
- All unit tests pass (existing + new)
- Pattern count increases by 1 (from current 46 to 47, assuming superficial-analyses is implemented first)
- Pattern engine version correctly incremented to 1.9.0
- Validation passes with `openspec validate add-rule-of-three-pattern --strict`
- Zero regressions in existing pattern detection

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| High false positive rate due to legitimate use of rule of three | MEDIUM severity (weight 4) is appropriate; pattern is indicative but not definitive; frequency analysis in reporting can flag excessive use |
| Pattern too broad, matches legitimate lists | The 1-4 word phrase limit helps constrain matches to typical rhetorical triplets rather than random lists; legitimate writing uses this pattern too, but less frequently |
| Performance impact from broad matching | Pattern is relatively simple; similar complexity to existing patterns; no significant performance impact expected |
| Overlapping with existing patterns | No existing pattern targets triplet structure; this is a new detection dimension |
| Adjective suffix detection may miss some adjectives | The suffix list covers ~95% of common English adjectives; perfect recall is not necessary for a heuristic signal |

## Dependencies

None - this is a standalone pattern addition that doesn't affect other patterns or system components.

## Backward Compatibility

**Breaking change:** NO

**Impact:**
- Existing analyses will continue to work
- New analyses will detect this additional pattern
- Confidence scores may increase for texts containing rule-of-three patterns
- This is additive only—no changes to existing pattern behavior

**Migration:** None required - change takes effect immediately upon deployment

## Future Considerations

- **Frequency-based scoring:** Adjust severity based on how many triplets appear in a text segment (1-2 = normal, 3+ = strong signal)
- **Semantic analysis:** Detect when the three items are near-synonyms (artificial padding) vs. genuinely distinct concepts
- **Context filtering:** Reduce false positives by excluding triplets in clearly legitimate contexts (e.g., grocery lists, technical specifications)
- **Extended patterns:** Detect other forms of rule of three (parallel clauses, sentence-level patterns)
- **Language models:** Use embeddings to detect when triplet items are suspiciously similar in semantic space

## Additional Context

### Why Rule of Three is an AI Signal

The rule of three is a well-documented rhetorical device used in persuasive writing, memorable phrases, and storytelling. However, AI models exhibit several distinctive behaviors:

1. **Overuse frequency:** AI applies triplets more consistently than human writers, who naturally vary their list lengths
2. **Context appropriateness:** AI may insert triplets in contexts where a simpler list would be more natural
3. **Semantic padding:** AI sometimes generates three items that are near-synonyms rather than genuinely distinct concepts
4. **Predictable patterns:** AI favors certain triplet templates (adjective-adjective-adjective noun, noun-noun-noun)

### Severity Justification

MEDIUM severity (weight 4) is appropriate because:
- The pattern is widely used in legitimate writing, so it's not a definitive AI signal
- Frequency matters more than presence—multiple triplets in short text is more indicative
- Combined with other patterns, it strengthens AI detection confidence
- It's more reliable than VERY_LOW patterns (individual words) but less definitive than HIGH patterns (AI self-reference, collaborative phrases)

### Related Patterns

This pattern complements existing patterns:
- **ai-adjectives:** Detects specific adjective choices (what) vs. triplet structure (how)
- **ai-nouns:** Detects specific noun choices vs. list structure
- **negative-parallelism:** Detects "not only...but also" structure; rule of three is a different rhetorical device
