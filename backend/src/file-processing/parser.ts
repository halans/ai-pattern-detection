import { TextNormalizer } from '../preprocessing/normalizer';

const MAX_LENGTH = 20000;
const SUPPORTED_TYPES = ['txt', 'md', 'html'] as const;
type SupportedType = (typeof SUPPORTED_TYPES)[number];

export interface ParsedFileResult {
  text: string;
  type: SupportedType;
  metadata: {
    name: string;
    type: SupportedType;
    characterCount: number;
  };
}

export class FileProcessingError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
    this.name = 'FileProcessingError';
  }
}

export class FileParser {
  static async parse(file: File): Promise<ParsedFileResult> {
    const info = this.determineType(file);

    if (!info) {
      throw new FileProcessingError(
        'Unsupported file type. Allowed extensions: .txt, .md, .html'
      );
    }

    const raw = await file.text();
    const trimmed = raw.trim();

    if (!trimmed) {
      throw new FileProcessingError('Uploaded file is empty');
    }

    let processed: string;

    switch (info.type) {
      case 'txt':
        processed = TextNormalizer.normalize(trimmed);
        break;
      case 'md':
        processed = this.normalizeMarkdown(trimmed);
        break;
      case 'html':
        processed = TextNormalizer.stripHtml(trimmed);
        break;
      default:
        throw new FileProcessingError(
          'Unsupported file type. Allowed extensions: .txt, .md, .html'
        );
    }

    if (processed.length > MAX_LENGTH) {
      throw new FileProcessingError(
        `Processed file exceeds maximum length of ${MAX_LENGTH.toLocaleString()} characters`
      );
    }

    return {
      text: processed,
      type: info.type,
      metadata: {
        name: file.name,
        type: info.type,
        characterCount: processed.length,
      },
    };
  }

  private static determineType(file: File): { type: SupportedType } | null {
    const extensionMatch = file.name.toLowerCase().match(/\.([a-z0-9]+)$/);
    if (extensionMatch) {
      const ext = extensionMatch[1];
      if (SUPPORTED_TYPES.includes(ext as SupportedType)) {
        return { type: ext as SupportedType };
      }
    }

    const mime = (file.type || '').toLowerCase();
    if (!mime) {
      return null;
    }

    if (mime.includes('plain')) {
      return { type: 'txt' };
    }
    if (mime.includes('markdown') || mime.includes('md')) {
      return { type: 'md' };
    }
    if (mime.includes('html') || mime.includes('xhtml')) {
      return { type: 'html' };
    }

    return null;
  }

  private static normalizeMarkdown(input: string): string {
    const withoutFrontmatter = input.replace(/^---[\s\S]*?\n---\s*/u, '');

    let text = withoutFrontmatter;
    text = text.replace(/```[\s\S]*?```/g, ' ');
    text = text.replace(/`([^`]*)`/g, '$1');
    text = text.replace(/!\[[^\]]*]\([^)]*\)/g, ' ');
    text = text.replace(/\[[^\]]*]\(([^)]*)\)/g, '$1');
    text = text.replace(/^>\s?/gm, '');
    text = text.replace(/(^|\s)[#*+-]{1,2}\s+/gm, '$1');
    text = text.replace(/^\s*\d+\.\s+/gm, '');
    text = text.replace(/[*_~]+/g, '');

    return TextNormalizer.normalize(text);
  }
}
