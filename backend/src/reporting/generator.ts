// Report Generator - Creates analysis reports
import { AnalysisResult, PatternMatch, AnalysisMetadata } from '../types';
import { PATTERN_ENGINE_VERSION, SEVERITY_WEIGHTS } from '../patterns/registry';

export class ReportGenerator {
  /**
   * Generate complete analysis report
   */
  static generate(
    classification: 'Likely AI Slop' | 'Mixed/Uncertain' | 'Likely Human',
    score: number,
    patterns: PatternMatch[],
    explanation: string,
    characterCount: number,
    wordCount: number,
    duration: number,
    warnings: string[] = [],
    options: {
      submissionSource?: 'text' | 'file';
      fileMetadata?: {
        name: string;
        type: 'txt' | 'md' | 'html';
        character_count: number;
      };
    } = {}
  ): AnalysisResult {
    const metadata: AnalysisMetadata = {
      character_count: characterCount,
      word_count: wordCount,
      pattern_engine_version: PATTERN_ENGINE_VERSION,
      analysis_duration: duration,
      timestamp: new Date().toISOString(),
      warnings,
      submission_source: options.submissionSource ?? 'text',
    };

    if (options.fileMetadata) {
      metadata.file_metadata = options.fileMetadata;
    }

    return {
      classification,
      confidence_score: score,
      patterns_detected: patterns,
      explanation,
      metadata,
    };
  }

  /**
   * Group patterns by severity for display
   */
  static groupBySeverity(patterns: PatternMatch[]): Record<string, PatternMatch[]> {
    const grouped: Record<string, PatternMatch[]> = {
      CRITICAL: [],
      HIGH: [],
      MEDIUM: [],
      LOW: [],
      VERY_LOW: [],
      INFORMATIONAL: [],
    };

    for (const pattern of patterns) {
      grouped[pattern.severity].push(pattern);
    }

    return grouped;
  }

  /**
   * Get top N patterns by contribution to score
   */
  static getTopPatterns(patterns: PatternMatch[], n: number = 5): PatternMatch[] {
    return [...patterns]
      .sort((a, b) => {
        const weightA = SEVERITY_WEIGHTS[a.severity];
        const weightB = SEVERITY_WEIGHTS[b.severity];
        const scoreA = a.count * weightA;
        const scoreB = b.count * weightB;
        return scoreB - scoreA;
      })
      .slice(0, n);
  }

  /**
   * Format report as JSON string
   */
  static toJSON(report: AnalysisResult): string {
    return JSON.stringify(report, null, 2);
  }
}
