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
    if (charCount < minChars) return 'text-yellow-500';
    if (charCount > maxChars) return 'text-red-500';
    return 'text-green-500';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
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
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:outline-none
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     resize-y"
            placeholder="Paste text here to check for AI-generated content patterns..."
            disabled={isLoading}
            aria-describedby="text-input-hint"
          />
          <p id="text-input-hint" className="sr-only">
            Minimum {minChars} characters, maximum {maxChars} characters.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className={`text-sm ${getCharCountColor()}`} aria-live="polite">
            {charCount.toLocaleString()} / {maxChars.toLocaleString()} characters
            {charCount < minChars && ` (minimum ${minChars})`}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              tabIndex={0}
              onClick={handleClear}
              disabled={!canClear}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium
                       text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800
                       hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                       disabled:text-gray-400 disabled:border-gray-300 disabled:dark:border-gray-700
                       disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed
                       transition-colors"
              aria-label="Clear text"
            >
              Clear
            </button>
            <button
              type="submit"
              tabIndex={0}
              className={`px-6 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                analyzeDisabled
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              aria-label={isLoading ? 'Analyzing text' : 'Analyze text'}
              aria-disabled={analyzeDisabled}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Text'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
