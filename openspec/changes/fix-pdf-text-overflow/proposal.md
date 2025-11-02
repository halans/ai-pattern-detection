# Fix PDF Text Overflow Issue

**Change ID:** fix-pdf-text-overflow
**Status:** Draft
**Author:** AI Assistant
**Date:** 2025-11-02

## Summary

Fix the PDF export functionality where formatted text with markdown (bold, italic, code) extends beyond the right margin of the page. Currently, the `renderTextWithFormatting` function renders text segments on a single line without checking page width boundaries, causing text overflow. This change implements proper text wrapping for formatted content, similar to how headings are already wrapped.

## Problem Statement

- PDF exports display text that extends beyond the right side of the page when formatted text (with **bold**, _italic_, or `code` markdown) is too long
- The `renderTextWithFormatting` function in `frontend/src/utils/api.ts` (lines 323-326) explicitly states: "For now, render on a single line (wrapping complex segments is difficult)"
- Only headings use the `wrapText` function for proper wrapping (lines 72-97)
- Formatted text segments are rendered inline without width measurement or wrapping logic
- This creates an unprofessional appearance and makes some PDF exports unreadable

## Goals

1. Implement text wrapping for formatted content in the `renderTextWithFormatting` function
2. Measure text segment widths and wrap when they exceed the available page width
3. Preserve markdown formatting (bold, italic, code) across wrapped lines
4. Maintain consistent behavior with existing heading wrapping logic
5. Ensure proper vertical spacing and cursor positioning after wrapped segments
6. Handle mixed formatting (e.g., bold + italic) correctly across line breaks

## Non-Goals

- Changing the PDF layout, margins, or font sizes
- Implementing hyphenation or word-breaking within words
- Modifying the markdown parsing logic
- Adding new markdown formatting support
- Changing how headings are wrapped (they already work correctly)

## User Stories

- **As a content reviewer**, I want to export detection results to PDF with properly wrapped text so I can read all content without horizontal scrolling or text cutoff
- **As an educator**, I want to share PDF reports with properly formatted text that fits within page margins
- **As a user**, I want professional-looking PDF exports that don't have text extending beyond the visible page area

## Proposed Changes

### Core Changes

**Location:** `frontend/src/utils/api.ts`

1. **Modify `renderTextWithFormatting` function** (lines 229-263):
   - Add width measurement for each text segment before rendering
   - Track cumulative line width as segments are added
   - When adding a segment would exceed `contentWidth`, start a new line
   - Update `cursorY` position when wrapping to new lines
   - Preserve formatting styles across line breaks

2. **Add text width measurement utility**:
   - Create helper function to measure text width with current font settings
   - Account for bold and italic font variations (width may differ)
   - Use jsPDF's `getTextWidth()` method for accurate measurements

3. **Implement line breaking logic**:
   - Break at word boundaries when possible
   - If a single word is too long, render it on its own line
   - Maintain proper spacing between wrapped segments

### Technical Approach

The fix will modify the `renderTextWithFormatting` function to:

```typescript
function renderTextWithFormatting(
  segments: TextSegment[],
  x: number,
  y: number,
  fontSize: number
): number {
  let currentX = x;
  let currentY = y;
  const contentWidth = pageWidth - 2 * margin; // Available width

  for (const segment of segments) {
    // Measure segment width
    const segmentWidth = doc.getTextWidth(segment.text);

    // Check if segment fits on current line
    if (currentX + segmentWidth > margin + contentWidth && currentX > x) {
      // Wrap to new line
      currentX = x;
      currentY += fontSize * lineSpacing;
      ensureSpace(); // Check for page breaks
    }

    // Apply formatting and render
    applyFormatting(segment.bold, segment.italic, segment.code);
    doc.text(segment.text, currentX, currentY);
    currentX += segmentWidth;
  }

  return currentY;
}
```

### Changes Required

1. **frontend/src/utils/api.ts**:
   - Remove the "render on a single line" comment and logic (lines 323-326)
   - Implement width tracking and line wrapping in `renderTextWithFormatting`
   - Add proper `cursorY` updates after rendering wrapped content
   - Test with various formatting combinations

## Test Coverage Requirements

**Manual testing must cover:**
- Long plain text paragraphs (no formatting)
- Long text with **bold** formatting
- Long text with _italic_ formatting
- Long text with `code` formatting
- Mixed formatting: **_bold italic_**, _`italic code`_, **`bold code`**
- Multiple formatted segments in a single line
- Text that exactly fits page width
- Text that slightly exceeds page width (by 1 word)
- Text that significantly exceeds page width (by multiple words)
- Page breaks within wrapped formatted text
- Consistency with heading wrapping behavior

**Automated E2E tests:**
- Add test case in `frontend/tests/e2e/` to verify PDF export with long formatted text
- Verify no text extends beyond page margins
- Verify formatting is preserved across line breaks

## Success Metrics

- All formatted text wraps properly within page margins
- No text extends beyond the right edge of the page
- Formatting styles (bold, italic, code) are preserved across line breaks
- Vertical spacing is consistent and professional
- PDF exports are readable without horizontal scrolling
- No regressions in existing PDF export functionality
- Manual tests pass for all formatting combinations

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Incorrect width measurements for bold/italic fonts | Use jsPDF's `getTextWidth()` which accounts for current font settings; test with all formatting variants |
| Breaking in the middle of formatted segments | Split segments at word boundaries; if a single word is too long, render on its own line |
| Performance impact from width calculations | Width calculation is lightweight; similar to existing heading wrapping which has no performance issues |
| Incorrect cursor positioning after wrapping | Return final Y position from function; test with multiple wrapped paragraphs to verify spacing |
| Page breaks during wrapped segments | Existing `ensureSpace()` function already handles page breaks; call it after each line wrap |

## Dependencies

None - this is a localized fix to the PDF rendering logic.

## Backward Compatibility

**Breaking change:** NO

**Impact:**
- Existing PDF exports will look better (text will wrap instead of overflow)
- This is a visual improvement only—no API or data format changes
- Users may notice PDFs are slightly longer (more pages) if previously overflowing text now wraps to multiple lines

**Migration:** None required - change takes effect immediately in new PDF exports

## Future Considerations

- **Hyphenation:** Add word-breaking with hyphens for very long words
- **Justified text:** Align wrapped text to both left and right margins
- **Widow/orphan control:** Prevent single words on last line of paragraph
- **Column layout:** Support multi-column PDF layouts for better space utilization
- **Custom page sizes:** Allow users to choose different PDF page dimensions

## Additional Context

### Current Behavior

The `renderTextWithFormatting` function (lines 229-263) currently:
1. Parses markdown formatting into segments with bold/italic/code flags
2. Renders each segment sequentially at increasing X positions
3. Does not check if X position exceeds page width
4. Has a TODO comment: "For now, render on a single line (wrapping complex segments is difficult)"

### Why This Matters

- **Professionalism:** Overflowing text makes PDFs appear broken or unprofessional
- **Readability:** Users cannot read text that extends beyond the visible page area
- **Consistency:** Headings already wrap correctly; body text should behave the same way
- **User experience:** PDF export is a key feature for sharing detection results

### Implementation Notes

- The `wrapText` function (lines 72-97) already demonstrates the wrapping approach for plain text
- We can adapt this logic for formatted segments
- The `ensureSpace()` function (lines 99-116) handles page breaks and should be called after each wrapped line
- The `parseMarkdown` function (lines 186-227) already splits text into segments with formatting flags
