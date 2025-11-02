# Frontend UI - PDF Export Text Wrapping

## MODIFIED Requirements

### Requirement: PDF Export Formatted Text Rendering

The system MUST render formatted text (bold, italic, code) in PDF exports with proper line wrapping to prevent text from extending beyond page margins.

#### Scenario: Long formatted text wraps to multiple lines

**Given** a detection result contains a paragraph with **bold text** exceeding page width
**When** the user exports the result to PDF
**Then** the bold text MUST wrap to multiple lines within the page margins
**And** the bold formatting MUST be preserved across line breaks
**And** no text MUST extend beyond the right margin of the page

#### Scenario: Mixed formatting wraps correctly

**Given** a detection result contains text with mixed formatting: "This is **bold** and _italic_ and `code` text that exceeds the page width"
**When** the user exports the result to PDF
**Then** the text MUST wrap at word boundaries
**And** bold formatting MUST be preserved where applied
**And** italic formatting MUST be preserved where applied
**And** code formatting MUST be preserved where applied
**And** all text MUST remain within page margins

#### Scenario: Single long word renders on own line

**Given** a detection result contains a single formatted word exceeding page width (e.g., **verylongwordthatexceedspagewidth**)
**When** the user exports the result to PDF
**Then** the word MUST be rendered on its own line
**And** the word MAY extend beyond margins if physically too large to fit
**And** the formatting MUST be preserved

#### Scenario: Multiple formatted segments wrap together

**Given** a detection result contains multiple consecutive formatted segments
**When** the combined width of segments exceeds page width
**Then** the segments MUST wrap to multiple lines
**And** each segment MUST preserve its individual formatting
**And** word boundaries MUST be respected when wrapping

#### Scenario: Wrapped text maintains vertical spacing

**Given** a detection result with wrapped formatted text
**When** the PDF is generated
**Then** the line spacing MUST be consistent with non-wrapped text
**And** the vertical spacing between paragraphs MUST remain unchanged
**And** the cursor position MUST update correctly after wrapped content

#### Scenario: Page breaks occur correctly with wrapped text

**Given** a detection result where wrapped formatted text approaches page bottom
**When** adding a new line would exceed page height
**Then** a page break MUST occur
**And** the remaining text MUST continue on the next page
**And** formatting MUST be preserved across the page break

#### Scenario: Case-insensitive and case-sensitive formatting wraps identically

**Given** detection results with "**BOLD**" and "**bold**" formatted text of equal length
**When** both are exported to PDF
**Then** both MUST wrap at the same character position
**And** both MUST preserve their case in the rendered output

#### Scenario: Empty or whitespace segments do not affect wrapping

**Given** a detection result contains empty formatted segments or whitespace-only segments
**When** the PDF is generated
**Then** empty segments MUST NOT add visual space
**And** wrapping MUST occur based on visible text width only

#### Scenario: Formatted text wrapping matches heading wrapping behavior

**Given** a PDF with both wrapped headings and wrapped formatted body text
**When** comparing wrapping behavior
**Then** both MUST wrap at the same page width
**And** both MUST use consistent line spacing
**And** both MUST handle word boundaries identically

#### Scenario: Short formatted text does not wrap unnecessarily

**Given** a detection result contains formatted text shorter than page width
**When** the PDF is generated
**Then** the text MUST render on a single line
**And** no line breaks MUST be introduced
**And** formatting MUST be applied correctly

#### Scenario: Text exactly fitting page width does not wrap

**Given** a detection result contains formatted text exactly matching page width
**When** the PDF is generated
**Then** the text MUST render on a single line
**And** no overflow MUST occur
**And** no wrapping MUST occur

#### Scenario: Width calculation accounts for font weight

**Given** a detection result contains "normal text" and "**bold text**" of identical character count
**When** width is calculated for PDF rendering
**Then** the bold text width MUST be greater than normal text width
**And** wrapping decisions MUST use the calculated bold width
**And** wrapping MUST occur earlier for bold text if needed

#### Scenario: Width calculation accounts for italic font

**Given** a detection result contains "normal text" and "_italic text_" of identical character count
**When** width is calculated for PDF rendering
**Then** the italic text width MUST be calculated using the italic font
**And** wrapping decisions MUST use the calculated italic width
**And** formatting MUST be preserved after wrapping

#### Scenario: Code formatting renders with monospace font

**Given** a detection result contains `code text` that needs wrapping
**When** the PDF is generated
**Then** the code text MUST use a monospace font
**And** width calculation MUST account for monospace character width
**And** code formatting MUST be preserved across line breaks

#### Scenario: Multiple paragraphs with formatted text each wrap independently

**Given** a detection result contains 3 paragraphs, each with long formatted text
**When** the PDF is generated
**Then** each paragraph MUST wrap independently
**And** vertical spacing between paragraphs MUST be consistent
**And** formatting within each paragraph MUST be preserved

## REMOVED Requirements

### Requirement: ~~Single-line formatted text rendering~~

**REMOVED:** The previous requirement allowed formatted text to render on a single line without wrapping, which caused text overflow issues. This requirement is replaced by the "PDF Export Formatted Text Rendering" requirement above.

#### ~~Scenario: Formatted text renders inline~~

**REMOVED:** This scenario is no longer valid as it allowed text overflow.

**Previous behavior:**
- **Given** a detection result contains formatted text
- **When** the PDF is generated
- **Then** the text MAY render on a single line
- **And** text MAY extend beyond page margins

**Reason for removal:** This caused unprofessional-looking PDFs with unreadable text extending beyond visible page area.
