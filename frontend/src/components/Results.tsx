import { AnalysisResult, Severity } from '../types';
import { downloadJSON } from '../utils/api';

interface ResultsProps {
  result: AnalysisResult;
}

export function Results({ result }: ResultsProps) {
  const { classification, confidence_score, patterns_detected, explanation, metadata } = result;

  const getClassificationColor = () => {
    if (classification === 'Likely AI-generated') return 'text-red-600 dark:text-red-400';
    if (classification === 'Mixed/Uncertain') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProgressBarColor = () => {
    if (confidence_score >= 70) return 'bg-red-500';
    if (confidence_score >= 31) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const groupedPatterns = patterns_detected.reduce((acc, pattern) => {
    if (!acc[pattern.severity]) {
      acc[pattern.severity] = [];
    }
    acc[pattern.severity].push(pattern);
    return acc;
  }, {} as Record<Severity, typeof patterns_detected>);

  const severityOrder: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

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
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Classification and Score */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>

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

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${getProgressBarColor()} transition-all duration-500`}
                style={{ width: `${confidence_score}%` }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">{explanation}</p>
          </div>
        </div>
      </div>

      {/* Pattern Breakdown */}
      {patterns_detected.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">
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
                        <span className="text-gray-600 dark:text-gray-400">
                          {' '}
                          — {pattern.count} match{pattern.count !== 1 ? 'es' : ''}
                        </span>
                        {pattern.matches.length > 0 && (
                          <div className="mt-1 ml-4 text-xs text-gray-500 dark:text-gray-400 italic">
                            Example: "{pattern.matches[0].text}"
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Analysis Metadata</h3>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium text-gray-600 dark:text-gray-400">Character Count</dt>
            <dd className="mt-1">{metadata.character_count.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600 dark:text-gray-400">Word Count</dt>
            <dd className="mt-1">{metadata.word_count.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600 dark:text-gray-400">Analysis Duration</dt>
            <dd className="mt-1">{metadata.analysis_duration}ms</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600 dark:text-gray-400">Engine Version</dt>
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
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => downloadJSON(result)}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium
                   hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500
                   transition-colors"
        >
          Download JSON
        </button>
      </div>
    </div>
  );
}
