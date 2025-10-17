import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import type { AnalysisResult } from './types';
import { analyzeText, downloadJSON, downloadMarkdown, downloadPDF } from './utils/api';
import { ThemeProvider } from './theme/ThemeProvider';

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

const renderWithTheme = () =>
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );

describe('App clear text workflow', () => {
  const sampleResult: AnalysisResult = {
    classification: 'Likely AI Slop',
    confidence_score: 72,
    patterns_detected: [],
    explanation: 'Sample explanation',
    metadata: {
      character_count: 120,
      word_count: 24,
      pattern_engine_version: '1.3.0',
      analysis_duration: 10,
      timestamp: new Date().toISOString(),
      warnings: [],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query.includes('dark') ? false : true,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });
  });

  it('clears text, results, and errors when the clear button is used', async () => {
    const user = userEvent.setup();
    analyzeTextMock.mockResolvedValueOnce(sampleResult);

    renderWithTheme();

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

    renderWithTheme();

    const analyzeButton = screen.getByRole('button', { name: /analyze text/i });
    const textarea = screen.getByLabelText(/enter text to analyze/i);

    await act(async () => {
      await user.type(textarea, 'a'.repeat(150));
      await user.click(analyzeButton);
    });

    await screen.findByText(/analysis results/i);

    const jsonButton = screen.getByRole('button', { name: /download report as json/i });
    const markdownButton = screen.getByRole('button', { name: /download report as markdown/i });
    const pdfButton = screen.getByRole('button', { name: /download report as pdf/i });

    await user.click(jsonButton);
    await user.click(markdownButton);
    await user.click(pdfButton);

    expect(downloadJSONMock).toHaveBeenCalledTimes(1);
    expect(downloadMarkdownMock).toHaveBeenCalledTimes(1);
    expect(downloadPDFMock).toHaveBeenCalledTimes(1);
  });

  it('provides a skip link for keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithTheme();

    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink).toBeInTheDocument();

    await user.tab();
    expect(skipLink).toHaveFocus();
  });

  it('toggles between light and dark themes', async () => {
    const user = userEvent.setup();
    await act(async () => {
      renderWithTheme();
    });

    const toggle = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(toggle).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    await act(async () => {
      await user.click(toggle);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });
});
