# Implementation Tasks: Add Contrastive Reframe Pattern

## Pattern Registry Updates

- [ ] Add contrastive-reframe pattern to PATTERNS array in `backend/src/patterns/registry.ts`
  - Locate the HIGH severity section (after line 242, after business-jargon pattern)
  - Insert new pattern object before the MEDIUM severity comment
  - Use the following structure:
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
  - Ensure proper comma placement and formatting

- [ ] Increment PATTERN_ENGINE_VERSION in `backend/src/patterns/registry.ts`
  - Locate PATTERN_ENGINE_VERSION constant (line 520)
  - Change value from '1.5.0' to '1.6.0'
  - Add comment documenting the change: `// v1.6.0: Added contrastive-reframe pattern`

## Testing - Basic Pattern Matching

- [ ] Add test suite for contrastive-reframe pattern in `backend/src/patterns/registry.test.ts`
  - Create new describe block: `describe('Contrastive Reframe Pattern', () => { ... })`
  - Place after existing pattern matching tests (around line 163)

- [ ] Test basic pattern matching with "just" intensifier
  - Test string: "It's not just a tool, it's a paradigm shift"
  - Verify pattern.regex.test() returns true
  - Verify match is found

- [ ] Test pattern matching with "only" intensifier
  - Test string: "It's not only about efficiency, it's about transformation"
  - Verify pattern matches

- [ ] Test pattern matching with "merely" intensifier
  - Test string: "It is not merely a framework; it is a comprehensive ecosystem"
  - Verify pattern matches

- [ ] Test pattern matching with "simply" intensifier
  - Test string: "It's not simply a design choice. It's a fundamental philosophy"
  - Verify pattern matches

- [ ] Test pattern matching without intensifier
  - Test string: "It's not a bug—it's a feature request"
  - Verify pattern matches

## Testing - Punctuation Variations

- [ ] Test comma separator
  - Test string: "It's not just efficiency, it's transformation"
  - Verify pattern matches

- [ ] Test semicolon separator
  - Test string: "It's not just efficiency; it's transformation"
  - Verify pattern matches

- [ ] Test colon separator
  - Test string: "It's not just efficiency: it's transformation"
  - Verify pattern matches

- [ ] Test em-dash separator
  - Test string: "It's not just efficiency—it's transformation"
  - Verify pattern matches

- [ ] Test en-dash separator
  - Test string: "It's not just efficiency–it's transformation"
  - Verify pattern matches

- [ ] Test period separator
  - Test string: "It's not just efficiency. It's transformation"
  - Verify pattern matches

## Testing - Apostrophe and Case Variations

