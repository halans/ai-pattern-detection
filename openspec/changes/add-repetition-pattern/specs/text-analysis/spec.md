# Text Analysis Capability - Spec Delta

## MODIFIED Requirements

### Requirement: Pattern-Based Detection Engine

The system SHALL analyze text using regex-based pattern matching to detect AI-generated content signals.

#### Scenario: Detect repeated n-grams
- **WHEN** normalized text ≤ 5,000 characters repeats a unigram, bigram, or trigram 3 or more times
- **THEN** the repetition pattern is flagged with severity LOW
- **AND** the most frequent repeated unit is returned with its repetition count and a representative context snippet.

#### Scenario: Detect repeated n-grams (medium length)
- **WHEN** normalized text between 5,001 and 10,000 characters repeats a unigram, bigram, or trigram 4 or more times
- **THEN** the repetition pattern is flagged with severity LOW
- **AND** the repeated unit data is returned.

#### Scenario: Detect repeated n-grams (long text)
- **WHEN** normalized text over 10,000 characters repeats a unigram, bigram, or trigram 5 or more times
- **THEN** the repetition pattern is flagged with severity LOW
- **AND** the repeated unit data is returned.

---

### Requirement: Pattern Match Context

The system SHALL provide contextual information for each pattern match.

#### Scenario: Include context for repetition pattern
- **WHEN** the repetition pattern triggers
- **THEN** the result includes at least one representative context window showing the repeated unit within the source text
- **AND** the match metadata includes the repetition count.

