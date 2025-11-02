# Pattern Detection Capabilities

## ADDED Requirements

### Requirement: Rule of Three Phrasing Pattern Detection

The system MUST detect triplet constructions ("X, Y, and Z") and triple-adjective phrases commonly overused in AI-generated text, using the `rule-of-three` pattern with captured triplet components.

#### Scenario: Short-phrase triplet with "and" conjunction

**Given** a text contains "keynote sessions, panel discussions, and networking opportunities"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `rule-of-three` pattern match
**And** the severity MUST be "MEDIUM"
**And** the match MUST capture item1 as "keynote sessions"
**And** the match MUST capture item2 as "panel discussions"
**And** the match MUST capture item3 as "networking opportunities"

#### Scenario: Short-phrase triplet with "or" conjunction

**Given** a text contains "fast, reliable, or affordable solutions"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `rule-of-three` pattern match
**And** the conjunction MUST be detected as "or"

#### Scenario: Single-word triplet

**Given** a text contains "efficiency, innovation, and growth"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `rule-of-three` pattern match
**And** all three single-word items MUST be captured

#### Scenario: Multi-word phrase triplet

**Given** a text contains "global SEO professionals, marketing experts, and growth hackers"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `rule-of-three` pattern match
**And** each multi-word phrase MUST be captured as a complete item

#### Scenario: Triple-adjective construction

**Given** a text contains "innovative, dynamic, and transformative solutions"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `rule-of-three` pattern match
**And** the three adjectives MUST be captured

#### Scenario: Triple-adjective with various suffixes

**Given** a text contains "comprehensive, scalable, and efficient platform"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `rule-of-three` pattern match
**And** adjectives with different suffixes (-ive, -able, -ent) MUST be detected

#### Scenario: Case-insensitive matching

**Given** a text contains "INNOVATION, EFFICIENCY, AND GROWTH"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `rule-of-three` pattern match

#### Scenario: Mixed case triplet

**Given** a text contains "Fast, Reliable, And Affordable"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `rule-of-three` pattern match

#### Scenario: Triplet with compound words

**Given** a text contains "co-founders, co-workers, and co-creators"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `rule-of-three` pattern match
**And** hyphens MUST be preserved in captured items

#### Scenario: Triplet with possessive forms

**Given** a text contains "SEO's importance, PPC's effectiveness, and ROI's measurement"
**When** the pattern analyzer processes the text
**Then** the system MUST detect a `rule-of-three` pattern match
**And** apostrophes MUST be preserved in captured items

#### Scenario: Multiple triplets in one paragraph

**Given** a text contains "We offer consulting, training, and support services. Our team includes experts, specialists, and consultants. Join us for sessions, workshops, and seminars."
**When** the pattern analyzer processes the text
**Then** the analyzer MUST report three `rule-of-three` matches

#### Scenario: Two-item list does not match

**Given** a text contains "apples and oranges"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `rule-of-three` pattern match

#### Scenario: Two-adjective list does not match

**Given** a text contains "fast and reliable service"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `rule-of-three` pattern match

#### Scenario: Four-item list does not match

**Given** a text contains "red, blue, green, and yellow"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `rule-of-three` pattern match

#### Scenario: Single item does not match

**Given** a text contains "innovation drives success"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `rule-of-three` pattern match

#### Scenario: Incomplete triplet does not match

**Given** a text contains "sessions, discussions, and"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `rule-of-three` pattern match

#### Scenario: Triplet without commas does not match

**Given** a text contains "sessions discussions and opportunities"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `rule-of-three` pattern match

#### Scenario: Phrases exceeding word limit do not match

**Given** a text contains "the very first comprehensive session, the second extremely important critical discussion, and the third absolutely essential strategic opportunity"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect a `rule-of-three` pattern match
**And** phrases exceeding 4 words MUST be excluded from matching
