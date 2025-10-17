import { AnalysisResult, Severity } from '../types';
import { downloadJSON, downloadMarkdown, downloadPDF } from '../utils/api';

interface ResultsProps {
  result: AnalysisResult;
}

export function Results({ result }: ResultsProps) {
  const { classification, confidence_score, patterns_detected, explanation, metadata } = result;

  const getClassificationColor = () => {
    if (classification === 'Likely AI Slop') return 'text-red-600 dark:text-red-400';
    if (classification === 'Mixed/Uncertain') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProgressBarColor = () => {
    if (confidence_score >= 65) return 'bg-red-500';
    if (confidence_score >= 35) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const groupedPatterns = patterns_detected.reduce((acc, pattern) => {
    if (!acc[pattern.severity]) {
      acc[pattern.severity] = [];
    }
    acc[pattern.severity].push(pattern);
    return acc;
  }, {} as Record<Severity, typeof patterns_detected>);

  const severityOrder: Severity[] = [
    'CRITICAL',
    'HIGH',
    'MEDIUM',
    'LOW',
    'VERY_LOW',
    'INFORMATIONAL',
  ];

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'VERY_LOW':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case 'INFORMATIONAL':
        return 'bg-surface-alt text-text-muted dark:bg-surface-dark-alt dark:text-text-dark-muted';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Classification and Score */}
      <section
        className="bg-surface-alt dark:bg-surface-dark-alt rounded-lg shadow-lg p-6 transition-colors"
        aria-labelledby="analysis-summary-heading"
        role="region"
      >
        <h2 id="analysis-summary-heading" className="text-2xl font-bold mb-4">
          Analysis Results
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Classification:</span>
              <span className={`text-xl font-bold ${getClassificationColor()}`}>
                {classification}
              </span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Confidence Score:</span>
              <span className="text-xl font-bold">{confidence_score}</span>
            </div>

            <div className="w-full bg-primary-soft/20 dark:bg-primary/40 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${getProgressBarColor()} transition-all duration-500`}
                style={{ width: `${confidence_score}%` }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-text-muted dark:text-text-dark-muted">{explanation}</p>
          </div>
        </div>
      </section>

      {/* Pattern Breakdown */}
      {patterns_detected.length > 0 && (
        <section
          className="bg-surface-alt dark:bg-surface-dark-alt rounded-lg shadow-lg p-6 transition-colors"
          aria-labelledby="pattern-breakdown-heading"
          role="region"
        >
          <h3 id="pattern-breakdown-heading" className="text-xl font-bold mb-4">
            Detected Patterns ({patterns_detected.length})
          </h3>

          <div className="space-y-4">
            {severityOrder.map((severity) => {
              const patterns = groupedPatterns[severity] || [];
              if (patterns.length === 0) return null;

              return (
                <div key={severity}>
                  <h4
                    className={`text-sm font-semibold px-3 py-1 rounded inline-block mb-2 ${getSeverityColor(severity)}`}
                  >
                    {severity} ({patterns.length})
                  </h4>
                  <ul className="space-y-2 ml-4">
                    {patterns.map((pattern) => (
                      <li key={pattern.patternId} className="text-sm">
                        <span className="font-medium">{pattern.patternName}</span>
                        <span className="text-text-muted dark:text-text-dark-muted">
                          {' '}
                          — {pattern.count} match{pattern.count !== 1 ? 'es' : ''}
                        </span>
                        {pattern.matches.length > 0 && (
                          <div className="mt-1 ml-4 text-xs text-text-muted dark:text-text-dark-muted italic">
                            Example: "{pattern.matches[0].text.trim()}" 
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Metadata */}
      <section
        className="bg-surface-alt dark:bg-surface-dark-alt rounded-lg shadow-lg p-6 transition-colors"
        aria-labelledby="analysis-metadata-heading"
        role="region"
      >
        <h3 id="analysis-metadata-heading" className="text-xl font-bold mb-4">
          Analysis Metadata
        </h3>
        <dl className="grid grid-cols-2 gap-4 text-sm text-text-muted dark:text-text-dark-muted">
          <div>
            <dt className="font-medium">Character Count</dt>
            <dd className="mt-1">{metadata.character_count.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="font-medium">Word Count</dt>
            <dd className="mt-1">{metadata.word_count.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="font-medium">Analysis Duration</dt>
            <dd className="mt-1">{metadata.analysis_duration}ms</dd>
          </div>
          <div>
            <dt className="font-medium">Engine Version</dt>
            <dd className="mt-1">{metadata.pattern_engine_version}</dd>
          </div>
        </dl>

        {metadata.warnings.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Warnings
            </h4>
            <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
              {metadata.warnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Export Buttons */}
      <div className="flex gap-4" role="group" aria-label="Download report options">
        <button
          type="button"
          tabIndex={0}
          onClick={() => downloadJSON(result)}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium
                   hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light
                   transition-colors"
          aria-label="Download report as JSON"
        >
          Download JSON
        </button>
        <button
          type="button"
          tabIndex={0}
          onClick={() => downloadMarkdown(result)}
          className="px-6 py-2 bg-primary-light text-white rounded-lg font-medium
                   hover:bg-primary-soft focus:outline-none focus:ring-2 focus:ring-primary-light
                   transition-colors"
          aria-label="Download report as Markdown"
        >
          Download Markdown
        </button>
        <button
          type="button"
          tabIndex={0}
          onClick={() => {
            void downloadPDF(result);
          }}
          className="px-6 py-2 bg-accent text-text-primary rounded-lg font-medium
                   hover:bg-[#d99d1f] focus:outline-none focus:ring-2 focus:ring-accent
                   transition-colors"
          aria-label="Download report as PDF"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
