# Text Analysis Capability - Spec Delta

## ADDED Requirements

### Requirement: Pattern-Based Detection Engine

The system SHALL analyze text using regex-based pattern matching to detect AI-generated content signals.

#### Scenario: Analyze text with multiple AI patterns
- **WHEN** text containing "stands as a testament" and "it's important to note" is analyzed
- **THEN** both patterns are detected and counted
- **AND** each pattern match includes line number and context

#### Scenario: Analyze text with no AI patterns
- **WHEN** text containing only natural human writing is analyzed
- **THEN** zero pattern matches are returned
- **AND** the score reflects minimal AI likelihood

---

### Requirement: Significance Statement Detection

The system SHALL detect significance statements commonly used in AI-generated text.

#### Scenario: Detect "stands/serves as" patterns
- **WHEN** text contains "stands as a testament to" or "serves as a symbol of"
- **THEN** the pattern is flagged with severity level HIGH
- **AND** the match location is recorded

**Pattern:** `(stands|serves) as a (testament|symbol)`

---

### Requirement: Cultural Heritage Cliché Detection

The system SHALL detect overused cultural heritage phrases typical of AI writing.

#### Scenario: Detect cultural clichés
- **WHEN** text contains "rich cultural heritage" or "historical tapestry"
- **THEN** the pattern is flagged with severity level MEDIUM
- **AND** the cliché type is categorized

**Pattern:** `rich (cultural|historical) (heritage|tapestry)`

---

### Requirement: Editorializing Phrase Detection

The system SHALL detect unnecessary editorializing phrases common in AI outputs.

#### Scenario: Detect editorial insertions
- **WHEN** text contains "it's important to note" or "worth mentioning"
- **THEN** the pattern is flagged with severity level HIGH
- **AND** the phrase is highlighted in results

**Pattern:** `it('s| is) important to (note|remember|understand)`

---

### Requirement: Negative Parallelism Detection

The system SHALL detect "not only...but also" and similar constructions overused by AI.

#### Scenario: Detect parallelism patterns
- **WHEN** text contains "not just affordable but also sustainable"
- **THEN** the pattern is flagged with severity level MEDIUM
- **AND** both parts of the parallelism are captured

**Pattern:** `not (just|only).+but (also|rather)`

---

### Requirement: Challenges and Prospects Detection

The system SHALL detect formulaic "challenges and prospects" sections typical of AI summaries.

#### Scenario: Detect challenges/prospects headers
- **WHEN** text contains section headers like "Challenges and Prospects" or "Despite these challenges"
- **THEN** the pattern is flagged with severity level MEDIUM
- **AND** the section structure is noted

**Pattern:** `despite (its|these) challenges`

---

### Requirement: Ritual Conclusion Detection

The system SHALL detect formulaic conclusion phrases typical of AI summaries.

#### Scenario: Detect summary conclusions
- **WHEN** text contains "in summary" or "overall" at paragraph start
- **THEN** the pattern is flagged with severity level LOW
- **AND** the position in text is noted

**Pattern:** `^(in summary|overall|in conclusion)`

---

### Requirement: Knowledge Cutoff Disclaimer Detection

The system SHALL detect references to AI training data cutoffs.

#### Scenario: Detect cutoff disclaimers
- **WHEN** text contains "as of my last update" or "as at my latest training"
- **THEN** the pattern is flagged with severity level CRITICAL
- **AND** classified as explicit AI meta-text

**Pattern:** `as (of|at) my (last|latest) (update|training|knowledge)`

---

### Requirement: AI Self-Reference Detection

The system SHALL detect explicit AI self-identification phrases.

#### Scenario: Detect "as an AI" phrases
- **WHEN** text contains "as an AI language model" or "as an AI assistant"
- **THEN** the pattern is flagged with severity level CRITICAL
- **AND** the match is treated as definitive AI evidence

**Pattern:** `as an AI (language model|assistant|model)`

---

### Requirement: Placeholder Template Detection

The system SHALL detect placeholder text patterns common in AI outputs.

#### Scenario: Detect placeholder brackets
- **WHEN** text contains "[insert example here]" or "[placeholder text]"
- **THEN** the pattern is flagged with severity level HIGH
- **AND** the placeholder content is extracted

**Pattern:** `\[.*placeholder.*\]`

---

### Requirement: Collaborative Meta-Text Detection

The system SHALL detect overly helpful phrases suggesting AI assistance.

#### Scenario: Detect helpful AI phrases
- **WHEN** text contains "let me know if", "would you like", or "I hope this helps"
- **THEN** each phrase is flagged with severity level HIGH
- **AND** categorized as collaborative meta-text

**Patterns:**
- `(certainly|of course)!`
- `would you like`
- `let me know if`
- `here('s| is) a`
- `I hope this helps`

---

### Requirement: Formatting Pattern Detection

The system SHALL detect excessive or unusual formatting patterns in markdown/HTML.

#### Scenario: Detect emoji headings
- **WHEN** headings contain emoji characters (🎯, 🚀, etc.)
- **THEN** the pattern is flagged with severity level MEDIUM
- **AND** the emoji count is recorded

