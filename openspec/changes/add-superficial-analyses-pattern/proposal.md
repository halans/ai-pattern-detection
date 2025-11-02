# Add Superficial Analyses Phrasing Pattern

**Change ID:** add-superficial-analyses-pattern
**Status:** Draft
**Author:** AI Assistant
**Date:** 2025-11-02

## Summary

Introduce a new HIGH severity pattern that detects superficial analyses phrasing commonly used in AI-generated text. This pattern captures tell-tale "-ing" riders after commas or dashes (e.g., "…, highlighting …", "…, underscoring …") as well as finite-verb variants ("underscores", "illustrates", "aligns with", "contributes to"). These constructions signal shallow analytical claims that add minimal substantive value.

## Problem Statement

- AI models frequently append gerund phrases or use finite verbs to create an appearance of analysis without providing genuine insight.
- These constructions often take the form of participial riders after punctuation: "The event occurred, highlighting the importance of…" or finite variants: "This underscores the need for…"
- Existing patterns do not specifically target this structural tell that combines both syntactic position (post-comma/-dash) and lexical choice (specific verbs).
- Failing to flag these patterns misses a high-signal indicator of AI-generated pseudo-analysis common in Wikipedia articles, press releases, and marketing copy.

## Goals

1. Add a `superficial-analyses` pattern to `backend/src/patterns/registry.ts` with severity `HIGH` and weight `8`.
2. Use the provided regex (with case-insensitive and dotall support) to capture both gerund and finite-verb forms.
3. Capture the verb stem via named groups (`gerund`, `finite`, `finite2`) and the claim via named groups (`claim`, `claim2`, `claim3`) for downstream reporting.
4. Expand unit tests in `registry.test.ts` to cover:
   - Gerund forms after comma, semicolon, em-dash, en-dash, hyphen
   - Finite forms with demonstrative pronouns (this, that, these, those)
   - Finite forms with noun subjects (the move, the decision, the event, etc.)
   - Standalone finite forms (aligns with, contributes to)
   - Negative cases that should NOT match
   - Named capture group integrity
5. Update documentation and increment `PATTERN_ENGINE_VERSION` to `1.8.0`.

## Non-Goals

- Semantic validation of whether the claim following the verb is substantive or superficial.
- Detecting similar shallow analysis structures that use different verbs outside the specified set.
- Handling non-English text or localized variations of these phrases.

## User Stories

- **As a Wikipedia editor**, I want to flag articles that use superficial analysis phrasing so I can identify AI-generated or low-quality contributions.
- **As a content reviewer**, I want to detect when text uses formulaic analytical riders that add no real insight, enabling faster triage of spammy or AI-generated submissions.
- **As a journalist**, I want to identify press releases that employ these characteristic AI analysis patterns.

## Proposed Changes

- Add the `superficial-analyses` pattern object to the HIGH severity section of the registry, positioned alongside other credibility-focused detectors.
- Use named capture groups to surface:
  - `gerund`: the -ing verb form (ensuring, highlighting, emphasizing, etc.)
  - `finite`: the finite verb form (underscores, highlights, emphasizes, etc.)
  - `finite2`: standalone finite forms (aligns with, contributes to)
  - `claim` / `claim2` / `claim3`: the substantive claim following the verb
- Extend tests to verify:
  - Detection across all supported punctuation separators (comma, semicolon, em-dash, en-dash, hyphen)
  - Both gerund and finite forms
  - Correct capture of verb and claim components
  - Negative cases (verbs used in genuinely analytical contexts, different sentence structures)
- Bump `PATTERN_ENGINE_VERSION` from `1.7.0` to `1.8.0`.
- Update pattern count in documentation.

## Pattern Specification

| Field | Value |
|-------|-------|
| **id** | `superficial-analyses` |
| **name** | `Superficial Analyses Phrasing` |
| **description** | `AI pattern using gerund or finite verbs to create appearance of analysis without substantive insight` |
| **regex** | See technical specification below |
| **severity** | `HIGH` |
| **weight** | `8` (SEVERITY_WEIGHTS.HIGH) |
| **examples** | See below |

