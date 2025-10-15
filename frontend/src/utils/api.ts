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

function stripMarkdownFormatting(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/_/g, '')
    .trim();
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

    if (text.startsWith('# ')) {
      text = text.replace(/^#\s*/, '');
      fontSize = 20;
      fontStyle = 'bold';
      cursorY += baseLineHeight * 0.25;
    } else if (text.startsWith('## ')) {
      text = text.replace(/^##\s*/, '');
      fontSize = 16;
      fontStyle = 'bold';
    } else if (text.startsWith('### ')) {
      text = text.replace(/^###\s*/, '');
      fontSize = 14;
      fontStyle = 'bold';
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

    text = stripMarkdownFormatting(text);
    if (!text) {
      continue;
    }

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

  doc.save(filename);
}
