const MAX_LENGTH = 20000;
const SUPPORTED_TYPES = ['txt', 'md', 'html'] as const;
type SupportedType = (typeof SUPPORTED_TYPES)[number];

export interface ClientFileInfo {
  type: SupportedType;
  characterCount: number;
}

export class ClientFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientFileError';
  }
}

export async function processUploadedFile(file: File): Promise<ClientFileInfo> {
  const info = determineType(file);

  if (!info) {
    throw new ClientFileError('Unsupported file type. Allowed: .txt, .md, .html');
  }

  const raw = (await file.text()).trim();

  if (!raw) {
    throw new ClientFileError('Uploaded file is empty');
  }

  let processed: string;

  switch (info.type) {
    case 'txt':
      processed = normalize(raw);
      break;
    case 'md':
      processed = normalizeMarkdown(raw);
      break;
    case 'html':
      processed = stripHtml(raw);
      break;
    default:
      throw new ClientFileError('Unsupported file type. Allowed: .txt, .md, .html');
  }

  if (processed.length > MAX_LENGTH) {
    throw new ClientFileError(
      `Processed file exceeds ${MAX_LENGTH.toLocaleString()} character limit`
    );
  }

  return {
    type: info.type,
    characterCount: processed.length,
  };
}

function determineType(file: File): { type: SupportedType } | null {
  const extMatch = file.name.toLowerCase().match(/\.([a-z0-9]+)$/);
  if (extMatch) {
    const ext = extMatch[1];
    if (SUPPORTED_TYPES.includes(ext as SupportedType)) {
      return { type: ext as SupportedType };
    }
  }

  const mime = (file.type || '').toLowerCase();
  if (!mime) return null;

  if (mime.includes('plain')) return { type: 'txt' };
  if (mime.includes('markdown') || mime.includes('md')) return { type: 'md' };
  if (mime.includes('html') || mime.includes('xhtml')) return { type: 'html' };

  return null;
}

function normalize(text: string): string {
  let normalized = text;

  normalized = normalized.replace(/[\u2018\u2019]/g, "'");
  normalized = normalized.replace(/[\u201C\u201D]/g, '"');
  normalized = normalized.replace(/\r\n/g, '\n');
  normalized = normalized.replace(/\r/g, '\n');
  normalized = normalized.replace(/ +/g, ' ');
  normalized = normalized.replace(/\n{3,}/g, '\n\n');

  return normalized.trim();
}

function stripHtml(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<[^>]+>/g, ' ');

  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");

  return normalize(text);
}

function normalizeMarkdown(input: string): string {
  const withoutFrontmatter = input.replace(/^---[\s\S]*?\n---\s*/u, '');

  let text = withoutFrontmatter;
  text = text.replace(/```[\s\S]*?```/g, ' ');
  text = text.replace(/`([^`]*)`/g, '$1');
  text = text.replace(/!\[[^\]]*]\([^)]*\)/g, ' ');
  text = text.replace(/\[[^\]]*]\(([^)]*)\)/g, '$1');
  text = text.replace(/^>\s?/gm, '');
  text = text.replace(/(^|\s)[#*+\-]{1,2}\s+/gm, '$1');
  text = text.replace(/^\s*\d+\.\s+/gm, '');
  text = text.replace(/[*_~]+/g, '');

  return normalize(text);
}
