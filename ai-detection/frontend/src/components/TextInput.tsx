import { useState } from 'react';

interface TextInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export function TextInput({ onAnalyze, isLoading }: TextInputProps) {
  const [text, setText] = useState('');
  const charCount = text.length;
  const minChars = 100;
  const maxChars = 20000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.length >= minChars && text.length <= maxChars && !isLoading) {
      onAnalyze(text);
    }
  };

  const isValid = charCount >= minChars && charCount <= maxChars;
  const getCharCountColor = () => {
    if (charCount < minChars) return 'text-yellow-500';
    if (charCount > maxChars) return 'text-red-500';
    return 'text-green-500';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium mb-2">
            Enter text to analyze
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     resize-y"
            placeholder="Paste text here to check for AI-generated content patterns..."
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className={`text-sm ${getCharCountColor()}`}>
            {charCount.toLocaleString()} / {maxChars.toLocaleString()} characters
            {charCount < minChars && ` (minimum ${minChars})`}
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:bg-gray-400 disabled:cursor-not-allowed
                     transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>
      </form>
    </div>
  );
}
