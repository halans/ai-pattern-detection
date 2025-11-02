# Text Analysis Pattern Updates

## MODIFIED Requirements

### Requirement: Em-Dash Spam Detection

The system MUST detect excessive em-dash usage using length-aware thresholds that scale based on text size to reduce false positives in longer documents.

#### Scenario: Em-dash detection in short text (under 5,000 characters)

**Given** a text with fewer than 5,000 characters
**When** the text contains more than 3 em-dashes (—)
**Then** the system MUST flag it as em-dash spam
**And** the pattern match MUST have patternId "em-dash-spam"
**And** the severity MUST be "VERY LOW"

#### Scenario: Em-dash acceptable in short text

**Given** a text with fewer than 5,000 characters
**When** the text contains exactly 3 em-dashes or fewer
**Then** the system MUST NOT flag it as em-dash spam

#### Scenario: Em-dash detection in medium text (5,000-10,000 characters)

**Given** a text between 5,000 and 10,000 characters (inclusive)
**When** the text contains more than 5 em-dashes
**Then** the system MUST flag it as em-dash spam
**And** the pattern match MUST have patternId "em-dash-spam"
**And** the severity MUST be "VERY LOW"

#### Scenario: Em-dash acceptable in medium text

**Given** a text between 5,000 and 10,000 characters (inclusive)
**When** the text contains exactly 5 em-dashes or fewer
**Then** the system MUST NOT flag it as em-dash spam

#### Scenario: Em-dash detection in long text (over 10,000 characters)

**Given** a text with more than 10,000 characters
**When** the text contains more than 6 em-dashes
**Then** the system MUST flag it as em-dash spam
**And** the pattern match MUST have patternId "em-dash-spam"
**And** the severity MUST be "VERY LOW"

#### Scenario: Em-dash acceptable in long text

**Given** a text with more than 10,000 characters
**When** the text contains exactly 6 em-dashes or fewer
**Then** the system MUST NOT flag it as em-dash spam

#### Scenario: Em-dash count includes all occurrences

**Given** a text of any length with em-dashes
**When** the system counts em-dashes for threshold comparison
**Then** it MUST count every em-dash character (—) in the text
**And** the count MUST be the total number of em-dash occurrences regardless of context

#### Scenario: Boundary case at 5,000 characters exactly

**Given** a text with exactly 5,000 characters
**When** the text contains 4 em-dashes
**Then** the system MUST NOT flag it as em-dash spam
**And** the medium text threshold (5 em-dashes) MUST apply

#### Scenario: Boundary case at 10,000 characters exactly

**Given** a text with exactly 10,000 characters
**When** the text contains 6 em-dashes
**Then** the system MUST NOT flag it as em-dash spam
**And** the medium text threshold (5 em-dashes) MUST apply

### Requirement: Em-Dash Pattern Match Structure

When em-dash spam is detected, the system MUST provide match details showing where em-dashes appear in the text.

#### Scenario: Pattern match includes em-dash locations

**Given** a text that exceeds the em-dash threshold for its length
**When** the pattern match is generated
**Then** the match MUST include an array of individual em-dash occurrences
**And** each occurrence MUST have the matched text (em-dash character)
**And** each occurrence MUST have the index position in the original text
**And** each occurrence MUST have surrounding context (±50 characters)

#### Scenario: Match count reflects total em-dashes

**Given** a text with 8 em-dashes that exceeds the threshold
**When** the pattern match is created
**Then** the count field MUST equal 8
**And** the count MUST represent the total number of em-dashes found

### Requirement: Em-Dash Pattern Removal from Regex Array

The em-dash-spam pattern MUST be removed from the regex-based PATTERNS array and handled as a special case like repetition detection.

#### Scenario: Em-dash pattern not in PATTERNS array

**Given** the pattern registry is loaded
**When** searching for patterns with regex-based detection
**Then** the em-dash-spam pattern MUST NOT be present in the PATTERNS array
**And** regex pattern matching MUST NOT be used for em-dash detection

#### Scenario: Em-dash detection uses custom logic

**Given** the PatternAnalyzer analyzes text
**When** em-dash detection is performed
**Then** it MUST use a dedicated detection method (not regex-based pattern matching)
**And** the method MUST count em-dashes and apply length-based thresholds
**And** the detection MUST occur in the analyze() method similar to repetition patterns

## REMOVED Requirements

### Requirement: Fixed Em-Dash Threshold

~~The previous requirement for a fixed threshold of 3 em-dashes regardless of text length is removed.~~

This requirement is replaced by the length-aware threshold system defined above.
