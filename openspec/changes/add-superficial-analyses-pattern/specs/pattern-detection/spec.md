# Pattern Detection Capabilities

## ADDED Requirements

### Requirement: Superficial Analyses Phrasing Pattern Detection

The system MUST detect superficial analyses phrasing commonly used in AI-generated text, including gerund riders after commas/dashes and finite-verb variants with demonstratives or noun subjects, using the `superficial-analyses` pattern with captured verb and claim components.

#### Scenario: Gerund form after comma

**Given** a text contains "The policy was announced, highlighting the government's commitment to reform"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the severity MUST be "HIGH"
**And** the match MUST capture the gerund as "highlighting"
**And** the match MUST capture the claim as "the government's commitment to reform"

#### Scenario: Gerund form after semicolon

**Given** a text contains "The company expanded operations; underscoring its market dominance"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured gerund MUST be "underscoring"

#### Scenario: Gerund form after em-dash

**Given** a text contains "The monument was unveiled—showcasing the city's rich heritage"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured gerund MUST be "showcasing"

#### Scenario: Gerund form with "further" modifier

**Given** a text contains "The event occurred, further emphasizing stakeholder engagement"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured gerund MUST be "emphasizing"

#### Scenario: Multi-word gerund verb phrase

**Given** a text contains "The report was published, attesting to widespread support"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured gerund MUST match "attesting" (with "to" handled in the verb phrase)

#### Scenario: Finite form with demonstrative pronoun "This"

**Given** a text contains "This underscores the importance of early intervention"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured finite verb MUST be "underscores"
**And** the captured claim MUST be "the importance of early intervention"

#### Scenario: Finite form with demonstrative pronoun "That"

**Given** a text contains "That highlights the challenges facing the industry"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured finite verb MUST be "highlights"

#### Scenario: Finite form with demonstrative pronoun "These"

**Given** a text contains "These findings illustrate the need for policy reform"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured finite verb MUST be "illustrate"

#### Scenario: Finite form with noun subject "the move"

**Given** a text contains "The move underscores the organization's commitment to transparency"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured finite verb MUST be "underscores"

#### Scenario: Finite form with noun subject "the decision"

**Given** a text contains "The decision highlights the committee's priorities"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured finite verb MUST be "highlights"

#### Scenario: Finite form with noun subject "the event"

**Given** a text contains "The event showcases the city's cultural diversity"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured finite verb MUST be "showcases"

#### Scenario: Finite form with noun subject and auxiliary verb

**Given** a text contains "The policy has been implemented, illustrating the government's commitment"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match

#### Scenario: Standalone finite form "aligns with"

**Given** a text contains "The strategy aligns with our core values"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured finite verb MUST match "aligns with"
**And** the captured claim MUST be "our core values"

#### Scenario: Standalone finite form "contributes to"

**Given** a text contains "This approach contributes to long-term sustainability"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `superficial-analyses` pattern match
**And** the captured finite verb MUST match "contributes to"

#### Scenario: Multiple matches in one paragraph

**Given** a text contains "The policy was announced, highlighting its importance. This underscores the committee's dedication. The move aligns with international standards."
**When** the pattern analyzer processes the text
**Then** the analyzer MUST report three `superficial-analyses` matches

#### Scenario: Simple past tense does not match

**Given** a text contains "They highlighted key issues in the meeting"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `superficial-analyses` pattern match

#### Scenario: Gerund as sentence subject does not match

**Given** a text contains "Highlighting important points requires careful reading"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `superficial-analyses` pattern match

#### Scenario: Noun usage does not match

**Given** a text contains "The highlighting tool is useful for students"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `superficial-analyses` pattern match

#### Scenario: Participial adjective does not match

**Given** a text contains "Underscored text appears darker on the page"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `superficial-analyses` pattern match

#### Scenario: Standard subject-verb construction does not match

**Given** a text contains "She emphasizes quality over quantity in her work"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `superficial-analyses` pattern match
