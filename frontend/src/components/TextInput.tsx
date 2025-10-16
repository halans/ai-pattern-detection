import { useState } from 'react';

interface TextInputProps {
  onAnalyze: (text: string) => void;
  onClear: () => void;
  isLoading: boolean;
}

export function TextInput({ onAnalyze, onClear, isLoading }: TextInputProps) {
  const [text, setText] = useState('');
  const charCount = text.length;
  const minChars = 100;
  const maxChars = 20000;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.length >= minChars && text.length <= maxChars && !isLoading) {
      onAnalyze(text);
    }
  };

  const handleClear = () => {
    if (!charCount || isLoading) {
      return;
    }

    setText('');
    onClear();
  };

  const isValid = charCount >= minChars && charCount <= maxChars;
  const canClear = charCount > 0 && !isLoading;
  const analyzeDisabled = !isValid || isLoading;
  const getCharCountColor = () => {
    if (charCount < minChars) return 'text-accent';
    if (charCount > maxChars) return 'text-danger';
    return 'text-primary';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-surface-alt dark:bg-surface-dark-alt rounded-lg shadow-lg transition-colors">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="text-input"
            className="block text-sm font-medium mb-2"
          >
            Enter text to analyze
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 p-4 border border-primary-soft/40 dark:border-primary/40 rounded-lg
                     focus:ring-2 focus:ring-primary-light focus:border-transparent focus-visible:outline-none
                     bg-surface-alt dark:bg-surface-dark-alt text-text-primary dark:text-text-dark
                     resize-y"
            placeholder="Paste text here to check for AI-generated content patterns..."
            disabled={isLoading}
            aria-describedby="text-input-hint"
          />
          <p id="text-input-hint" className="sr-only">
            {minChars} to {maxChars.toLocaleString()} chars required
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className={`text-sm ${getCharCountColor()} dark:text-text-dark-muted`} aria-live="polite">
            {charCount.toLocaleString()} / {maxChars.toLocaleString()} characters
            {charCount < minChars && ` (minimum ${minChars})`}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              tabIndex={!canClear ? -1 : 0}
              onClick={handleClear}
              disabled={!canClear}
              className="px-4 py-2 border border-primary-soft/40 dark:border-primary/40 rounded-lg font-medium
                       text-text-primary dark:text-text-dark bg-surface-alt dark:bg-surface-dark-alt
                       hover:bg-primary-soft/20 dark:hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-primary-light
                       disabled:text-text-muted disabled:border-primary-soft/30 disabled:dark:border-primary/30
                       disabled:bg-surface-alt disabled:dark:bg-surface-dark-alt disabled:cursor-not-allowed
                       transition-colors"
              aria-label="Clear text"
            >
              Clear
            </button>
            <button
              type="submit"
              tabIndex={analyzeDisabled ? -1 : 0}
              disabled={analyzeDisabled}
              className={`px-6 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary-light transition-colors ${
                analyzeDisabled
                  ? 'bg-primary-soft text-white cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-light'
              }`}
              aria-label={isLoading ? 'Analyzing text' : 'Analyze text'}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Text'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
