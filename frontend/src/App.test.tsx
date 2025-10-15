import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import type { AnalysisResult } from './types';
import { analyzeText, downloadJSON, downloadMarkdown } from './utils/api';

vi.mock('./utils/api', () => ({
  analyzeText: vi.fn(),
  downloadJSON: vi.fn(),
  downloadMarkdown: vi.fn(),
}));

const analyzeTextMock = vi.mocked(analyzeText);
const downloadJSONMock = vi.mocked(downloadJSON);
const downloadMarkdownMock = vi.mocked(downloadMarkdown);

describe('App clear text workflow', () => {
  const sampleResult: AnalysisResult = {
    classification: 'Likely AI-generated',
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

  it('allows downloading JSON and Markdown reports', async () => {
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

    await user.click(jsonButton);
    await user.click(markdownButton);

    expect(downloadJSONMock).toHaveBeenCalledTimes(1);
    expect(downloadMarkdownMock).toHaveBeenCalledTimes(1);
  });
});
