import { describe, it, expect } from 'vitest';
import { ReportGenerator } from './generator';
import type { PatternMatch } from '../types';
import { SEVERITY_WEIGHTS } from '../patterns/registry';

const makeMatch = (severity: any, count: number): PatternMatch => ({
  patternId: `${severity.toLowerCase()}-pattern`,
  patternName: `${severity} Pattern`,
  severity,
  count,
  matches: [
    {
      text: 'example',
      context: 'example context',
      index: 0,
    },
  ],
});

describe('ReportGenerator', () => {
  it('groups patterns by severity including new tiers', () => {
    const matches = [
      makeMatch('CRITICAL', 1),
      makeMatch('VERY_LOW', 2),
      makeMatch('INFORMATIONAL', 3),
    ];

    const grouped = ReportGenerator.groupBySeverity(matches);
    expect(grouped.CRITICAL).toHaveLength(1);
    expect(grouped.VERY_LOW).toHaveLength(1);
    expect(grouped.INFORMATIONAL).toHaveLength(1);
  });

  it('ranks top patterns using updated weights', () => {
    const matches = [
      makeMatch('CRITICAL', 1), // 15
      makeMatch('HIGH', 2), // 16
      makeMatch('VERY_LOW', 5), // 5
      makeMatch('INFORMATIONAL', 10), // 2
    ];

    const top = ReportGenerator.getTopPatterns(matches, 2);
    expect(top).toHaveLength(2);
    expect(top[0].severity).toBe('HIGH');
    expect(top[1].severity).toBe('CRITICAL');

    const contributions = top.map(match => match.count * SEVERITY_WEIGHTS[match.severity]);
    expect(contributions[0]).toBeGreaterThanOrEqual(contributions[1]);
  });
});
