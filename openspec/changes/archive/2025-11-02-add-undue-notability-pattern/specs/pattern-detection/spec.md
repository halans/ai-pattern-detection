# Pattern Detection Capabilities

## ADDED Requirements

### Requirement: Undue Notability Coverage Pattern Detection

The system MUST detect fabricated or exaggerated media coverage claims that enumerate multiple named outlets or assert “independent coverage,” using the `undue-notability` pattern with a captured `outlet_list` clause.

#### Scenario: Coverage claim with “including” list

**Given** a text contains "Our launch has been featured in multiple media outlets including Forbes, TechCrunch, and Bloomberg"
**When** the pattern analyzer processes the text
**Then** the system MUST detect an `undue-notability` pattern match
**And** the severity MUST be "HIGH"
**And** the match MUST capture the outlet list as "Forbes, TechCrunch, and Bloomberg"

#### Scenario: Coverage claim with colon separator

**Given** a text contains "The project was reported by national press: The New York Times, The Washington Post, and The Guardian"
**When** the pattern analyzer processes the text
**Then** the system MUST detect an `undue-notability` pattern match
**And** the outlet list MUST be captured as "The New York Times, The Washington Post, and The Guardian"

#### Scenario: Coverage claim with em dash separator

**Given** a text contains "Our story has been covered by various tech outlets—Wired, Fast Company, and VentureBeat"
**When** the pattern analyzer processes the text
**Then** the system MUST detect an `undue-notability` pattern match

#### Scenario: Independent coverage phrasing

**Given** a text contains "Independent coverage has examined the initiative with coverage by local business media"
**When** the pattern analyzer processes the text
**Then** the system MUST detect an `undue-notability` pattern match

#### Scenario: Multiple claims in one paragraph

**Given** a text contains "We were highlighted by several media outlets including CNBC and Bloomberg. Independent coverage has analyzed our approach with coverage by international tech media."
**When** the pattern analyzer processes the text
**Then** the analyzer MUST report two `undue-notability` matches

#### Scenario: Single outlet mention does not match

**Given** a text contains "Our product was featured in Forbes last week"
**When** the pattern analyzer processes the text
**Then** the system MUST NOT detect an `undue-notability` pattern match

