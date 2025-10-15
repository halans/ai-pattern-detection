import { describe, it, expect, beforeEach } from 'vitest';
import { PatternAnalyzer } from './analyzer';

describe('PatternAnalyzer', () => {
  let analyzer: PatternAnalyzer;

  beforeEach(() => {
    analyzer = new PatternAnalyzer();
  });

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

    it('should not flag repetitions below threshold', () => {
      const text = 'Also we consider this. Also it matters.';
      const matches = analyzer.analyze(text);

      const repetition = matches.find(m => m.patternId === 'repetition-ngrams');
      expect(repetition).toBeUndefined();
    });
  });

  describe('calculateScore', () => {
    it('should calculate score based on pattern weights', () => {
      const text = 'As an AI language model, I hope this helps!';
      const matches = analyzer.analyze(text);
      const score = analyzer.calculateScore(matches);

      // AI self-reference (CRITICAL, 20 points) + collaborative phrase (HIGH, 10 points)
      expect(score).toBeGreaterThanOrEqual(30);
    });

    it('should cap score at 100', () => {
      const text = 'As an AI language model, '.repeat(10) + ' I hope this helps!';
      const matches = analyzer.analyze(text);
      const score = analyzer.calculateScore(matches);

      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return 0 for no matches', () => {
      const matches = [];
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
    it('should classify score >= 70 as Likely AI-generated', () => {
      expect(analyzer.classify(70)).toBe('Likely AI-generated');
      expect(analyzer.classify(85)).toBe('Likely AI-generated');
      expect(analyzer.classify(100)).toBe('Likely AI-generated');
    });

    it('should classify score 31-69 as Mixed/Uncertain', () => {
      expect(analyzer.classify(31)).toBe('Mixed/Uncertain');
      expect(analyzer.classify(50)).toBe('Mixed/Uncertain');
      expect(analyzer.classify(69)).toBe('Mixed/Uncertain');
    });

    it('should classify score 0-30 as Likely Human-written', () => {
      expect(analyzer.classify(0)).toBe('Likely Human-written');
      expect(analyzer.classify(15)).toBe('Likely Human-written');
      expect(analyzer.classify(30)).toBe('Likely Human-written');
    });
  });

  describe('generateExplanation', () => {
    it('should generate explanation for AI-generated classification', () => {
      const matches = analyzer.analyze('As an AI language model, I hope this helps! Certainly!');
      const explanation = analyzer.generateExplanation('Likely AI-generated', matches);

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
      const explanation = analyzer.generateExplanation('Likely AI-generated', matches);

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
      expect(score).toBeGreaterThan(40);
      expect(['Likely AI-generated', 'Mixed/Uncertain']).toContain(classification);
    });

    it('should correctly analyze typical human-written text', () => {
      const text = `I went to the store yesterday. The weather was nice.
      I bought some groceries and came home. My dog was happy to see me.`;

      const matches = analyzer.analyze(text);
      const score = analyzer.calculateScore(matches);
      const classification = analyzer.classify(score);

      expect(score).toBeLessThan(40);
      expect(['Likely Human-written', 'Mixed/Uncertain']).toContain(classification);
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
