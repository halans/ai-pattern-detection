// API client for backend communication
import { AnalysisResult, ApiError } from '../types';
import { analysisResultToMarkdown } from './markdown';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Analysis failed');
  }

  return response.json();
}

export async function analyzeFile(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/analyze/file`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let error: ApiError | null = null;
    try {
      error = await response.json();
    } catch (_err) {
      // ignore parse errors
    }

    throw new Error(error?.message || 'File analysis failed');
  }

  return response.json();
}

export function downloadJSON(data: AnalysisResult, filename: string = 'ai-detection-report.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadMarkdown(data: AnalysisResult, filename: string = 'slop-report.md') {
  const markdown = analysisResultToMarkdown(data);
  const blob = new Blob([markdown], {
    type: 'text/markdown;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const tentative = current ? `${current} ${word}` : word;
    if (tentative.length > maxChars) {
      if (current) {
        lines.push(current);
        current = word;
      } else {
        lines.push(tentative);
        current = '';
      }
    } else {
      current = tentative;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

interface TextSegment {
  text: string;
  italic?: boolean;
  monospace?: boolean;
  bold?: boolean;
}

function parseMarkdownFormatting(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  // Pattern to match _`text`_ (italic monospace)
  const italicMonoRegex = /_`([^`]+)`_/g;
  // Pattern to match **text** (bold)
  const boldRegex = /\*\*([^*]+)\*\*/g;
  // Pattern to match `text` (monospace only)
  const monoRegex = /`([^`]+)`/g;
  // Pattern to match _text_ (italic only)
  const italicRegex = /_([^_]+)_/g;

  let lastIndex = 0;
  const matches: Array<{ start: number; end: number; segment: TextSegment }> = [];

  // Find all formatted segments
  let match: RegExpExecArray | null;

  // Check for italic monospace first (most specific)
  while ((match = italicMonoRegex.exec(text)) !== null) {
    const currentMatch = match as RegExpExecArray;
    matches.push({
      start: currentMatch.index,
      end: currentMatch.index + currentMatch[0].length,
      segment: { text: currentMatch[1], italic: true, monospace: true }
    });
  }

  // Check for bold
  while ((match = boldRegex.exec(text)) !== null) {
    const currentMatch = match as RegExpExecArray;
    const overlaps = matches.some(m =>
      (currentMatch.index >= m.start && currentMatch.index < m.end) ||
      (currentMatch.index + currentMatch[0].length > m.start && currentMatch.index + currentMatch[0].length <= m.end)
    );
    if (!overlaps) {
      matches.push({
        start: currentMatch.index,
        end: currentMatch.index + currentMatch[0].length,
        segment: { text: currentMatch[1], bold: true }
      });
    }
  }

  // Check for monospace only
  while ((match = monoRegex.exec(text)) !== null) {
    const currentMatch = match as RegExpExecArray;
    const overlaps = matches.some(m =>
      (currentMatch.index >= m.start && currentMatch.index < m.end) ||
      (currentMatch.index + currentMatch[0].length > m.start && currentMatch.index + currentMatch[0].length <= m.end)
    );
    if (!overlaps) {
      matches.push({
        start: currentMatch.index,
        end: currentMatch.index + currentMatch[0].length,
        segment: { text: currentMatch[1], monospace: true }
      });
    }
  }

  // Check for italic only
  while ((match = italicRegex.exec(text)) !== null) {
    const currentMatch = match as RegExpExecArray;
    const overlaps = matches.some(m =>
      (currentMatch.index >= m.start && currentMatch.index < m.end) ||
      (currentMatch.index + currentMatch[0].length > m.start && currentMatch.index + currentMatch[0].length <= m.end)
    );
    if (!overlaps) {
      matches.push({
        start: currentMatch.index,
        end: currentMatch.index + currentMatch[0].length,
        segment: { text: currentMatch[1], italic: true }
      });
    }
  }

  // Sort by start position
  matches.sort((a, b) => a.start - b.start);

  // Build segments array with plain text between formatted segments
  for (const match of matches) {
    if (match.start > lastIndex) {
      const plainText = text.slice(lastIndex, match.start);
      if (plainText) {
        segments.push({ text: plainText });
      }
    }
    segments.push(match.segment);
    lastIndex = match.end;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    const plainText = text.slice(lastIndex);
    if (plainText) {
      segments.push({ text: plainText });
    }
  }

  return segments.length > 0 ? segments : [{ text: text }];
}

export async function downloadPDF(
  data: AnalysisResult,
  filename: string = 'slop-report.pdf'
): Promise<void> {
  const markdown = analysisResultToMarkdown(data);
  const [{ default: jsPDF }] = await Promise.all([import('jspdf')]);

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 56;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const baseLineHeight = 18;
  let cursorY = margin;

  const ensureSpace = () => {
    if (cursorY > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
  };

  /**
   * Renders formatted text segments with word wrapping to prevent overflow.
   * Preserves bold, italic, and monospace formatting across line breaks.
   * @param segments - Array of text segments with formatting flags
   * @param x - Starting X position (left margin)
   * @param y - Starting Y position
   * @param fontSize - Font size in points
   * @param lineSpacing - Line height for wrapped lines (defaults to baseLineHeight)
   * @returns Final Y position after rendering all segments
   */
  const renderTextWithFormatting = (segments: TextSegment[], x: number, y: number, fontSize: number, lineSpacing: number = baseLineHeight): number => {
    let currentX = x;
    let currentY = y;

    /**
     * Measures the width of text in the current font settings.
     * Accounts for bold and italic variations.
     */
    const measureText = (content: string) => {
      const docAny = doc as unknown as {
        getTextWidth?: (text: string) => number;
        getStringUnitWidth?: (text: string) => number;
        getFontSize?: () => number;
      };

      if (typeof docAny.getTextWidth === 'function') {
        return docAny.getTextWidth(content);
      }

      if (typeof docAny.getStringUnitWidth === 'function') {
        const unitWidth = docAny.getStringUnitWidth(content);
        const currentFontSize =
          typeof docAny.getFontSize === 'function' ? docAny.getFontSize() : fontSize;
        return unitWidth * currentFontSize;
      }

      return content.length * (fontSize * 0.5);
    };

    for (const segment of segments) {
      const font = segment.monospace ? 'courier' : 'helvetica';
      const style = segment.bold ? 'bold' : (segment.italic ? 'italic' : 'normal');

      doc.setFont(font, style);
      doc.setFontSize(fontSize);

      // Split segment text into words to enable wrapping at word boundaries
      const words = segment.text.split(/(\s+)/); // Preserve whitespace

      for (const word of words) {
        if (!word) continue;

        const wordWidth = measureText(word);

        // Check if adding this word would exceed the page width
        if (currentX + wordWidth > margin + contentWidth && currentX > x) {
          // Wrap to new line
          currentX = x;
          currentY += lineSpacing;

          // Update outer cursorY before calling ensureSpace so page break detection works
          cursorY = currentY;
          ensureSpace();

          // Sync currentY with cursorY in case ensureSpace added a page break
          currentY = cursorY;

          // Skip leading whitespace on new lines
          if (/^\s+$/.test(word)) {
            continue;
          }
        }

        doc.text(word, currentX, currentY);
        currentX += wordWidth;
      }
    }

    // Return Y position for next line (add spacing after the last rendered line)
    return currentY + lineSpacing;
  };

  const lines = markdown.split('\n');

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      cursorY += baseLineHeight * 0.5;
      continue;
    }

    let text = trimmed;
    let fontSize = 12;
    let fontStyle: 'normal' | 'bold' = 'normal';
    let indent = 0;
    let lineHeight = baseLineHeight;
    let isHeading = false;

    if (text.startsWith('# ')) {
      text = text.replace(/^#\s*/, '');
      fontSize = 20;
      fontStyle = 'bold';
      cursorY += baseLineHeight * 0.25;
      isHeading = true;
    } else if (text.startsWith('## ')) {
      text = text.replace(/^##\s*/, '');
      fontSize = 16;
      fontStyle = 'bold';
      isHeading = true;
    } else if (text.startsWith('### ')) {
      text = text.replace(/^###\s*/, '');
      fontSize = 14;
      fontStyle = 'bold';
      isHeading = true;
    } else if (text.startsWith('- ')) {
      text = text.slice(2);
      indent = 18;
    } else if (text.startsWith('    - ')) {
      text = text.slice(6);
      indent = 36;
    } else if (/^Context:/i.test(text)) {
      indent = 36;
      fontSize = 11;
      lineHeight = baseLineHeight * 0.9;
    }

    if (!text) {
      continue;
    }

    // Parse markdown formatting for non-heading lines
    if (!isHeading) {
      // Remove pattern IDs from PDF (e.g., "(ID: `pattern-id`, count: 3)" becomes "(count: 3)")
      text = text.replace(/\(ID:\s*`[^`]+`,\s*(count:\s*\d+)\)/g, '($1)');
      // Remove standalone ID references
      text = text.replace(/\(ID:\s*`[^`]+`\)/g, '');

      const segments = parseMarkdownFormatting(text);

      // Render formatted text with proper wrapping at word boundaries
      ensureSpace();
      cursorY = renderTextWithFormatting(segments, margin + indent, cursorY, fontSize, lineHeight);
    } else {
      // For headings, keep simple rendering
      const wrappedLines = wrapText(text, Math.max(20, Math.floor((contentWidth - indent) / 6)));

      doc.setFont('helvetica', fontStyle);
      doc.setFontSize(fontSize);

      for (const line of wrappedLines) {
        ensureSpace();
        doc.text(line, margin + indent, cursorY);
        cursorY += lineHeight;
      }

      if (fontStyle === 'bold') {
        cursorY += baseLineHeight * 0.2;
      }
    }
  }

  doc.save(filename);
}
