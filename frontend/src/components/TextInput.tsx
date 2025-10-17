import { useRef, useState } from 'react';
import { processUploadedFile, ClientFileError } from '../utils/fileProcessing';

interface TextInputProps {
  onAnalyzeText: (text: string) => void;
  onAnalyzeFile: (file: File) => void;
  onClear: () => void;
  isLoading: boolean;
}

export function TextInput({ onAnalyzeText, onAnalyzeFile, onClear, isLoading }: TextInputProps) {
  const [text, setText] = useState('');
  const [fileState, setFileState] = useState<{
    file: File;
    type: 'txt' | 'md' | 'html';
    characterCount: number;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const charCount = text.length;
  const minChars = 100;
  const maxChars = 20000;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.length >= minChars && text.length <= maxChars && !isLoading) {
      onAnalyzeText(text);
      setFileError(null);
    }
  };

  const handleClear = () => {
    if (!charCount || isLoading) {
      return;
    }

    setText('');
    setFileError(null);
    onClear();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) {
      return;
    }

    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const info = await processUploadedFile(file);
      setFileState({ file, type: info.type, characterCount: info.characterCount });
      setText('');
      setFileError(null);
      onClear();
    } catch (error) {
      setFileState(null);
      setFileError(
        error instanceof ClientFileError ? error.message : 'Unable to process file upload'
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    if (isLoading) {
      return;
    }
    setFileState(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  const handleAnalyzeFile = () => {
    if (!fileState || isLoading) {
      return;
    }
    onAnalyzeFile(fileState.file);
  };

  const isValid = charCount >= minChars && charCount <= maxChars;
  const canClear = charCount > 0 && !isLoading;
  const analyzeDisabled = !isValid || isLoading;
  const analyzeFileDisabled = !fileState || isLoading;
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

        <div className="pt-4 border-t border-primary-soft/40 dark:border-primary/40">
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium mb-2"
          >
            Or upload a file (.txt, .md, .html)
          </label>
          <input
            tabIndex={0}
            id="file-upload"
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.html,text/plain,text/markdown,text/html"
            onChange={handleFileChange}
            disabled={isLoading}
            className="block w-full text-sm text-text-muted dark:text-text-dark-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary-light"
          />

          {fileState && (
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary dark:text-text-dark">
                  {fileState.file.name}
                </p>
                <p className="text-xs text-text-muted dark:text-text-dark-muted">
                  Type: {fileState.type.toUpperCase()} • Processed length: {fileState.characterCount.toLocaleString()} characters
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  tabIndex={0}
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isLoading}
                  className="px-4 py-2 border border-primary-soft/40 dark:border-primary/40 rounded-lg font-medium text-text-primary dark:text-text-dark bg-surface-alt dark:bg-surface-dark-alt hover:bg-primary-soft/20 dark:hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-primary-light disabled:cursor-not-allowed"
                >
                  Remove File
                </button>
                <button
                  tabIndex={0}
                  type="button"
                  onClick={handleAnalyzeFile}
                  disabled={analyzeFileDisabled}
                  className={`px-6 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary-light transition-colors ${
                    analyzeFileDisabled
                      ? 'bg-primary-soft text-white cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-light'
                  }`}
                >
                  {isLoading ? 'Analyzing...' : 'Analyze File'}
                </button>
              </div>
            </div>
          )}

          {fileError && (
            <p className="mt-2 text-sm text-danger" role="alert">
              {fileError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
