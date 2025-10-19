// Pattern Analyzer - Applies patterns to text and generates matches
import { Pattern, PatternMatch } from '../types';
import {
  PATTERNS,
  REPETITION_BIGRAMS,
  REPETITION_TRIGRAMS,
  REPETITION_WORDS,
  SEVERITY_WEIGHTS,
} from './registry';

export class PatternAnalyzer {
  private patterns: Pattern[];
  private patternPhrases: Set<string>;
  private customPatterns: Record<
    string,
    {
      name: string;
      severity: Pattern['severity'];
      weight: number;
    }
  >;

  constructor() {
    // Pre-compile patterns on initialization
    this.patterns = PATTERNS;
    this.patternPhrases = this.buildPatternPhrasesSet();
    this.customPatterns = {
      'em-dash-spam': {
        name: 'Em-Dash Spam',
        severity: 'VERY_LOW',
        weight: SEVERITY_WEIGHTS.VERY_LOW,
      },
    };
  }

  /**
   * Build a set of lowercase phrases that are already covered by regex patterns
   * to avoid double-counting in repetition detection
   */
  private buildPatternPhrasesSet(): Set<string> {
    const phrases = new Set<string>();

    // Add specific known phrases from patterns to avoid duplicates
    const knownPhrases = [
      // Transitional words
      'moreover', 'furthermore', 'indeed', 'notably', 'specifically', 'importantly',
      'consequently', 'additionally', 'alternatively', 'essentially', 'arguably',
      'ultimately', 'generally', 'nevertheless', 'nonetheless', 'accordingly',
      'however', 'because', 'although',
      // Bigrams
      'testament to', 'in today\'s', 'designed to', 'harness the', 'as a result',
      'i hope', 'crucial role',
      // Trigrams
      'in order to', 'it is important', 'it is essential', 'it is worth',
      'a testament to', 'designed to enhance', 'i hope this', 'hope this email',
      'in the realm',
    ];

    knownPhrases.forEach(phrase => phrases.add(phrase.toLowerCase()));

    return phrases;
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

    if (text.trim().length === 0) {
      return results;
    }

    const repetitionMatches = this.detectRepetitionPatterns(text);
    if (repetitionMatches.length > 0) {
      results.push(...repetitionMatches);
    }

    const emDashMatch = this.detectEmDashSpam(text);
    if (emDashMatch) {
      results.push(emDashMatch);
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
      const rawMatch = match[0];

      matches.push({
        text: rawMatch,
        context: this.extractContext(text, match.index, rawMatch.length),
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
        continue;
      }

      const customPattern = this.customPatterns[match.patternId];
      if (customPattern) {
        totalScore += customPattern.weight * match.count;
      }
    }

    // Normalize to 0-100 range (cap at 100)
    return Math.min(100, totalScore);
  }

  /**
   * Classify text based on score
   */
  classify(score: number): 'Likely AI Slop' | 'Mixed/Uncertain' | 'Likely Human' {
    if (score >= 65) {
      return 'Likely AI Slop';
    } else if (score >= 35) {
      return 'Mixed/Uncertain';
    } else {
      return 'Likely Human';
    }
  }

  private detectRepetitionPatterns(text: string): PatternMatch[] {
    const patternInfo = this.patterns.find((p) => p.id === 'repetition-ngrams');
    if (!patternInfo) {
      return [];
    }

    const threshold = this.determineRepetitionThreshold(text.length);
    if (threshold === Infinity) {
      return [];
    }

    const units = [
      ...REPETITION_WORDS,
      ...REPETITION_BIGRAMS,
      ...REPETITION_TRIGRAMS,
    ];

    const results: PatternMatch[] = [];

    for (const unit of units) {
      // Skip this unit if it's already covered by a regex pattern
      // This prevents double-counting the same phrase
      if (this.patternPhrases.has(unit.toLowerCase())) {
        continue;
      }

      const occurrences = this.findUnitOccurrences(text, unit);
      if (occurrences.length >= threshold) {
        const matches = occurrences.slice(0, 5).map((occurrence) => ({
          text: occurrence.matched,
          context: this.extractContext(text, occurrence.index, occurrence.matched.length),
          index: occurrence.index,
        }));

        results.push({
          patternId: patternInfo.id,
          patternName: `${patternInfo.name} (${unit})`,
          severity: patternInfo.severity,
          matches,
          count: occurrences.length,
        });
      }
    }

    return results;
  }

  private determineRepetitionThreshold(length: number): number {
    if (length <= 0) {
      return Infinity;
    }
    if (length <= 5000) {
      return 3;
    }
    if (length <= 10000) {
      return 4;
    }
    return 5;
  }

  // Em-dash thresholds scale with text length to reduce false positives on long-form writing.
  private determineEmDashThreshold(length: number): number {
    if (length < 5000) {
      return 3;
    }
    if (length <= 10000) {
      return 5;
    }
    return 6;
  }

  private countEmDashes(text: string): number {
    const matches = text.match(/—/g);
    return matches ? matches.length : 0;
  }

  private detectEmDashSpam(text: string): PatternMatch | null {
    const totalEmDashes = this.countEmDashes(text);
    if (totalEmDashes === 0) {
      return null;
    }

    const threshold = this.determineEmDashThreshold(text.length);
    if (totalEmDashes <= threshold) {
      return null;
    }

    const matches: PatternMatch['matches'] = [];
    const MAX_CONTEXT_MATCHES = 10;

    let index = text.indexOf('—');
    while (index !== -1) {
      if (matches.length < MAX_CONTEXT_MATCHES) {
        matches.push({
          text: '—',
          context: this.extractContext(text, index, 1),
          index,
        });
      }
      index = text.indexOf('—', index + 1);
    }

    const patternMeta = this.customPatterns['em-dash-spam'];

    return {
      patternId: 'em-dash-spam',
      patternName: patternMeta.name,
      severity: patternMeta.severity,
      matches,
      count: totalEmDashes,
    };
  }

  private findUnitOccurrences(
    text: string,
    unit: string
  ): Array<{ index: number; matched: string }> {
    const regex = this.buildUnitRegex(unit);
    const occurrences: Array<{ index: number; matched: string }> = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      occurrences.push({ index: match.index, matched: match[0] });
      if (regex.lastIndex === match.index) {
        regex.lastIndex++;
      }
    }

    return occurrences;
  }

  private buildUnitRegex(unit: string): RegExp {
    const words = unit.split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      return new RegExp(`\\b${this.escapeRegExp(words[0])}\\b`, 'gi');
    }

    const pattern = words.map((word) => `\\b${this.escapeRegExp(word)}\\b`).join('\\s+');
    return new RegExp(pattern, 'gi');
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Generate explanation based on classification and top patterns
   */
  generateExplanation(
    classification: string,
    matches: PatternMatch[]
  ): string {
    if (classification === 'Likely AI Slop') {
      const topPatterns = matches
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((m) => m.patternName)
        .join(', ');

      return `The text shows strong AI writing patterns including: ${topPatterns}. Multiple characteristic AI signals were detected.`;
    } else if (classification === 'Mixed/Uncertain') {
      return 'Mixed/Uncertain classification indicates the text has some AI-like patterns alongside human characteristics. It may be AI-generated with human editing, or human writing influenced by AI style, or academic writing.';
    } else {
      if (matches.length === 0) {
        return 'No significant AI writing patterns detected. The text exhibits natural human writing characteristics.';
      }
      return 'The text shows minimal AI patterns and appears to be primarily human-written, for humans.';
    }
  }
}
