import { render, screen } from '@testing-library/react';
import { Results } from './Results';
import type { AnalysisResult } from '../types';

const sampleResult: AnalysisResult = {
  classification: 'Mixed/Uncertain',
  confidence_score: 42,
  explanation: 'Sample explanation',
  patterns_detected: [
    {
      patternId: 'critical',
      patternName: 'Critical Pattern',
      severity: 'CRITICAL',
      count: 1,
      matches: [{ text: 'critical', context: '...', index: 0 }],
    },
    {
      patternId: 'very-low',
      patternName: 'Very Low Pattern',
      severity: 'VERY_LOW',
      count: 2,
      matches: [{ text: 'very-low', context: '...', index: 10 }],
    },
    {
      patternId: 'informational',
      patternName: 'Informational Pattern',
      severity: 'INFORMATIONAL',
      count: 3,
      matches: [{ text: 'informational', context: '...', index: 20 }],
    },
  ],
  metadata: {
    character_count: 500,
    word_count: 100,
    analysis_duration: 10,
    pattern_engine_version: '1.2.0',
    timestamp: '2025-10-16T12:00:00.000Z',
    warnings: [],
  },
};

describe('Results component severity display', () => {
  it('renders very low and informational severities', () => {
    render(<Results result={sampleResult} />);

    expect(screen.getByText(/VERY_LOW/)).toBeInTheDocument();
    expect(screen.getByText(/INFORMATIONAL/)).toBeInTheDocument();
    expect(screen.getByText(/Very Low Pattern/)).toBeInTheDocument();
    expect(screen.getByText(/Informational Pattern/)).toBeInTheDocument();
  });
});
