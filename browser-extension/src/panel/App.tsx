import { useEffect, useMemo, useState } from 'react';
import type { AnalysisResult, Severity } from '../types';
import { API_BASE_URL } from '../config';

const MIN_CHARACTERS = 100;

type Source = 'selection' | 'page';

type CaptureResponse = {
  selectionText: string;
  pageText: string;
  selectionLength: number;
  pageLength: number;
};

type Status = 'idle' | 'loading' | 'error' | 'success';

const getBodyElement = () => document.querySelector('body');

const applyColorScheme = () => {
  const body = getBodyElement();
  if (!body) return;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  body.classList.toggle('dark', Boolean(prefersDark));
};

const requestCapture = async (): Promise<CaptureResponse> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'REQUEST_CAPTURE' }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!response) {
        reject(new Error('No response from page'));
        return;
      }
      if (response.error) {
        const errorMessage =
          response.error === 'UNSUPPORTED_URL'
            ? 'This page cannot be analyzed. Open a standard http/https page and try again.'
            : response.error;
        reject(new Error(errorMessage));
        return;
      }
      resolve(response.data as CaptureResponse);
    });
  });
};

const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let message = 'Analysis failed';
    try {
      const error = await response.json();
      if (error?.message) {
        message = error.message;
      }
    } catch {
      // ignore parsing errors
    }
    throw new Error(message);
  }

  return response.json();
};

