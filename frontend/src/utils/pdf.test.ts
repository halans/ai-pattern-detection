import { downloadPDF } from './api';
import type { AnalysisResult } from '../types';

vi.mock('jspdf', () => {
  const setFont = vi.fn();
  const setFontSize = vi.fn();
  const text = vi.fn();
  const addPage = vi.fn();
  const save = vi.fn();

  const JsPDFMock = vi.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: () => 595,
        getHeight: () => 842,
      },
    },
    setFont,
    setFontSize,
    text,
    addPage,
    save,
  }));

  return {
    __esModule: true,
    default: JsPDFMock,
    __mocks: { setFont, setFontSize, text, addPage, save },
  };
});

describe('downloadPDF', () => {
  const sampleResult: AnalysisResult = {
    classification: 'Likely AI Slop',
    confidence_score: 88,
    explanation: 'Sample explanation for PDF export.',
    patterns_detected: [
      {
        patternId: 'ai-self-reference',
        patternName: 'AI Self-Reference',
        severity: 'CRITICAL',
        count: 1,
        matches: [
          {
            text: 'as an AI language model',
            context: 'The assistant said as an AI language model I can assist.',
            index: 5,
          },
        ],
      },
    ],
    metadata: {
      character_count: 300,
      word_count: 60,
      pattern_engine_version: '1.2.0',
      analysis_duration: 15,
      timestamp: '2025-10-14T12:34:56.000Z',
      warnings: [],
    },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('invokes jsPDF and saves a file', async () => {
    await downloadPDF(sampleResult, 'report.pdf');

    const jsPDFModule: any = await import('jspdf');
    expect(jsPDFModule.default).toHaveBeenCalledTimes(1);
    const instance = jsPDFModule.default.mock.results[0].value;
    expect(instance.save).toHaveBeenCalledWith('report.pdf');
    expect(instance.text).toHaveBeenCalled();
  });
});