- [ ] Test curly apostrophe (')
  - Test string: "It's not just a tool, it's a paradigm shift" (with ' instead of ')
  - Verify pattern matches

- [ ] Test straight apostrophe (')
  - Test string: "It's not just a tool, it's a paradigm shift" (with ' standard apostrophe)
  - Verify pattern matches

- [ ] Test "It is" spelled out
  - Test string: "It is not just a framework, it is an ecosystem"
  - Verify pattern matches

- [ ] Test lowercase "it's"
  - Test string: "it's not just a tool, it's a paradigm shift"
  - Verify pattern matches (case-insensitive)

## Testing - Negative Cases (Must NOT Match)

- [ ] Test incomplete structure with no Y clause
  - Test string: "It's not ready yet"
  - Verify pattern does NOT match

- [ ] Test different subject ("This is")
  - Test string: "This is not just a tool, this is a paradigm shift"
  - Verify pattern does NOT match

- [ ] Test "not only...but also" structure
  - Test string: "Not only a tool but also a paradigm shift"
  - Verify contrastive-reframe pattern does NOT match
  - Note: This should match negative-parallelism pattern instead

- [ ] Test contraction "isn't" instead of "is not"
  - Test string: "It isn't just a tool, it's a paradigm shift"
  - Verify pattern does NOT match

- [ ] Test missing second "it's/it is"
  - Test string: "It's not just a tool, a paradigm shift"
  - Verify pattern does NOT match

## Testing - Named Capture Groups

- [ ] Test named capture group extraction for X clause
  - Test string: "It's not just simple, it's complex"
  - Use match with named groups: `match.groups.X`
  - Verify X group contains "simple"

- [ ] Test named capture group extraction for Y clause
  - Test string: "It's not just simple, it's complex"
  - Use match with named groups: `match.groups.Y`
  - Verify Y group contains "complex"

- [ ] Test capture groups with punctuation
  - Test string: "It's not just a framework; it is a comprehensive ecosystem"
  - Verify X does not include semicolon
  - Verify Y starts with "a comprehensive ecosystem"

## Testing - Edge Cases

- [ ] Test multiple matches in one text
  - Test string: "It's not just a tool, it's a framework. It's not only about code, it's about architecture."
  - Verify global flag finds both matches
  - Verify match count is 2

- [ ] Test multiline text
  - Test string with newline between clauses:
    ```
    It's not just a tool,
    it's a paradigm shift
    ```
  - Verify pattern matches (dotall flag should handle this)

- [ ] Test long X and Y clauses
  - Test with clauses over 50 characters each
  - Verify pattern matches and captures correctly

## Testing - Pattern Metadata

- [ ] Test pattern is registered in registry
  - Use getPatternById('contrastive-reframe')
  - Verify pattern is not undefined

- [ ] Test pattern has correct severity
  - Verify pattern.severity === 'HIGH'
  - Verify pattern.weight === 8

- [ ] Test pattern has correct metadata
  - Verify pattern.name === 'Contrastive Reframe'
  - Verify pattern.description is defined and meaningful
  - Verify pattern.examples.length >= 4

- [ ] Test pattern regex has correct flags
  - Verify pattern.regex.flags includes 'i' (case-insensitive)
  - Verify pattern.regex.flags includes 's' (dotall)
  - Verify pattern.regex.flags includes 'g' (global)
  - Verify pattern.regex.flags includes 'u' (unicode)

## Pattern Engine Version Tests

- [ ] Update version test in `backend/src/patterns/registry.test.ts`
  - Locate test "should match the current pattern engine version" (line 211-213)
  - Update expected version from '1.5.0' to '1.6.0'

- [ ] Update pattern count test in `backend/src/patterns/registry.test.ts`
  - Locate test "should have at least 44 patterns" (line 11-13)
  - Update expected count from 44 to 45

## Code Quality and Documentation

- [ ] Add code comment above pattern definition
  - Explain the contrastive reframe structure
  - Reference proposal document for rationale
  - Example:
    ```typescript
    // Contrastive Reframe: Detects "It's not just X, it's Y" structures
    // where AI negates a simpler idea and replaces with a more complex one
    // See: openspec/changes/add-contrastive-reframe-pattern/proposal.md
    ```

- [ ] Ensure consistent code formatting
  - Run Prettier on registry.ts
  - Verify indentation matches existing patterns
  - Check trailing commas match project style

## Validation and Build

- [ ] Run unit tests to verify all functionality
  - Execute `npm test` in backend directory
  - Verify all new contrastive-reframe tests pass
  - Ensure no regressions in existing tests

- [ ] Run TypeScript compilation
  - Execute `npm run type-check` or `tsc --noEmit` in backend
  - Verify no type errors
  - Confirm Pattern type compatibility

- [ ] Run linter
  - Execute `npm run lint` in backend
  - Fix any ESLint warnings or errors
  - Ensure code meets project standards

- [ ] Test with sample texts
  - Create sample text files with contrastive reframe patterns
  - Run through analyzer
  - Verify detection works end-to-end

## Integration Testing

- [ ] Test pattern in full analysis pipeline
  - Create test case in `backend/src/patterns/analyzer.test.ts`
  - Provide sample text with multiple patterns including contrastive-reframe
  - Verify contrastive-reframe appears in results with correct severity

- [ ] Test pattern weight contribution to confidence score
  - Analyze text with only contrastive-reframe pattern
  - Verify weight of 8 (HIGH) is properly applied
  - Check confidence calculation includes this pattern

- [ ] Verify no conflicts with existing patterns
  - Test text that might trigger both contrastive-reframe and negative-parallelism
  - Ensure patterns don't double-count similar structures
  - Verify each pattern triggers independently when appropriate

## Documentation Updates

- [ ] Update pattern count in documentation (if applicable)
  - Check README or docs for pattern count references
  - Update from 44 to 45 patterns
  - Note version 1.6.0 addition

- [ ] Add example to pattern documentation (if exists)
  - Include contrastive-reframe in pattern examples
  - Show sample matches and use cases

## Performance Testing

- [ ] Benchmark pattern matching performance
  - Test on 10,000 character text
  - Verify no significant performance degradation
  - Compare analysis time before and after pattern addition

- [ ] Test with texts containing no matches
  - Verify regex fails fast on non-matching text
  - Check for any performance issues with backtracking

## Final Validation

- [ ] Run OpenSpec validation
  - Execute `openspec validate add-contrastive-reframe-pattern --strict`
  - Resolve any validation errors
  - Ensure all specs and tasks align

- [ ] Verify change is ready for review
  - All tests pass
  - All tasks completed
  - Code quality checks pass
  - Documentation updated
