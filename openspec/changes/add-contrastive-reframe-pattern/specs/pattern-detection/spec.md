# Pattern Detection Capabilities

## ADDED Requirements

### Requirement: Contrastive Reframe Pattern Detection

The system MUST detect contrastive reframe writing structures where a simpler idea (X) is negated and replaced with a more complex idea (Y), using the construction "It's/It is not [intensifier?] X, it's/it is Y".

#### Scenario: Basic contrastive reframe with "just"

**Given** a text contains "It's not just a tool, it's a paradigm shift"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match
**And** the match MUST have patternId "contrastive-reframe"
**And** the severity MUST be "HIGH"
**And** the X clause MUST be captured as "a tool"
**And** the Y clause MUST be captured as "a paradigm shift"

#### Scenario: Contrastive reframe with "only"

**Given** a text contains "It's not only about efficiency, it's about transformation"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match
**And** the match MUST have patternId "contrastive-reframe"
**And** the X clause MUST be captured as "about efficiency"
**And** the Y clause MUST be captured as "about transformation"

#### Scenario: Contrastive reframe with "merely"

**Given** a text contains "It is not merely a framework; it is a comprehensive ecosystem"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match
**And** the match MUST have patternId "contrastive-reframe"
**And** the X clause MUST be captured as "a framework"
**And** the Y clause MUST be captured as "a comprehensive ecosystem"

#### Scenario: Contrastive reframe with "simply"

**Given** a text contains "It's not simply a design choice. It's a fundamental philosophy"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match
**And** the match MUST have patternId "contrastive-reframe"
**And** the X clause MUST be captured as "a design choice"
**And** the Y clause MUST be captured as "a fundamental philosophy"

#### Scenario: Contrastive reframe without intensifier

**Given** a text contains "It's not a bug—it's a feature request"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match
**And** the match MUST have patternId "contrastive-reframe"
**And** the X clause MUST be captured as "a bug"
**And** the Y clause MUST be captured as "a feature request"

#### Scenario: Contrastive reframe with comma separator

**Given** a text contains "It's not just efficiency, it's transformation"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match

#### Scenario: Contrastive reframe with semicolon separator

**Given** a text contains "It's not just efficiency; it's transformation"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match

#### Scenario: Contrastive reframe with colon separator

**Given** a text contains "It's not just efficiency: it's transformation"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match

#### Scenario: Contrastive reframe with em-dash separator

**Given** a text contains "It's not just efficiency—it's transformation"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match

#### Scenario: Contrastive reframe with en-dash separator

**Given** a text contains "It's not just efficiency–it's transformation"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match

#### Scenario: Contrastive reframe with period separator

**Given** a text contains "It's not just efficiency. It's transformation"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match

#### Scenario: Contrastive reframe with curly apostrophe

**Given** a text contains "It's not just a tool, it's a paradigm shift" (using curly apostrophe ')
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match

#### Scenario: Contrastive reframe with "It is" spelled out

**Given** a text contains "It is not just a framework, it is an ecosystem"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match

#### Scenario: Case-insensitive matching for lowercase "it's"

**Given** a text contains "it's not just a tool, it's a paradigm shift" (lowercase start)
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match

#### Scenario: Multiple contrastive reframes in one text

**Given** a text contains two contrastive reframe structures
**When** the pattern analyzer processes the text
**Then** the system MUST detect both pattern matches
**And** the total count MUST be 2

#### Scenario: Contrastive reframe spanning multiple lines

**Given** a text contains:
```
It's not just a tool,
it's a paradigm shift
```
**When** the pattern analyzer processes the text
**Then** the system MUST detect a contrastive-reframe pattern match

### Requirement: Contrastive Reframe Pattern Negative Cases

The system MUST NOT detect contrastive reframe patterns for incomplete or different structures.

#### Scenario: Incomplete structure with no Y clause

**Given** a text contains "It's not ready yet"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a contrastive-reframe pattern match

#### Scenario: Different subject structure

**Given** a text contains "This is not just a tool, this is a paradigm shift"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a contrastive-reframe pattern match

#### Scenario: Negative parallelism structure

**Given** a text contains "Not only a tool but also a paradigm shift"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a contrastive-reframe pattern match
**And** the pattern SHOULD trigger negative-parallelism instead

#### Scenario: Contraction "isn't" instead of "is not"

**Given** a text contains "It isn't just a tool, it's a paradigm shift"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a contrastive-reframe pattern match

#### Scenario: Missing second "it's/it is"

**Given** a text contains "It's not just a tool, a paradigm shift"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a contrastive-reframe pattern match

### Requirement: Contrastive Reframe Pattern Properties

The contrastive-reframe pattern MUST have proper metadata and be registered in the pattern registry.

#### Scenario: Pattern registered in registry

**Given** the pattern registry is loaded
**When** querying for pattern ID "contrastive-reframe"
**Then** the pattern MUST be present in the PATTERNS array
**And** the pattern MUST have id "contrastive-reframe"

#### Scenario: Pattern has HIGH severity

**Given** the contrastive-reframe pattern is loaded
**When** checking pattern severity
**Then** the severity MUST be "HIGH"
**And** the weight MUST be 8 (SEVERITY_WEIGHTS.HIGH)

#### Scenario: Pattern has descriptive metadata

**Given** the contrastive-reframe pattern is loaded
**When** checking pattern metadata
**Then** the name MUST be "Contrastive Reframe"
**And** the description MUST explain the X/Y structure
**And** the examples array MUST contain at least 4 examples

#### Scenario: Pattern regex uses correct flags

**Given** the contrastive-reframe pattern is loaded
**When** checking the regex configuration
**Then** the regex MUST have the case-insensitive flag (i)
**And** the regex MUST have the dotall flag (s)
**And** the regex MUST have the global flag (g)
**And** the regex MUST have the unicode flag (u)

### Requirement: Pattern Engine Version Update

The pattern engine version MUST be incremented to reflect the addition of a new pattern.

#### Scenario: Pattern engine version incremented

**Given** the contrastive-reframe pattern is added
**When** checking PATTERN_ENGINE_VERSION
**Then** the version MUST be incremented from 1.5.0 to 1.6.0

#### Scenario: Pattern count increased

**Given** the contrastive-reframe pattern is added
**When** counting total patterns in the registry
**Then** the PATTERNS array length MUST be at least 45
**And** the count MUST be 1 more than before the addition

### Requirement: Named Capture Groups

The regex MUST use named capture groups to extract the X and Y clauses for analysis and reporting.

#### Scenario: Named capture group for X clause

**Given** a text contains "It's not just simple, it's complex"
**When** the regex matches and extracts groups
**Then** the named group "X" MUST contain "simple"

#### Scenario: Named capture group for Y clause

**Given** a text contains "It's not just simple, it's complex"
**When** the regex matches and extracts groups
**Then** the named group "Y" MUST contain "complex"

#### Scenario: Capture groups handle punctuation correctly

**Given** a text contains "It's not just a framework; it is a comprehensive ecosystem"
**When** the regex matches and extracts groups
**Then** the X group MUST NOT include the semicolon
**And** the Y group MUST start after the semicolon and "it is"

### Requirement: Pattern Performance

The contrastive-reframe pattern MUST not significantly degrade analysis performance.

#### Scenario: Pattern matching completes in reasonable time

**Given** a text of 10,000 characters
**When** the pattern analyzer processes the text
**Then** the contrastive-reframe pattern matching MUST complete within the overall analysis time budget
**And** no performance regression MUST occur compared to pre-addition benchmarks
