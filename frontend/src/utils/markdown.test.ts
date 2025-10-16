import { analysisResultToMarkdown } from './markdown';
import type { AnalysisResult } from '../types';

describe('analysisResultToMarkdown', () => {
  const baseResult: AnalysisResult = {
    classification: 'Likely AI Slop',
    confidence_score: 88,
    explanation: 'Mock explanation about AI indicators.',
    patterns_detected: [
      {
        patternId: 'ai-self-reference',
        patternName: 'AI Self-Reference',
        severity: 'CRITICAL',
        count: 2,
        matches: [
          { text: 'as an AI language model', context: '...', index: 0 },
          { text: 'as an AI assistant', context: '...', index: 42 },
        ],
      },
      {
        patternId: 'collaborative-hope-helps',
        patternName: 'Collaborative: I Hope This Helps',
        severity: 'HIGH',
        count: 1,
        matches: [{ text: 'I hope this helps', context: '...', index: 10 }],
      },
    ],
    metadata: {
      character_count: 1200,
      word_count: 220,
      pattern_engine_version: '1.2.0',
      analysis_duration: 17,
      timestamp: '2025-10-14T12:00:00.000Z',
      warnings: ['Sample warning'],
    },
  };

  it('creates a readable markdown report with key sections', () => {
    const markdown = analysisResultToMarkdown(baseResult);

    expect(markdown).toContain('# Slop Detection Analysis Report');
    expect(markdown).toContain('## Summary');
    expect(markdown).toContain('**Classification:** Likely AI Slop');
    expect(markdown).toContain('**Confidence Score:** 88');
    expect(markdown).toContain('## Patterns');
    expect(markdown).toContain('### Critical Patterns');
    expect(markdown).toContain('AI Self-Reference');
    expect(markdown).toContain('Match: _`as an AI language model`_');
    expect(markdown).toContain('Context: ...');
    expect(markdown).toContain('## Metadata');
    expect(markdown).toContain('Pattern Engine Version');
    expect(markdown).toContain('## Warnings');
    expect(markdown).toContain('Sample warning');
  });

  it('handles empty pattern and warning lists gracefully', () => {
    const markdown = analysisResultToMarkdown({
      ...baseResult,
      patterns_detected: [],
      metadata: { ...baseResult.metadata, warnings: [] },
    });

    expect(markdown).toContain('_No patterns detected._');
    expect(markdown).toContain('_None._');
  });
});
