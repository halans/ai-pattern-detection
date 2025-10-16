import { useState } from 'react';
import { TextInput } from './components/TextInput';
import { Results } from './components/Results';
import { AnalysisResult } from './types';
import { analyzeText } from './utils/api';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeText(text);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Slop Detection Tool</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Pattern-based analysis for detecting AI-generated content
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <TextInput
          onAnalyze={handleAnalyze}
          onClear={() => {
            setResult(null);
            setError(null);
          }}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing text patterns...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error</h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && <Results result={result} />}

        {/* About Section */}
        {!result && !isLoading && (
          <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <p>
                This tool uses <strong>pattern-based detection</strong> to identify common
                characteristics of AI-generated text. It analyzes <strong>45 linguistic patterns</strong>{' '}
                including:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>AI self-references and knowledge cutoff disclaimers</li>
                <li>Collaborative phrases ("let me know if", "I hope this helps", "would you like")</li>
                <li>Significance statements and cultural clichés ("profound legacy")</li>
                <li>Editorializing ("it's important to note", "worth mentioning")</li>
                <li>Broken citations, placeholder templates</li>
                <li>Formatting patterns (emoji headings, em-dash spam, title case)</li>
              </ul>
              <p>
                Each pattern is weighted by severity (CRITICAL, HIGH, MEDIUM, LOW, VERY LOW, INFORMATIONAL) and combined
                into a confidence score (0-100). Unfortunately, this does not exclude human-written academic text being flagged as AI-generated text.
              </p>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2">Privacy Guarantee</h3>
                <p>
                  All analysis is performed in real-time with <strong>zero data retention</strong>.
                  Your text is never stored, logged, or cached. No use of AI in processing. Processing is entirely ephemeral.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Slop Detection Tool • Pattern Engine v1.2.0 (45 patterns) • Zero Data Retention</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
