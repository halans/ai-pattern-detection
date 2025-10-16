import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import type { AnalysisResult } from './types';
import { analyzeText, downloadJSON, downloadMarkdown, downloadPDF } from './utils/api';

vi.mock('./utils/api', () => ({
  analyzeText: vi.fn(),
  downloadJSON: vi.fn(),
  downloadMarkdown: vi.fn(),
  downloadPDF: vi.fn(),
}));

const analyzeTextMock = vi.mocked(analyzeText);
const downloadJSONMock = vi.mocked(downloadJSON);
const downloadMarkdownMock = vi.mocked(downloadMarkdown);
const downloadPDFMock = vi.mocked(downloadPDF);

describe('App clear text workflow', () => {
  const sampleResult: AnalysisResult = {
    classification: 'Likely AI Slop',
    confidence_score: 72,
    patterns_detected: [],
    explanation: 'Sample explanation',
    metadata: {
      character_count: 120,
      word_count: 24,
      pattern_engine_version: '1.2.0',
      analysis_duration: 10,
      timestamp: new Date().toISOString(),
      warnings: [],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('clears text, results, and errors when the clear button is used', async () => {
    const user = userEvent.setup();
    analyzeTextMock.mockResolvedValueOnce(sampleResult);

    render(<App />);

    const textarea = screen.getByLabelText(/enter text to analyze/i) as HTMLTextAreaElement;
    const clearButton = screen.getByRole('button', { name: /clear/i });
    const analyzeButton = screen.getByRole('button', { name: /analyze text/i });

    const validText = 'a'.repeat(150);
    await act(async () => {
      await user.type(textarea, validText);
      await user.click(analyzeButton);
    });

    await screen.findByText(/analysis results/i);

    await act(async () => {
      await user.click(clearButton);
    });

    await waitFor(() => {
      expect(textarea.value).toBe('');
      expect(clearButton).toBeDisabled();
      expect(screen.queryByText(/analysis results/i)).not.toBeInTheDocument();
    });

    analyzeTextMock.mockRejectedValueOnce(new Error('Server error'));

    await act(async () => {
      await user.clear(textarea);
      await user.type(textarea, validText);
      await user.click(analyzeButton);
    });

    await screen.findByText(/server error/i);

    await act(async () => {
      await user.click(clearButton);
    });

    await waitFor(() => {
      expect(textarea.value).toBe('');
      expect(clearButton).toBeDisabled();
      expect(screen.queryByText(/server error/i)).not.toBeInTheDocument();
    });
  });

  it('allows downloading JSON, Markdown, and PDF reports', async () => {
    const user = userEvent.setup();
    analyzeTextMock.mockResolvedValueOnce(sampleResult);

    render(<App />);

    const analyzeButton = screen.getByRole('button', { name: /analyze text/i });
    const textarea = screen.getByLabelText(/enter text to analyze/i);

    await act(async () => {
      await user.type(textarea, 'a'.repeat(150));
      await user.click(analyzeButton);
    });

    await screen.findByText(/analysis results/i);

    const jsonButton = screen.getByRole('button', { name: /download json/i });
    const markdownButton = screen.getByRole('button', { name: /download markdown/i });
    const pdfButton = screen.getByRole('button', { name: /download pdf/i });

    await user.click(jsonButton);
    await user.click(markdownButton);
    await user.click(pdfButton);

    expect(downloadJSONMock).toHaveBeenCalledTimes(1);
    expect(downloadMarkdownMock).toHaveBeenCalledTimes(1);
    expect(downloadPDFMock).toHaveBeenCalledTimes(1);
  });

  it('provides a skip link for keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink).toBeInTheDocument();

    await user.tab();
    expect(skipLink).toHaveFocus();
  });
});
