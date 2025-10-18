import { useEffect, useState } from 'react';
import { TextInput } from './components/TextInput';
import { Results } from './components/Results';
import { AnalysisResult } from './types';
import { analyzeText, analyzeFile } from './utils/api';
import { useTheme } from './theme/ThemeProvider';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'privacy'>(() =>
    typeof window !== 'undefined' && window.location.pathname.startsWith('/privacy') ? 'privacy' : 'home'
  );
  const { theme, toggleTheme } = useTheme();

  const handleSkipToContent = (event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
    }
  };

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

  const handleAnalyzeFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeFile(file);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const targetPath = view === 'privacy' ? '/privacy' : '/';
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.replaceState({}, '', targetPath);
    }
  }, [view]);

  return (
    <div className="min-h-screen bg-surface text-text-primary dark:bg-surface-dark dark:text-text-dark transition-colors">
      <a
        href="#main-content"
        onClick={handleSkipToContent}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleSkipToContent(event);
          }
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-surface focus:text-primary focus:rounded focus:shadow-lg"
      >
        Skip to main content
      </a>
      {/* Header */}
      <header className="pt-4 transition-colors">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <div>
            <h1 className="text-4xl font-extrabold font-sora">Slop Detector</h1>
            <p className="mt-3 text-sm text-text-muted dark:text-text-dark-muted">
              Pattern-based analysis for detecting AI&#x2011;generated&nbsp;content
            </p>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl mx-auto px-4 py-8 space-y-8 outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-surface-dark"
        aria-live="polite"
      >
        {view === 'home' ? (
          <>
            <TextInput
              onAnalyzeText={handleAnalyze}
              onAnalyzeFile={handleAnalyzeFile}
              onClear={() => {
                setResult(null);
                setError(null);
              }}
              isLoading={isLoading}
            />

            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-text-muted">Analyzing text patterns...</p>
              </div>
            )}

            {error && (
              <div className="max-w-4xl mx-auto p-6 bg-danger/10 dark:bg-danger/20 rounded-lg">
                <h3 className="text-danger font-semibold mb-2">Error</h3>
                <p className="text-danger/80 dark:text-danger/90">{error}</p>
              </div>
            )}

            {result && !isLoading && <Results result={result} />}

            {!result && !isLoading && (
              <div className="max-w-4xl mx-auto glass-panel liquid-glow p-6 transition-colors">
                <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                <div className="space-y-4 text-sm text-text-muted dark:text-text-dark-muted">
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
                    into a confidence score (0-100). Unfortunately, this does not exclude human-written academic writing being flagged as AI-generated text.
                  </p>
                  <div className="pt-4 border-t border-primary-soft/40 dark:border-primary/40">
                    <h3 className="font-semibold mb-2">Privacy Guarantee</h3>
                    <p>
                      All analysis is performed in real-time with <strong>zero data retention</strong>.
                      Your text is never stored, logged, or cached. No use of AI in processing. Processing is entirely ephemeral.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <PrivacyPolicy />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-primary-soft/40 dark:border-primary/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-4 text-center text-sm text-text-muted dark:text-text-dark-muted md:flex-row md:items-center md:justify-between">
          <p>
            Slop Detector • Pattern Engine v1.4.0 (45 patterns) • Zero Data Retention •{' '}
            <a 
              className="mx-auto md:mx-0 text-sm underline hover:no-underline"
              href="https://github.com/halans/ai-pattern-detection" target="blank" rel="me">
              Github
            </a>
            &nbsp;•&nbsp;
            <a
            href="/privacy"
            onClick={(event) => {
              event.preventDefault();
              setView('privacy');
            }}
            className="mx-auto md:mx-0 text-sm underline hover:no-underline"
          >
            Privacy Policy
          </a>
          </p>
          
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={theme === 'dark'}
            className="mx-auto inline-flex items-center justify-center rounded-full border border-primary text-primary dark:text-primary-light p-3 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary-light md:mx-0"
          >
            {theme === 'dark' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                role="img"
                aria-hidden="true"
              >
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                role="img"
                aria-hidden="true"
              >
                <path d="M17.293 13.293a8 8 0 01-10.586-10.586 1 1 0 00-1.32-1.497A10 10 0 1018.58 14.613a1 1 0 00-1.288-1.32 7.937 7.937 0 01-.999-.999z" />
              </svg>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
