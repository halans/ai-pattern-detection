// Text Normalizer - Preprocessing and validation

export class TextNormalizer {
  private static readonly MIN_LENGTH = 100;
  private static readonly MAX_LENGTH = 20000;

  /**
   * Validate text meets length requirements
   */
  static validate(text: string): { valid: boolean; error?: string } {
    const length = text.length;

    if (length < this.MIN_LENGTH) {
      return {
        valid: false,
        error: `Text too short for reliable analysis (minimum ${this.MIN_LENGTH} characters)`,
      };
    }

    if (length > this.MAX_LENGTH) {
      return {
        valid: false,
        error: `Text exceeds maximum length of ${this.MAX_LENGTH} characters`,
      };
    }

    return { valid: true };
  }

  /**
   * Normalize text (whitespace, quotes, line endings)
   */
  static normalize(text: string): string {
    let normalized = text;

    // Convert curly quotes to straight quotes
    normalized = normalized.replace(/[\u2018\u2019]/g, "'"); // Single quotes
    normalized = normalized.replace(/[\u201C\u201D]/g, '"'); // Double quotes

    // Normalize line endings to LF
    normalized = normalized.replace(/\r\n/g, '\n');
    normalized = normalized.replace(/\r/g, '\n');

    // Collapse multiple spaces to single space
    normalized = normalized.replace(/ +/g, ' ');

    // Collapse multiple newlines to double newline (preserve paragraphs)
    normalized = normalized.replace(/\n{3,}/g, '\n\n');

    // Trim leading/trailing whitespace
    normalized = normalized.trim();

    return normalized;
  }

  /**
   * Strip HTML tags from text
   */
  static stripHtml(html: string): string {
    // Remove script and style tags with their content (simplified to avoid backtracking)
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Remove all other HTML tags
    text = text.replace(/<[^>]+>/g, ' ');

    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");

    // Normalize whitespace
    return this.normalize(text);
  }

  /**
   * Calculate formatting metrics (emoji, bold/italic density, em-dash frequency)
   */
  static analyzeFormatting(text: string): {
    emojiCount: number;
    emDashFrequency: number;
    warnings: string[];
  } {
    const warnings: string[] = [];

    // Count emojis (basic emoji regex)
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
    const emojiMatches = text.match(emojiRegex);
    const emojiCount = emojiMatches ? emojiMatches.length : 0;

    // Count em-dashes
    const emDashRegex = /—/g;
    const emDashMatches = text.match(emDashRegex);
    const emDashCount = emDashMatches ? emDashMatches.length : 0;

    // Calculate word count for frequency
    const wordCount = this.countWords(text);
    const emDashFrequency = wordCount > 0 ? (emDashCount / wordCount) * 100 : 0;

    // Check for excessive em-dash usage (>5 per 100 words)
    if (emDashFrequency > 5) {
      warnings.push('Excessive em-dash usage detected');
    }

    // Check for emoji in headings (markdown-style)
    const headingEmojiRegex = /^#+\s+.*[\u{1F600}-\u{1F64F}]/gmu;
    if (headingEmojiRegex.test(text)) {
      warnings.push('Emoji usage in headings detected');
    }

    return {
      emojiCount,
      emDashFrequency,
      warnings,
    };
  }

  /**
   * Count words in text
   */
  static countWords(text: string): number {
    const words = text.trim().split(/\s+/);
    return words.filter((word) => word.length > 0).length;
  }

  /**
   * Get character count
   */
  static countCharacters(text: string): number {
    return text.length;
  }
}
