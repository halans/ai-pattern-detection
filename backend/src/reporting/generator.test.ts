import { describe, it, expect } from 'vitest';
import { ReportGenerator } from './generator';
import type { PatternMatch } from '../types';

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
      makeMatch('CRITICAL', 1), // contribution 20
      makeMatch('HIGH', 2), // 20
      makeMatch('VERY_LOW', 5), // 5
      makeMatch('INFORMATIONAL', 10), // 2
    ];

    const top = ReportGenerator.getTopPatterns(matches, 2);
    expect(top).toHaveLength(2);
    expect(top[0].severity).toBe('CRITICAL');
    expect(top[1].severity).toBe('HIGH');
  });
});