export function App() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeSource, setActiveSource] = useState<Source>('selection');
  const [previewText, setPreviewText] = useState<string>('');
  const [selectionLength, setSelectionLength] = useState<number>(0);
  const [pageLength, setPageLength] = useState<number>(0);

  useEffect(() => {
    applyColorScheme();
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const listener = () => applyColorScheme();
    mq?.addEventListener('change', listener);
    return () => mq?.removeEventListener('change', listener);
  }, []);

  const previewSnippet = useMemo(() => {
    if (!previewText) return '';
    const trimmed = previewText.trim();
    if (trimmed.length <= 160) return trimmed;
    return `${trimmed.slice(0, 160)}…`;
  }, [previewText]);

  const runAnalysis = async (source: Source, text: string) => {
    setActiveSource(source);
    setPreviewText(text);
    setStatus('loading');
    setMessage('');
    setResult(null);

    try {
      const analysis = await analyzeText(text);
      setResult(analysis);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unexpected error');
    }
  };

  const handleAutoAnalyze = async () => {
    setStatus('loading');
    setMessage('');
    setResult(null);

    try {
      const capture = await requestCapture();
      setSelectionLength(capture.selectionLength);
      setPageLength(capture.pageLength);

      if (capture.selectionText && capture.selectionText.length >= MIN_CHARACTERS) {
        await runAnalysis('selection', capture.selectionText);
        return;
      }

      if (capture.pageText && capture.pageText.length >= MIN_CHARACTERS) {
        await runAnalysis('page', capture.pageText);
        return;
      }

      setStatus('error');
      setMessage('Select at least 100 characters or open a page with more text to analyze.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to capture page content.');
    }
  };

  const handleAnalyzeSelection = async () => {
    try {
      const capture = await requestCapture();
      setSelectionLength(capture.selectionLength);
      if (capture.selectionText.length < MIN_CHARACTERS) {
        setStatus('error');
        setMessage('Selection must contain at least 100 characters.');
        return;
      }
      await runAnalysis('selection', capture.selectionText);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to capture selection.');
    }
  };

  const handleAnalyzePage = async () => {
    try {
      const capture = await requestCapture();
      setPageLength(capture.pageLength);
      if (capture.pageText.length < MIN_CHARACTERS) {
        setStatus('error');
        setMessage('Page content must contain at least 100 characters.');
        return;
      }
      await runAnalysis('page', capture.pageText);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to capture page content.');
    }
  };

  useEffect(() => {
    handleAutoAnalyze().catch((error) => {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to start analysis.');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="extension-container" role="region" aria-live="polite">
      <header className="extension-header">
        <div>
          <h1 className="extension-title">Slop Detector</h1>
          <p className="extension-subtitle">Analyze page content for AI patterns.</p>
        </div>
        <div className="extension-actions" role="group" aria-label="Analyze options">
          <button type="button" onClick={handleAnalyzeSelection} className="extension-button">
            Analyze Selection {selectionLength ? `(${selectionLength} chars)` : ''}
          </button>
          <button type="button" onClick={handleAnalyzePage} className="extension-button">
            Analyze Full Page {pageLength ? `(${pageLength} chars)` : ''}
          </button>
        </div>
      </header>

      {previewSnippet && (
        <section className="extension-panel">
          <h2 className="panel-title">Input Preview ({activeSource})</h2>
          <p className="panel-text">{previewSnippet}</p>
        </section>
      )}

      {status === 'loading' && (
        <section className="extension-panel">
          <p className="panel-text">Analyzing text patterns…</p>
        </section>
      )}

      {status === 'error' && (
        <section className="extension-panel error">
          <h2 className="panel-title">Unable to Analyze</h2>
          <p className="panel-text">{message}</p>
        </section>
      )}

      {status === 'success' && result && (
        <>
          <section className="extension-panel">
            <h2 className="panel-title">Analysis Result</h2>
            <div className="result-summary">
              <div>
                <span className="summary-label">Classification</span>
                <span className="summary-value">{result.classification}</span>
              </div>
              <div>
                <span className="summary-label">Confidence Score</span>
                <span className="summary-value">{result.confidence_score}</span>
              </div>
            </div>
            <p className="panel-text">{result.explanation}</p>
          </section>

          <PatternsPanel result={result} />
          <MetadataPanel result={result} />
          <RawJsonPanel result={result} />
        </>
      )}

      <footer className="extension-footer">
        <button type="button" onClick={handleAutoAnalyze} className="extension-button ghost">
          Refresh capture
        </button>
        <span className="footer-note">Minimum {MIN_CHARACTERS} characters required.</span>
      </footer>
    </div>
  );
}

const severityOrder: Severity[] = [
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW',
  'VERY_LOW',
  'INFORMATIONAL',
];

function groupPatterns(result: AnalysisResult) {
  return result.patterns_detected.reduce<Record<Severity, typeof result.patterns_detected>>((acc, pattern) => {
    if (!acc[pattern.severity]) {
      acc[pattern.severity] = [];
    }
    acc[pattern.severity].push(pattern);
    return acc;
  }, {
    CRITICAL: [],
    HIGH: [],
    MEDIUM: [],
    LOW: [],
    VERY_LOW: [],
    INFORMATIONAL: [],
  });
}

function severityLabel(severity: Severity) {
  switch (severity) {
    case 'CRITICAL':
      return 'Critical';
    case 'HIGH':
      return 'High';
    case 'MEDIUM':
      return 'Medium';
    case 'LOW':
      return 'Low';
    case 'VERY_LOW':
      return 'Very Low';
    case 'INFORMATIONAL':
      return 'Informational';
    default:
      return severity;
  }
}

function PatternsPanel({ result }: { result: AnalysisResult }) {
  const grouped = groupPatterns(result);
  const hasPatterns = result.patterns_detected.length > 0;
  if (!hasPatterns) return null;

  return (
    <section className="extension-panel">
      <h2 className="panel-title">Detected Patterns ({result.patterns_detected.length})</h2>
      <div className="pattern-groups">
        {severityOrder.map((severity) => {
          const patterns = grouped[severity];
          if (!patterns || patterns.length === 0) {
            return null;
          }
          return (
            <div key={severity} className="pattern-group">
              <div className={`pattern-badge severity-${severity.toLowerCase()}`}>
                {severityLabel(severity)} ({patterns.length})
              </div>
              <ul className="pattern-list">
                {patterns.map((pattern) => (
                  <li key={pattern.patternId} className="pattern-item">
                    <div className="pattern-name">{pattern.patternName}</div>
                    <div className="pattern-meta">
                      <span>{pattern.count} match{pattern.count !== 1 ? 'es' : ''}</span>
                      {pattern.matches[0]?.text && (
                        <span className="pattern-example">
                          “{pattern.matches[0].text.trim()}”
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MetadataPanel({ result }: { result: AnalysisResult }) {
  const { metadata } = result;
  return (
    <section className="extension-panel">
      <h2 className="panel-title">Analysis Metadata</h2>
      <dl className="metadata-grid">
        <div>
          <dt>Submission Source</dt>
          <dd>{metadata.submission_source === 'file' ? 'File Upload' : 'Direct Text Input'}</dd>
        </div>
        <div>
          <dt>Character Count</dt>
          <dd>{metadata.character_count.toLocaleString()}</dd>
        </div>
        <div>
          <dt>Word Count</dt>
          <dd>{metadata.word_count.toLocaleString()}</dd>
        </div>
        <div>
          <dt>Analysis Duration</dt>
          <dd>{metadata.analysis_duration}ms</dd>
        </div>
        <div>
          <dt>Engine Version</dt>
          <dd>{metadata.pattern_engine_version}</dd>
        </div>
        <div>
          <dt>Timestamp</dt>
          <dd>{new Date(metadata.timestamp).toLocaleString()}</dd>
        </div>
        {metadata.file_metadata && (
          <>
            <div>
              <dt>File Name</dt>
              <dd>{metadata.file_metadata.name}</dd>
            </div>
            <div>
              <dt>File Type</dt>
              <dd>{metadata.file_metadata.type.toUpperCase()}</dd>
            </div>
            <div>
              <dt>File Characters</dt>
              <dd>{metadata.file_metadata.character_count.toLocaleString()}</dd>
            </div>
          </>
        )}
      </dl>

      {metadata.warnings.length > 0 && (
        <div className="warning-callout">
          <h3>Warnings</h3>
          <ul>
            {metadata.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function RawJsonPanel({ result }: { result: AnalysisResult }) {
  return (
    <section className="extension-panel">
      <details className="result-details">
        <summary>View raw JSON response</summary>
        <pre className="json-output">{JSON.stringify(result, null, 2)}</pre>
      </details>
    </section>
  );
}
