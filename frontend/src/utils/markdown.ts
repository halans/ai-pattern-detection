import type { AnalysisResult, PatternMatch, Severity } from '../types';

const severityOrder: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const severityTitles: Record<Severity, string> = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function formatMatch(match: PatternMatch['matches'][number]): string {
  const snippet = normalizeWhitespace(match.text);
  const context = normalizeWhitespace(match.context);
  const contextLine = context ? `   \n      Context: ${context}` : '';
  return `    - Match: _\`${snippet}\`_ ${contextLine}`;
}

function formatPatternsSection(patterns: PatternMatch[]): string {
  if (patterns.length === 0) {
    return '_No patterns detected._';
  }

  const grouped = severityOrder
    .map((severity) => ({
      severity,
      patterns: patterns.filter((pattern) => pattern.severity === severity),
    }))
    .filter((group) => group.patterns.length > 0);

  if (grouped.length === 0) {
    return '_No patterns detected._';
  }

  return grouped
    .map((group) => {
      const header = `### ${severityTitles[group.severity]} Patterns`;
      const items = group.patterns
        .map((pattern) => {
          const matchLines =
            pattern.matches.length > 0
              ? pattern.matches
                  .slice(0, 3)
                  .map((match) => formatMatch(match))
                  .join('\n')
              : '    - _No specific match excerpts available._';

          return `- **${pattern.patternName}** (count: ${pattern.count})\n${matchLines}`;
        })
        .join('\n');
      return `${header}\n${items}`;
    })
    .join('\n\n');
}

function formatWarnings(warnings: string[]): string {
  if (!warnings || warnings.length === 0) {
    return '_None._';
  }

  return warnings.map((warning) => `- ${warning}`).join('\n');
}

export function analysisResultToMarkdown(result: AnalysisResult): string {
  const {
    classification,
    confidence_score,
    explanation,
    patterns_detected,
    metadata,
  } = result;

  const metadataSection = [
    `- **Character Count:** ${metadata.character_count.toLocaleString()}`,
    `- **Word Count:** ${metadata.word_count.toLocaleString()}`,
    `- **Pattern Engine Version:** ${metadata.pattern_engine_version}`,
    `- **Analysis Duration:** ${metadata.analysis_duration}ms`,
    `- **Timestamp:** ${metadata.timestamp}`,
  ].join('\n');

  const patternsSection = formatPatternsSection(patterns_detected);
  const warningsSection = formatWarnings(metadata.warnings);

  return [
    '# Slop Detection Analysis Report',
    '',
    '## Summary',
    `- **Classification:** ${classification}`,
    `- **Confidence Score:** ${confidence_score}`,
    `- **Patterns Detected:** ${patterns_detected.length}`,
    '',
    '## Explanation',
    explanation,
    '',
    '## Patterns',
    patternsSection,
    '',
    '## Metadata',
    metadataSection,
    '',
    '## Warnings',
    warningsSection,
    '',
  ].join('\n');
}
