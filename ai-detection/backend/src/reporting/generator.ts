// Report Generator - Creates analysis reports
import { AnalysisResult, PatternMatch, AnalysisMetadata } from '../types';
import { PATTERN_ENGINE_VERSION } from '../patterns/registry';

export class ReportGenerator {
  /**
   * Generate complete analysis report
   */
  static generate(
    classification: 'Likely AI-generated' | 'Mixed/Uncertain' | 'Likely Human-written',
    score: number,
    patterns: PatternMatch[],
    explanation: string,
    characterCount: number,
    wordCount: number,
    duration: number,
    warnings: string[] = []
  ): AnalysisResult {
    const metadata: AnalysisMetadata = {
      character_count: characterCount,
      word_count: wordCount,
      pattern_engine_version: PATTERN_ENGINE_VERSION,
      analysis_duration: duration,
      timestamp: new Date().toISOString(),
      warnings,
    };

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
        // Sort by total contribution (count × weight)
        const weightMap = { CRITICAL: 20, HIGH: 10, MEDIUM: 5, LOW: 2 };
        const scoreA = a.count * weightMap[a.severity];
        const scoreB = b.count * weightMap[b.severity];
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
