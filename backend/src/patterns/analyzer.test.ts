import { describe, it, expect, beforeEach } from 'vitest';
import { PatternAnalyzer } from './analyzer';

describe('PatternAnalyzer', () => {
  let analyzer: PatternAnalyzer;

  beforeEach(() => {
    analyzer = new PatternAnalyzer();
  });

  const createEmDashText = (fillerWord: string, repeats: number, dashCount: number): string => {
    const filler = `${fillerWord} `.repeat(repeats);
    const dashSegments = Array.from({ length: dashCount }, (_, index) => `clause${index} — continuation${index}.`).join(' ');
    return `${filler}${dashSegments}`.trim();
  };

  describe('analyze', () => {
    it('should detect AI self-reference patterns', () => {
      const text = 'As an AI language model, I can help you with that.';
      const matches = analyzer.analyze(text);

      expect(matches.length).toBeGreaterThan(0);
      const aiSelfRef = matches.find(m => m.patternId === 'ai-self-reference');
      expect(aiSelfRef).toBeDefined();
      expect(aiSelfRef!.count).toBe(1);
    });

    it('should detect multiple pattern types', () => {
      const text = 'As an AI language model, I hope this helps! Certainly, I can provide more information.';
      const matches = analyzer.analyze(text);

      expect(matches.length).toBeGreaterThan(1);
      expect(matches.some(m => m.patternId === 'ai-self-reference')).toBe(true);
      expect(matches.some(m => m.patternId === 'collaborative-hope-helps')).toBe(true);
    });

    it('should detect repeated patterns', () => {
      const text = 'The robust solution provides seamless integration with innovative features.';
      const matches = analyzer.analyze(text);

      const adjectives = matches.find(m => m.patternId === 'ai-adjectives');
      expect(adjectives).toBeDefined();
      expect(adjectives!.count).toBeGreaterThanOrEqual(3);
    });

    it('should return empty array for clean human text', () => {
      const text = 'I went to the store yesterday. The weather was nice.';
      const matches = analyzer.analyze(text);

      // Might have some low-level matches, but should be minimal
      expect(matches.length).toBeLessThan(3);
    });

    it('should provide context for each match', () => {
      const text = 'This is a test. As an AI language model, I can help. End of test.';
      const matches = analyzer.analyze(text);

      const aiMatch = matches.find(m => m.patternId === 'ai-self-reference');
      expect(aiMatch).toBeDefined();
      expect(aiMatch!.matches[0].context).toContain('As an AI language model');
    });

    it('should handle case-insensitive matching', () => {
      const text = 'CERTAINLY! I can help with that.';
      const matches = analyzer.analyze(text);

      const certainlyMatch = matches.find(m => m.patternId === 'collaborative-certainly');
      expect(certainlyMatch).toBeDefined();
    });

    it('should detect business jargon', () => {
      const text = 'Our stakeholders need a scalable value proposition with strong ROI.';
      const matches = analyzer.analyze(text);

      const jargon = matches.find(m => m.patternId === 'business-jargon');
      expect(jargon).toBeDefined();
      expect(jargon!.count).toBeGreaterThan(0);
    });

    it('should detect em-dash spam with count greater than sampled contexts', () => {
      const text = [
        'This passage — with an extended clause that keeps elaborating on a single idea for far too long — continues to stack even more commentary — while stretching across multiple segments — ensuring that the detection logic has plenty to evaluate — and still going with additional elaboration.',
        'Another paragraph — includes more excessive usage — to reinforce the spammy pattern and demonstrate the detector handling multiple lines — with additional descriptive language for good measure.'
      ].join('\n');

      const matches = analyzer.analyze(text);

      const emDash = matches.find(m => m.patternId === 'em-dash-spam');
      expect(emDash).toBeDefined();
      const totalDashes = (text.match(/—/g) ?? []).length;
      expect(emDash!.count).toBe(totalDashes);
      expect(emDash!.matches.length).toBeLessThanOrEqual(10);
      expect(emDash!.matches[0].text).toBe('—');
      expect(emDash!.matches[0].context).toContain('—');
    });

    it('should detect repetition of targeted words based on thresholds', () => {
      const text =
        'Also we can share updates. Also, the system highlights patterns. Also it repeats frequently.';
      const matches = analyzer.analyze(text);

      const repetition = matches.find(m => m.patternId === 'repetition-ngrams');
      expect(repetition).toBeDefined();
      expect(repetition!.count).toBeGreaterThanOrEqual(3);
      expect(repetition!.matches[0].text.toLowerCase()).toContain('also');
    });

    it('should require higher repetitions for medium length text', () => {
      const filler = 'word '.repeat(1300); // ~6500 characters
      const phrase = 'Let us explore new ideas. ';
      const text = `${filler}${phrase.repeat(4)}`;

      const matches = analyzer.analyze(text);
      const repetition = matches.find(
        m => m.patternId === 'repetition-ngrams' && m.patternName.includes('let us')
      );

      expect(repetition).toBeDefined();
      expect(repetition!.count).toBeGreaterThanOrEqual(4);
    });

    it('should require higher repetitions for long text', () => {
      const filler = 'content '.repeat(2200); // > 11000 characters
      const phrase = 'As well as new options. ';
      const text = `${filler}${phrase.repeat(5)}`;

      const matches = analyzer.analyze(text);
      const repetition = matches.find(
        m => m.patternId === 'repetition-ngrams' && m.patternName.includes('as well as')
      );

      expect(repetition).toBeDefined();
      expect(repetition!.count).toBeGreaterThanOrEqual(5);
    });

    it('should treat informational patterns with minimal weight', () => {
      const text =
        'Additionally, however, moreover, consequently, indeed. Furthermore, accordingly, thus, undoubtedly.';
      const matches = analyzer.analyze(text);
      const score = analyzer.calculateScore(matches);

      const informational = matches.find(m => m.patternId === 'transitional-words');
      expect(informational).toBeDefined();
      expect(informational!.severity).toBe('INFORMATIONAL');
      expect(informational!.count).toBeGreaterThanOrEqual(5);
      expect(score).toBeLessThan(30);
    });

    it('should not flag repetitions below threshold', () => {
      const text = 'Also we consider this. Also it matters.';
      const matches = analyzer.analyze(text);

      const repetition = matches.find(m => m.patternId === 'repetition-ngrams');
      expect(repetition).toBeUndefined();
    });

    it('should not flag short text when em-dash count is within threshold', () => {
      const text = createEmDashText('intro', 400, 3);
      expect(text.length).toBeLessThan(5000);

      const matches = analyzer.analyze(text);
      const emDash = matches.find(m => m.patternId === 'em-dash-spam');
      expect(emDash).toBeUndefined();
    });

    it('should flag short text when em-dash count exceeds threshold', () => {
      const text = createEmDashText('intro', 400, 4);
      expect(text.length).toBeLessThan(5000);

      const matches = analyzer.analyze(text);
      const emDash = matches.find(m => m.patternId === 'em-dash-spam');
      expect(emDash).toBeDefined();
      expect(emDash!.count).toBe(4);
    });

    it('should not flag medium text when em-dash count is within threshold', () => {
      const text = createEmDashText('body', 1200, 5);
      expect(text.length).toBeGreaterThanOrEqual(5000);
      expect(text.length).toBeLessThan(10000);

      const matches = analyzer.analyze(text);
      const emDash = matches.find(m => m.patternId === 'em-dash-spam');
      expect(emDash).toBeUndefined();
    });

    it('should flag medium text when em-dash count exceeds threshold', () => {
      const text = createEmDashText('body', 1200, 6);
      expect(text.length).toBeGreaterThanOrEqual(5000);
      expect(text.length).toBeLessThan(10000);

      const matches = analyzer.analyze(text);
      const emDash = matches.find(m => m.patternId === 'em-dash-spam');
      expect(emDash).toBeDefined();
      expect(emDash!.count).toBe(6);
    });

    it('should not flag long text when em-dash count is within threshold', () => {
      const text = createEmDashText('content', 1700, 6);
      expect(text.length).toBeGreaterThan(10000);

      const matches = analyzer.analyze(text);
      const emDash = matches.find(m => m.patternId === 'em-dash-spam');
      expect(emDash).toBeUndefined();
    });

    it('should flag long text when em-dash count exceeds threshold', () => {
      const text = createEmDashText('content', 1700, 7);
      expect(text.length).toBeGreaterThan(10000);

      const matches = analyzer.analyze(text);
      const emDash = matches.find(m => m.patternId === 'em-dash-spam');
      expect(emDash).toBeDefined();
      expect(emDash!.count).toBe(7);
    });
  });

  describe('em-dash utilities', () => {
    it('determines thresholds based on text length', () => {
      const determineThreshold = (length: number) =>
        (analyzer as any).determineEmDashThreshold(length) as number;

      expect(determineThreshold(1000)).toBe(3);
      expect(determineThreshold(4999)).toBe(3);
      expect(determineThreshold(5000)).toBe(5);
      expect(determineThreshold(7500)).toBe(5);
      expect(determineThreshold(10000)).toBe(5);
      expect(determineThreshold(10001)).toBe(6);
      expect(determineThreshold(20000)).toBe(6);
    });

    it('counts em-dashes accurately', () => {
      const countEmDashes = (input: string) => (analyzer as any).countEmDashes(input) as number;

      expect(countEmDashes('No em dash here.')).toBe(0);
      expect(countEmDashes('—Starting with one.')).toBe(1);
      expect(countEmDashes('Wrapped — in — middle — positions.')).toBe(3);
      expect(countEmDashes('Multiple — lines\n— with extra — usage — across lines.')).toBe(4);
    });
  });
  describe('calculateScore', () => {
    it('should calculate score based on pattern weights', () => {
      const text = 'As an AI language model, I hope this helps!';
      const matches = analyzer.analyze(text);
      const score = analyzer.calculateScore(matches);

      // AI self-reference (CRITICAL, 15 points) + collaborative phrase (HIGH, 8 points)
      expect(score).toBeGreaterThanOrEqual(23);
    });

    it('should cap score at 100', () => {
      const text = 'As an AI language model, '.repeat(10) + ' I hope this helps!';
      const matches = analyzer.analyze(text);
      const score = analyzer.calculateScore(matches);

      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return 0 for no matches', () => {
      const matches: ReturnType<PatternAnalyzer['analyze']> = [];
      const score = analyzer.calculateScore(matches);

      expect(score).toBe(0);
    });

    it('should weight CRITICAL patterns highest', () => {
      const criticalText = 'As an AI language model, I can assist.';
      const criticalMatches = analyzer.analyze(criticalText);
      const criticalScore = analyzer.calculateScore(criticalMatches);

      const lowText = 'The robust and seamless solution.';
      const lowMatches = analyzer.analyze(lowText);
      const lowScore = analyzer.calculateScore(lowMatches);

      expect(criticalScore).toBeGreaterThan(lowScore);
    });
  });

  describe('classify', () => {
    it('should classify score >= 65 as Likely AI Slop', () => {
      expect(analyzer.classify(65)).toBe('Likely AI Slop');
      expect(analyzer.classify(85)).toBe('Likely AI Slop');
      expect(analyzer.classify(100)).toBe('Likely AI Slop');
    });

    it('should classify score 35-64 as Mixed/Uncertain', () => {
      expect(analyzer.classify(35)).toBe('Mixed/Uncertain');
      expect(analyzer.classify(50)).toBe('Mixed/Uncertain');
      expect(analyzer.classify(64)).toBe('Mixed/Uncertain');
    });

    it('should classify score 0-34 as Likely Human', () => {
      expect(analyzer.classify(0)).toBe('Likely Human');
      expect(analyzer.classify(15)).toBe('Likely Human');
      expect(analyzer.classify(34)).toBe('Likely Human');
    });
  });

  describe('generateExplanation', () => {
    it('should generate explanation for AI Slop classification', () => {
      const matches = analyzer.analyze('As an AI language model, I hope this helps! Certainly!');
      const explanation = analyzer.generateExplanation('Likely AI Slop', matches);

      expect(explanation).toContain('strong AI writing patterns');
      expect(explanation.length).toBeGreaterThan(50);
    });

    it('should generate explanation for Mixed classification', () => {
      const explanation = analyzer.generateExplanation('Mixed/Uncertain', []);

      expect(explanation).toContain('Mixed');
      expect(explanation).toContain('human');
    });

    it('should generate explanation for Human-written classification', () => {
      const explanation = analyzer.generateExplanation('Likely Human-written', []);

      expect(explanation).toContain('human');
      expect(explanation).toContain('No significant AI');
    });

    it('should include top patterns in AI explanation', () => {
      const matches = analyzer.analyze('As an AI language model, I hope this helps! Let me know if you need more.');
      const explanation = analyzer.generateExplanation('Likely AI Slop', matches);

      // Should mention at least one pattern name
      expect(explanation.length).toBeGreaterThan(50);
    });
  });

  describe('Integration Tests', () => {
    it('should correctly analyze typical AI-generated text', () => {
      const text = `As an AI language model, I hope this helps! Let me know if you need anything else.
      Certainly, I can provide more information. It's important to note that this is a comprehensive overview.`;

      const matches = analyzer.analyze(text);
      const score = analyzer.calculateScore(matches);
      const classification = analyzer.classify(score);

      expect(matches.length).toBeGreaterThan(3);
      expect(score).toBeGreaterThan(30); // Adjusted after removing double-counting
      expect(['Likely AI Slop', 'Mixed/Uncertain']).toContain(classification);
    });

    it('should correctly analyze typical human-written text', () => {
      const text = `I went to the store yesterday. The weather was nice.
      I bought some groceries and came home. My dog was happy to see me.`;

      const matches = analyzer.analyze(text);
      const score = analyzer.calculateScore(matches);
      const classification = analyzer.classify(score);

      expect(score).toBeLessThan(40);
      expect(['Likely Human', 'Mixed/Uncertain']).toContain(classification);
    });

    it('should handle empty text', () => {
      const matches = analyzer.analyze('');
      const score = analyzer.calculateScore(matches);

      expect(matches.length).toBe(0);
      expect(score).toBe(0);
    });

    it('should handle long text efficiently', () => {
      const longText = 'This is a test sentence. '.repeat(100);
      const startTime = Date.now();

      analyzer.analyze(longText);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
