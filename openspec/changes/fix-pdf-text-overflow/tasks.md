# Implementation Tasks: Fix PDF Text Overflow

**Change ID:** fix-pdf-text-overflow
**Status:** Draft

## Task Checklist

### Phase 1: Analysis and Preparation

- [x] **Analyze current PDF rendering code**
  - Location: `frontend/src/utils/api.ts`
  - Reviewed `renderTextWithFormatting` function (lines 229-263)
  - Identified problem: renders on single line without width checking (lines 323-326)
  - Confirmed `wrapText` function exists for headings (lines 72-97)

- [ ] **Study existing wrapping implementation**
  - Review `wrapText` function logic for plain text
  - Understand how it measures width and breaks lines
  - Note how it handles `cursorY` updates and page breaks

- [ ] **Test current behavior**
  - Generate PDF with long formatted text
  - Verify text overflow occurs
  - Take screenshots for before/after comparison

### Phase 2: Core Implementation

- [ ] **Add text width measurement helper**
  - Location: `frontend/src/utils/api.ts` (add near other utility functions)
  - Create `measureSegmentWidth` function that uses `doc.getTextWidth()`
  - Account for bold/italic font variations
  - Test with different formatting combinations

- [ ] **Implement line wrapping logic in renderTextWithFormatting**
  - Location: `frontend/src/utils/api.ts` lines 229-263
  - Track cumulative line width as segments are added
  - Check if adding segment exceeds `contentWidth`
  - When overflow detected, wrap to new line
  - Update `currentX` and `currentY` positions
  - Call `ensureSpace()` after wrapping to handle page breaks

- [ ] **Handle word boundary breaking**
  - Split segments at word boundaries when possible
  - If single word exceeds line width, render on its own line
  - Preserve spacing between words

- [ ] **Update cursor positioning after wrapped content**
  - Location: `frontend/src/utils/api.ts` lines 323-326
  - Remove "render on a single line" comment
  - Use returned Y position from `renderTextWithFormatting`
  - Update `cursorY = renderTextWithFormatting(...)`

- [ ] **Preserve formatting across line breaks**
  - Ensure bold/italic/code formatting persists when text wraps
  - Test mixed formatting: **_bold italic_**, _`italic code`_
  - Verify font settings are maintained

### Phase 3: Testing and Validation

- [ ] **Manual testing with various content types**
  - Test long plain text paragraphs
  - Test long text with **bold** formatting
  - Test long text with _italic_ formatting
  - Test long text with `code` formatting
  - Test mixed formatting combinations
  - Test text that exactly fits page width
  - Test text that slightly exceeds width (1 word)
  - Test text that significantly exceeds width (many words)

- [ ] **Test edge cases**
  - Single very long word that exceeds line width
  - Empty segments or whitespace-only segments
  - Multiple consecutive formatted segments
  - Formatted text at end of page (triggers page break)
  - Text with special characters in formatting

- [ ] **Visual regression testing**
  - Generate PDFs before and after fix
  - Verify no text extends beyond margins
  - Check vertical spacing is consistent
  - Confirm headings still wrap correctly (no regressions)
  - Verify page breaks occur at correct positions

- [ ] **Add automated E2E test**
  - Location: `frontend/tests/e2e/` (create or update test file)
  - Test: Generate PDF with long formatted text
  - Verify: No text overflow in generated PDF
  - Verify: Formatting preserved across line breaks

### Phase 4: Documentation and Cleanup

- [ ] **Update code comments**
  - Remove "For now, render on a single line" comment
  - Add documentation for text wrapping logic
  - Document the `measureSegmentWidth` helper function
  - Add inline comments for wrapping algorithm

- [ ] **Update user documentation**
  - Update `README.md` if it mentions PDF export limitations
  - Document that PDF exports now wrap formatted text properly
  - Note any changes in PDF appearance (may be slightly longer)

### Phase 5: Final Validation

- [ ] **Run all existing tests**
  - Execute: `npm test`
  - Verify no regressions in other functionality
  - Check that all existing tests still pass

- [ ] **Run E2E tests**
  - Execute: `npm run test:e2e`
  - Verify PDF export tests pass
  - Check for any visual regressions

- [ ] **Performance testing**
  - Generate PDFs with large amounts of formatted text (10+ pages)
  - Measure rendering time before and after fix
  - Verify no significant performance degradation (<10% increase acceptable)

- [ ] **Cross-browser testing**
  - Test PDF generation in Chrome
  - Test PDF generation in Firefox
  - Test PDF generation in Safari
  - Verify consistent behavior across browsers

- [ ] **Validate with OpenSpec**
  - Run: `openspec validate fix-pdf-text-overflow --strict`
  - Resolve any validation errors
  - Ensure all spec requirements are met

### Phase 6: Final Checks

- [ ] **Code review checklist**
  - Width calculation logic is correct
  - Line wrapping preserves formatting
  - Cursor positioning is accurate
  - Page breaks are handled correctly
  - No magic numbers (use named constants)
  - Code is readable and well-commented

- [ ] **Manual acceptance testing**
  - Export sample detection results to PDF
  - Verify all text is readable and within margins
  - Check that formatting looks professional
  - Confirm no horizontal scrolling needed
  - Validate page breaks occur naturally

- [ ] **Before/after comparison**
  - Generate same PDF before and after fix
  - Document visual improvements
  - Verify text content is identical (only layout changed)
  - Take screenshots for documentation

## Verification Commands

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run frontend dev server (for manual testing)
npm run dev

# Validate OpenSpec
openspec validate fix-pdf-text-overflow --strict

# Check for specific change
openspec show fix-pdf-text-overflow --json --deltas-only
```

## Success Criteria

- ✅ All formatted text wraps within page margins
- ✅ No text extends beyond right edge of page
- ✅ Formatting (bold, italic, code) preserved across line breaks
- ✅ Vertical spacing is consistent and professional
- ✅ No regressions in existing PDF export functionality
- ✅ Manual tests pass for all formatting combinations
- ✅ Automated E2E tests pass
- ✅ OpenSpec validation passes with --strict flag
- ✅ Performance impact is negligible (<10% increase)

## Notes

- The `wrapText` function (lines 72-97) provides a good reference for the wrapping algorithm
- The `ensureSpace()` function already handles page breaks, so we can reuse it
- The `parseMarkdown` function already splits text into formatted segments
- jsPDF's `getTextWidth()` method accounts for current font settings (bold/italic)
- Need to track X position across segments to know when line is full
- Word boundary breaking improves readability vs. breaking mid-word

## Implementation Order

1. First, study and test current behavior thoroughly
2. Implement width measurement helper function
3. Add wrapping logic to `renderTextWithFormatting`
4. Update cursor positioning after wrapped content
5. Test manually with various formatting combinations
6. Add automated E2E test
7. Validate and finalize
