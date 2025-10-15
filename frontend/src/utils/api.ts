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
