import { describe, it, expect } from 'vitest';
import { PATTERNS, getPatternById, getPatternsBySeverity, PATTERN_ENGINE_VERSION } from './registry';

describe('Pattern Registry', () => {
  describe('PATTERNS array', () => {
    it('should contain patterns', () => {
      expect(PATTERNS).toBeDefined();
      expect(PATTERNS.length).toBeGreaterThan(0);
    });

    it('should have at least 45 patterns', () => {
      expect(PATTERNS.length).toBeGreaterThanOrEqual(45);
    });

    it('should have unique pattern IDs', () => {
      const ids = PATTERNS.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid severity levels', () => {
      const validSeverities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW', 'INFORMATIONAL'];
      PATTERNS.forEach(pattern => {
        expect(validSeverities).toContain(pattern.severity);
      });
    });

    it('should have valid weights', () => {
      PATTERNS.forEach(pattern => {
        expect(pattern.weight).toBeGreaterThan(0);
        expect(pattern.weight).toBeLessThanOrEqual(20);
      });
    });

    it('should have proper weight assignments by severity', () => {
      const criticalPatterns = PATTERNS.filter(p => p.severity === 'CRITICAL');
      const highPatterns = PATTERNS.filter(p => p.severity === 'HIGH');
      const mediumPatterns = PATTERNS.filter(p => p.severity === 'MEDIUM');
      const lowPatterns = PATTERNS.filter(p => p.severity === 'LOW');

      criticalPatterns.forEach(p => expect(p.weight).toBe(15));
      highPatterns.forEach(p => expect(p.weight).toBe(8));
      mediumPatterns.forEach(p => expect(p.weight).toBe(4));
      lowPatterns.forEach(p => expect(p.weight).toBe(2));
    });

    it('should have valid regex patterns', () => {
      PATTERNS.forEach(pattern => {
        expect(pattern.regex).toBeInstanceOf(RegExp);
      });
    });

    it('should have non-empty examples', () => {
      PATTERNS.forEach(pattern => {
        expect(pattern.examples).toBeDefined();
        expect(pattern.examples.length).toBeGreaterThan(0);
      });
    });

    it('should include repetition n-gram pattern', () => {
      const repetition = PATTERNS.find(p => p.id === 'repetition-ngrams');
      expect(repetition).toBeDefined();
      expect(repetition!.severity).toBe('VERY_LOW');
      expect(repetition!.weight).toBeGreaterThan(0);
    });
  });

  describe('Pattern Matching', () => {
    it('should match AI self-reference pattern', () => {
      const pattern = PATTERNS.find(p => p.id === 'ai-self-reference');
      expect(pattern).toBeDefined();
      expect('as an AI language model'.match(pattern!.regex)).toBeTruthy();
      expect('as an AI assistant'.match(pattern!.regex)).toBeTruthy();
      expect('as a human'.match(pattern!.regex)).toBeFalsy();
    });

    it('should match knowledge cutoff pattern', () => {
      const pattern = PATTERNS.find(p => p.id === 'knowledge-cutoff');
      expect(pattern).toBeDefined();
      expect('as of my last update'.match(pattern!.regex)).toBeTruthy();
      expect('as at my latest training'.match(pattern!.regex)).toBeTruthy();
    });

    it('should match collaborative phrases', () => {
      const pattern = PATTERNS.find(p => p.id === 'collaborative-certainly');
      expect(pattern).toBeDefined();
      expect('Certainly!'.match(pattern!.regex)).toBeTruthy();
      expect('Of course!'.match(pattern!.regex)).toBeTruthy();
    });

    it('should match only "here is" collaborative phrases', () => {
      const pattern = PATTERNS.find(p => p.id === 'collaborative-here-is');
      expect(pattern).toBeDefined();
      expect("Here's a summary".match(pattern!.regex)).toBeTruthy();
      expect('Here is a breakdown'.match(pattern!.regex)).toBeTruthy();
      expect('There is a breakdown'.match(pattern!.regex)).toBeFalsy();
      expect("There's a summary".match(pattern!.regex)).toBeFalsy();
    });

    it('should detect placeholder templates', () => {
      const pattern = PATTERNS.find(p => p.id === 'placeholder-template');
      expect(pattern).toBeDefined();

      const shouldMatch = [
        'Please insert username here',
        '{PLACEHOLDER VALUE}',
        'This section is TBD.',
        'lorem ipsum dolor sit amet',
        'Test User account information',
        'John Doe will be replaced',
        'your company name here',
        'AcmeCompany',
        'Name: ____',
        '[TOPIC]',
        '[SUBJECT]',
        '[placeholder text]',
        '[Placeholder text]',
        '[placeholder]',
        '[PLACEHOLDER]',
        'PLACEHOLDER',
      ];

      shouldMatch.forEach(sample => {
        const regex = new RegExp(pattern!.regex.source, pattern!.regex.flags);
        expect(regex.test(sample)).toBe(true);
      });

      const negative = new RegExp(pattern!.regex.source, pattern!.regex.flags);
      expect(negative.test('Meaningful production-grade sentence.')).toBe(false);
      expect(negative.test('[Topic]')).toBe(false);
      expect(negative.test('[PLACEHOLD]')).toBe(false);
    });

    it('should match business jargon', () => {
      const pattern = PATTERNS.find(p => p.id === 'business-jargon');
      expect(pattern).toBeDefined();
      expect('stakeholders'.match(pattern!.regex)).toBeTruthy();
      expect('paradigm shift'.match(pattern!.regex)).toBeTruthy();
      expect('value proposition'.match(pattern!.regex)).toBeTruthy();
    });

    it('should match AI-favored adjectives', () => {
      const pattern = PATTERNS.find(p => p.id === 'ai-adjectives');
      expect(pattern).toBeDefined();
      expect('robust'.match(pattern!.regex)).toBeTruthy();
      expect('seamless'.match(pattern!.regex)).toBeTruthy();
      expect('quintessential'.match(pattern!.regex)).toBeTruthy();
      expect('paradigm-shifting'.match(pattern!.regex)).toBeTruthy();
    });

    it('should match dramatic action words', () => {
      const pattern = PATTERNS.find(p => p.id === 'action-words');
      expect(pattern).toBeDefined();
      expect('delve into'.match(pattern!.regex)).toBeTruthy();
      expect('unlock the secrets'.match(pattern!.regex)).toBeTruthy();
      expect('transcend'.match(pattern!.regex)).toBeTruthy();
      expect('galvanize'.match(pattern!.regex)).toBeTruthy();
    });
  });

  describe('getPatternById', () => {
    it('should return pattern by ID', () => {
      const pattern = getPatternById('ai-self-reference');
      expect(pattern).toBeDefined();
      expect(pattern?.id).toBe('ai-self-reference');
    });

    it('should return undefined for non-existent ID', () => {
      const pattern = getPatternById('non-existent-pattern');
      expect(pattern).toBeUndefined();
    });
  });

  describe('getPatternsBySeverity', () => {
    it('should return CRITICAL patterns', () => {
      const patterns = getPatternsBySeverity('CRITICAL');
      expect(patterns.length).toBeGreaterThan(0);
      patterns.forEach(p => expect(p.severity).toBe('CRITICAL'));
    });

    it('should return HIGH patterns', () => {
      const patterns = getPatternsBySeverity('HIGH');
      expect(patterns.length).toBeGreaterThan(0);
      patterns.forEach(p => expect(p.severity).toBe('HIGH'));
    });

    it('should return MEDIUM patterns', () => {
      const patterns = getPatternsBySeverity('MEDIUM');
      expect(patterns.length).toBeGreaterThan(0);
      patterns.forEach(p => expect(p.severity).toBe('MEDIUM'));
    });

    it('should return LOW patterns', () => {
      const patterns = getPatternsBySeverity('LOW');
      expect(patterns.length).toBeGreaterThan(0);
      patterns.forEach(p => expect(p.severity).toBe('LOW'));
    });
  });

  describe('PATTERN_ENGINE_VERSION', () => {
    it('should have a valid version string', () => {
      expect(PATTERN_ENGINE_VERSION).toBeDefined();
      expect(typeof PATTERN_ENGINE_VERSION).toBe('string');
      expect(PATTERN_ENGINE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should be version 1.2.0 or higher', () => {
      expect(PATTERN_ENGINE_VERSION).toBe('1.2.0');
    });
  });
});