### Regex Pattern

```regex
(?is)\b(?:(?:[,;]\s*|[—–-]\s*)(?:(?:further\s+)?(?<gerund>ensuring|highlighting|emphasizing|reflecting|underscoring|showcasing|illustrating|signaling|demonstrating|attesting(?:\s+to)?|pointing(?:\s+to)?|speaking(?:\s+to)?|serving(?:\s+to)?|aligning(?:\s+with)?|contributing(?:\s+to)?|reinforcing|bolstering|cementing))\s+(?<claim>[^.?!;]+)|(?:(?:(?:[Tt]his|[Tt]hat|[Ii]t|[Tt]hese|[Tt]hose)\b|the\s+(?:move|decision|event|change|designation|recognition|invitation|citation(?:s)?|monument(?:\s+sign)?|policy|initiative|agreement|appointment|award|honou?r|report|study|finding|milestone|federation|summit|participation|monument))(?:\s+(?:has\s+been|was|were|is|are))?\s+(?<finite>underscores?|highlights?|emphasizes?|illustrates?|reflects?|showcases?|signals?|demonstrates?|attests?\s+to|points?\s+to|speaks?\s+to|aligns?\s+with|contributes?\s+to|reinforces?|bolsters?|cements?)\s+(?<claim2>[^.?!;]+))|(?:\b(?<finite2>aligns?\s+with|contributes?\s+to)\s+(?<claim3>[^.?!;]+)))
```

### Examples that SHOULD match

**Gerund forms (post-comma/dash):**
- "The policy was announced, highlighting the government's commitment to reform"
- "The company expanded operations; underscoring its market dominance"
- "The monument was unveiled—showcasing the city's rich heritage"
- "The initiative launched, further emphasizing stakeholder engagement"
- "The report was published, attesting to widespread support"
- "The agreement was signed, aligning with international standards"

**Finite forms with demonstratives:**
- "This underscores the importance of early intervention"
- "That highlights the challenges facing the industry"
- "These findings illustrate the need for policy reform"
- "Those results demonstrate significant progress"
- "It reflects the changing landscape of technology"

**Finite forms with noun subjects:**
- "The move underscores the organization's commitment to transparency"
- "The decision highlights the committee's priorities"
- "The event showcases the city's cultural diversity"
- "The designation reflects decades of community effort"
- "The appointment signals a new direction for the board"
- "The citation demonstrates widespread recognition"
- "The monument sign points to historical significance"

**Standalone finite forms:**
- "The strategy aligns with our core values"
- "This approach contributes to long-term sustainability"

### Examples that should NOT match

- "They highlighted key issues in the meeting" (simple past, not a rider)
- "Highlighting important points requires careful reading" (gerund as subject)
- "The highlighting tool is useful" (noun usage)
- "Underscored text appears darker" (participial adjective describing text)
- "She emphasizes quality over quantity" (standard subject-verb construction without superficial claim structure)

## Technical Approach

**Implementation location:** `backend/src/patterns/registry.ts`