#### Scenario: Detect excessive emphasis
- **WHEN** text contains >10% bold or italic text
- **THEN** the pattern is flagged with severity level LOW
- **AND** the percentage is calculated

#### Scenario: Detect em-dash spam
- **WHEN** text contains >5 em-dashes (—) per 100 words
- **THEN** the pattern is flagged with severity level MEDIUM
- **AND** frequency is measured

#### Scenario: Detect title case headings
- **WHEN** text contains excessive Title Case In Headings
- **THEN** the pattern is flagged with severity level LOW

---

### Requirement: Range and List Pattern Detection

The system SHALL detect artificial "from X to Y" ranges and rule-of-three lists.

#### Scenario: Detect artificial ranges
- **WHEN** text contains "from beginners to experts" or "from design to deployment"
- **THEN** the pattern is flagged with severity level LOW
- **AND** the range terms are extracted

**Pattern:** `from .{3,20} to .{3,20}`

#### Scenario: Detect rule-of-three lists
- **WHEN** text contains exactly three parallel items (e.g., "fast, reliable, and secure")
- **THEN** the pattern is flagged with severity level LOW
- **AND** the triad structure is noted

---

### Requirement: Citation and Attribution Pattern Detection

The system SHALL detect vague or broken citation patterns.

#### Scenario: Detect broken citations
- **WHEN** text contains "[citation needed]" or "[source]"
- **THEN** the pattern is flagged with severity level MEDIUM

#### Scenario: Detect vague attributions
- **WHEN** text contains "studies show" or "research suggests" without specifics
- **THEN** the pattern is flagged with severity level MEDIUM

**Pattern:** `(studies|research|experts) (show|suggest|indicate)`

---

### Requirement: Quote Style Inconsistency Detection

The system SHALL detect mixing of straight and curly quotes.

#### Scenario: Detect quote mixing
- **WHEN** text contains both "straight quotes" and "curly quotes"
- **THEN** the pattern is flagged with severity level LOW
- **AND** inconsistency count is recorded

---

### Requirement: Scoring Algorithm

The system SHALL calculate an overall AI likelihood score based on pattern matches.

#### Scenario: Calculate score from pattern weights
- **WHEN** text has 2 CRITICAL patterns, 3 HIGH patterns, 2 MEDIUM patterns
- **THEN** the score is calculated as weighted sum normalized to 0-100
- **AND** the classification is "Likely AI-generated" (score ≥70)

#### Scenario: Low pattern count yields low score
- **WHEN** text has only 1 LOW severity pattern
- **THEN** the score is <30
- **AND** the classification is "Likely Human-written"

**Severity Weights:**
- CRITICAL: 20 points per match
- HIGH: 10 points per match
- MEDIUM: 5 points per match
- LOW: 2 points per match

**Score Thresholds:**
- 0-30: "Likely Human-written"
- 31-69: "Mixed/Uncertain"
- 70-100: "Likely AI-generated"

---

### Requirement: Pattern Pre-Compilation

The system SHALL pre-compile all regex patterns at initialization for performance.

#### Scenario: Initialize pattern engine
- **WHEN** the service starts
- **THEN** all patterns are compiled with case-insensitive flags
- **AND** compilation errors are logged and handled gracefully

---

### Requirement: Pattern Match Context

The system SHALL provide contextual information for each pattern match.

#### Scenario: Return match context
- **WHEN** a pattern is detected
- **THEN** the result includes surrounding text (±50 characters)
- **AND** the line number and character offset
- **AND** the matched substring

---

### Requirement: Text Preprocessing

The system SHALL normalize text before pattern analysis.

#### Scenario: Normalize whitespace and quotes
- **WHEN** text contains curly quotes, multiple spaces, or mixed line endings
- **THEN** text is normalized to straight quotes, single spaces, and LF line endings
- **AND** original formatting is preserved for display purposes

#### Scenario: Strip HTML tags for analysis
- **WHEN** HTML content is analyzed
- **THEN** tags are removed but text content is preserved
- **AND** formatting signals (e.g., `<strong>` density) are extracted separately

---

### Requirement: Text Input Validation

The system SHALL validate text input before processing.

#### Scenario: Valid text input
- **WHEN** user submits text with 100-20,000 characters
- **THEN** the system accepts the input for analysis

#### Scenario: Text too short
- **WHEN** user submits text with fewer than 100 characters
- **THEN** the system returns error "Text too short for reliable analysis (minimum 100 characters)"

#### Scenario: Text too long
- **WHEN** user submits text exceeding 20,000 characters
- **THEN** the system returns error "Text exceeds maximum length of 20,000 characters"

---

### Requirement: Performance Constraints

The system SHALL process text efficiently within Cloudflare Workers limits.

#### Scenario: Process 1000-word text under 50ms
- **WHEN** analyzing typical blog post length text
- **THEN** total CPU time is <50ms
- **AND** memory usage is <10MB

#### Scenario: Handle maximum input size
- **WHEN** text is 20,000 characters (max input)
- **THEN** processing completes within timeout
- **AND** all patterns are evaluated
