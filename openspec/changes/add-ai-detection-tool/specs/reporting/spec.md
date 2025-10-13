# Reporting Capability - Spec Delta

## ADDED Requirements

### Requirement: Confidence Score Calculation
The system SHALL generate a confidence score between 0-100% indicating likelihood of AI authorship.

#### Scenario: High confidence AI detection
- **WHEN** analysis completes with strong AI signals (perplexity, burstiness, model output)
- **THEN** the system returns confidence score ≥ 75%

#### Scenario: High confidence human detection
- **WHEN** analysis completes with strong human signals
- **THEN** the system returns confidence score ≤ 25%

#### Scenario: Uncertain detection
- **WHEN** analysis shows mixed signals
- **THEN** the system returns confidence score between 25-75%

---

### Requirement: Classification Label Generation
The system SHALL assign a clear classification label based on confidence score.

#### Scenario: AI-written classification
- **WHEN** confidence score is ≥ 75%
- **THEN** the system assigns label "AI-written"

#### Scenario: Human-written classification
- **WHEN** confidence score is ≤ 25%
- **THEN** the system assigns label "Human-written"

#### Scenario: Mixed classification
- **WHEN** confidence score is between 25-75%
- **THEN** the system assigns label "Mixed" or "Uncertain"

---

### Requirement: Pattern Match Breakdown Report
The system SHALL provide detailed breakdown of detected AI writing patterns contributing to the score.

#### Scenario: Pattern match listing
- **WHEN** analysis completes
- **THEN** the system returns all detected patterns grouped by severity (CRITICAL, HIGH, MEDIUM, LOW)
- **AND** each pattern includes: pattern_name, match_count, severity, sample_matches

#### Scenario: Pattern weighting display
- **WHEN** generating breakdown
- **THEN** each severity level's contribution to total score is shown
- **AND** pattern weights are: CRITICAL (20pts), HIGH (10pts), MEDIUM (5pts), LOW (2pts)

#### Scenario: Top contributing patterns
- **WHEN** multiple patterns detected
- **THEN** the system ranks patterns by total contribution (match_count × weight)
- **AND** displays top 5 patterns with highest impact

---

### Requirement: Explainability Notes
The system SHALL generate plain-language explanation of detection results.

#### Scenario: AI detection explanation
- **WHEN** text is classified as AI-written
- **THEN** the system provides explanation like "The text shows unusually consistent structure and low linguistic variability typical of AI outputs."

#### Scenario: Human detection explanation
- **WHEN** text is classified as human-written
- **THEN** the system provides explanation like "The text exhibits natural variation in sentence structure and personal voice consistent with human writing."

#### Scenario: Mixed classification explanation
- **WHEN** text is classified as mixed
- **THEN** the system provides explanation like "The text shows both AI-like patterns and human characteristics. It may be AI-generated with human editing."

---

### Requirement: JSON Output Format
The system SHALL return structured JSON report with all analysis results.

#### Scenario: Complete JSON response
- **WHEN** analysis completes successfully
- **THEN** the system returns JSON containing: classification, confidence_score, patterns_detected array, explanation, timestamp, input_metadata

#### Scenario: JSON schema validation
- **WHEN** JSON is generated
- **THEN** the system validates against defined schema with required fields

#### Scenario: Error JSON format
- **WHEN** analysis fails
- **THEN** the system returns JSON with: error field, error_code, message, timestamp

---

### Requirement: PDF Report Generation
The system SHALL generate downloadable PDF report with visualizations.

#### Scenario: PDF report creation
- **WHEN** user requests PDF download
- **THEN** the system generates formatted PDF with: classification, confidence score, bar chart visualization, signal breakdown, explanation

#### Scenario: PDF report styling
- **WHEN** generating PDF
- **THEN** the system applies professional styling with logo, headers, and footer with generation timestamp

#### Scenario: PDF download
- **WHEN** PDF generation completes
- **THEN** the system provides download link valid for 24 hours

---

### Requirement: Confidence Visualization
The system SHALL provide visual representation of confidence score and signal breakdown.

#### Scenario: Confidence bar chart
- **WHEN** displaying results in frontend
- **THEN** the system renders horizontal bar chart showing confidence score (0-100%)

#### Scenario: Pattern frequency chart
- **WHEN** displaying pattern breakdown
- **THEN** the system renders bar chart showing top detected patterns by frequency

#### Scenario: Color coding
- **WHEN** visualizing confidence
- **THEN** the system uses color scale: red (AI-written), yellow (mixed), green (human-written)

---

### Requirement: Analysis Metadata
The system SHALL include metadata about the analysis in the report.

#### Scenario: Input metadata
- **WHEN** generating report
- **THEN** the system includes: character_count, word_count, file_format (if applicable), language_detected

#### Scenario: Processing metadata
- **WHEN** generating report
- **THEN** the system includes: analysis_duration, pattern_engine_version, timestamp, api_version

#### Scenario: Warnings and limitations
- **WHEN** text has known limitations (too short, truncated, etc.)
- **THEN** the system includes warnings array in metadata

---

### Requirement: Report Generation (No Caching)
The system SHALL generate reports on-demand without persistent storage.

#### Scenario: Real-time report generation
- **WHEN** analysis completes
- **THEN** the system generates report immediately and returns to user
- **AND** no report is cached or stored

#### Scenario: Report regeneration
- **WHEN** user wants to re-analyze the same text
- **THEN** the system performs fresh analysis (no cached results)

#### Scenario: Privacy guarantee
- **WHEN** report is delivered to user
- **THEN** no copy of the report remains on the server
- **AND** no analysis history is logged

---

### Requirement: Report Export Formats
The system SHALL support multiple export formats for analysis reports.

#### Scenario: JSON export
- **WHEN** user requests JSON format
- **THEN** the system provides downloadable JSON file with complete analysis

#### Scenario: PDF export
- **WHEN** user requests PDF format
- **THEN** the system provides downloadable formatted PDF report

#### Scenario: CSV export for batch analysis
- **WHEN** user has multiple analyses
- **THEN** the system provides CSV with: filename, classification, confidence, timestamp
