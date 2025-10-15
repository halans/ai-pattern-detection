// Pattern Analyzer - Applies patterns to text and generates matches
import { Pattern, PatternMatch } from '../types';
import { PATTERNS } from './registry';

export class PatternAnalyzer {
  private patterns: Pattern[];

  constructor() {
    // Pre-compile patterns on initialization
    this.patterns = PATTERNS;
  }

  /**
   * Analyze text and detect all pattern matches
   */
  analyze(text: string): PatternMatch[] {
    const results: PatternMatch[] = [];

    for (const pattern of this.patterns) {
      const matches = this.findMatches(text, pattern);
      if (matches.length > 0) {
        results.push({
          patternId: pattern.id,
          patternName: pattern.name,
          severity: pattern.severity,
          matches,
          count: matches.length,
        });
      }
    }

    return results;
  }

  /**
   * Find all matches for a specific pattern
   */
  private findMatches(
    text: string,
    pattern: Pattern
  ): Array<{ text: string; context: string; index: number }> {
    const matches: Array<{ text: string; context: string; index: number }> = [];
    const flags = pattern.regex.flags.includes('g')
      ? pattern.regex.flags
      : `${pattern.regex.flags}g`;
    const regex = new RegExp(pattern.regex.source, flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[0],
        context: this.extractContext(text, match.index, match[0].length),
        index: match.index,
      });

      // Prevent infinite loop for zero-width matches
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }

    return matches;
  }

  /**
   * Extract context around a match (±50 characters)
   */
  private extractContext(text: string, index: number, matchLength: number): string {
    const contextRadius = 50;
    const start = Math.max(0, index - contextRadius);
    const end = Math.min(text.length, index + matchLength + contextRadius);

    let context = text.substring(start, end);

    // Add ellipsis if truncated
    if (start > 0) {
      context = '...' + context;
    }
    if (end < text.length) {
      context = context + '...';
    }

    return context;
  }

  /**
   * Calculate total score from pattern matches
   */
  calculateScore(matches: PatternMatch[]): number {
    let totalScore = 0;

    for (const match of matches) {
      const pattern = this.patterns.find((p) => p.id === match.patternId);
      if (pattern) {
        totalScore += pattern.weight * match.count;
      }
    }

    // Normalize to 0-100 range (cap at 100)
    return Math.min(100, totalScore);
  }

  /**
   * Classify text based on score
   */
  classify(score: number): 'Likely AI-generated' | 'Mixed/Uncertain' | 'Likely Human-written' {
    if (score >= 70) {
      return 'Likely AI-generated';
    } else if (score >= 31) {
      return 'Mixed/Uncertain';
    } else {
      return 'Likely Human-written';
    }
  }

  /**
   * Generate explanation based on classification and top patterns
   */
  generateExplanation(
    classification: string,
    matches: PatternMatch[]
  ): string {
    if (classification === 'Likely AI-generated') {
      const topPatterns = matches
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((m) => m.patternName)
        .join(', ');

      return `The text shows strong AI writing patterns including: ${topPatterns}. Multiple characteristic AI signals were detected.`;
    } else if (classification === 'Mixed/Uncertain') {
      return 'Mixed/Uncertain classification indicates the text has some AI-like patterns alongside human characteristics. It may be AI-generated with human editing, or human writing influenced by AI style.';
    } else {
      if (matches.length === 0) {
        return 'No significant AI writing patterns detected. The text exhibits natural human writing characteristics.';
      }
      return 'The text shows minimal AI patterns and appears to be primarily human-written.';
    }
  }
}