**Steps:**
1. Add new pattern object to the PATTERNS array in the HIGH severity section
2. Insert after the `undue-notability` pattern and before the MEDIUM severity section
3. Use the pattern object structure:
   ```typescript
   {
     id: 'superficial-analyses',
     name: 'Superficial Analyses Phrasing',
     description: 'AI pattern using gerund or finite verbs to create appearance of analysis without substantive insight',
     regex: /(?is)\b(?:(?:[,;]\s*|[—–-]\s*)(?:(?:further\s+)?(?<gerund>ensuring|highlighting|emphasizing|reflecting|underscoring|showcasing|illustrating|signaling|demonstrating|attesting(?:\s+to)?|pointing(?:\s+to)?|speaking(?:\s+to)?|serving(?:\s+to)?|aligning(?:\s+with)?|contributing(?:\s+to)?|reinforcing|bolstering|cementing))\s+(?<claim>[^.?!;]+)|(?:(?:(?:[Tt]his|[Tt]hat|[Ii]t|[Tt]hese|[Tt]hose)\b|the\s+(?:move|decision|event|change|designation|recognition|invitation|citation(?:s)?|monument(?:\s+sign)?|policy|initiative|agreement|appointment|award|honou?r|report|study|finding|milestone|federation|summit|participation|monument))(?:\s+(?:has\s+been|was|were|is|are))?\s+(?<finite>underscores?|highlights?|emphasizes?|illustrates?|reflects?|showcases?|signals?|demonstrates?|attests?\s+to|points?\s+to|speaks?\s+to|aligns?\s+with|contributes?\s+to|reinforces?|bolsters?|cements?)\s+(?<claim2>[^.?!;]+))|(?:\b(?<finite2>aligns?\s+with|contributes?\s+to)\s+(?<claim3>[^.?!;]+)))/gius,
     severity: 'HIGH',
     weight: SEVERITY_WEIGHTS.HIGH,
     examples: [
       'The policy was announced, highlighting the government\'s commitment',
       'This underscores the importance of early intervention',
       'The move reflects the committee\'s priorities',
       'The strategy aligns with our core values',
     ],
   }
   ```
4. Increment PATTERN_ENGINE_VERSION from `1.7.0` to `1.8.0`
5. Add comprehensive unit tests in `backend/src/patterns/registry.test.ts`

## Test Coverage Requirements

**Unit tests must cover:**
- Gerund forms after each punctuation type (comma, semicolon, em-dash, en-dash, hyphen)
- Optional "further" modifier ("further highlighting")
- Multi-word verb phrases ("attesting to", "pointing to", "aligning with")
- Finite forms with demonstrative pronouns (this/that/it/these/those)
- Finite forms with specific noun subjects (the move, the decision, etc.)
- Optional auxiliary verbs ("has been", "was", "is")
- Standalone finite forms ("aligns with", "contributes to")
- Named capture groups correctly extract verb stem and claim text
- Negative cases (should NOT match):
  - Verbs used as simple past tense
  - Gerunds as sentence subjects
  - Noun usage of these words
  - Participial adjectives
  - Standard subject-verb constructions without superficial claim structure

**Expected test count:** Minimum 20 test cases covering positive and negative scenarios

## Success Metrics

- Pattern successfully added to registry without breaking existing patterns
- All unit tests pass (existing + new)
- Pattern count increases by 1 (from current 45 to 46)
- Pattern engine version correctly incremented to 1.8.0
- Validation passes with `openspec validate add-superficial-analyses-pattern --strict`
- Zero regressions in existing pattern detection

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Complex regex may cause performance issues | Use lazy quantifiers where appropriate; pattern is similar in complexity to existing patterns like `undue-notability` and `contrastive-reframe` |
| False positives in legitimate analytical writing | HIGH severity is justified; pattern targets specific structural tells rather than all uses of these verbs; human analytical writing typically embeds these verbs in more substantive contexts |
| Named capture groups may vary in which group catches the match | This is expected behavior; conditional branching in regex means only one path matches per instance; reporting logic should check all relevant groups |
| Overlapping with existing patterns | This structure is unique; no existing pattern targets post-comma gerund riders or these specific finite-verb constructions |

## Dependencies

None - this is a standalone pattern addition that doesn't affect other patterns or system components.

## Backward Compatibility

**Breaking change:** NO

**Impact:**
- Existing analyses will continue to work
- New analyses will detect this additional pattern
- Confidence scores may increase slightly for texts containing superficial analysis phrasing
- This is additive only—no changes to existing pattern behavior

**Migration:** None required - change takes effect immediately upon deployment

## Future Considerations

- Monitor false positive rate in production to adjust severity if needed
- Consider extracting verb+claim pairs for semantic analysis to identify the most common superficial claims
- Evaluate expanding the verb set based on corpus analysis of AI-generated text
- Consider adding severity gradation based on frequency (single occurrence vs. repeated use)
