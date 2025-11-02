import { describe, it, expect } from 'vitest';
import { PATTERNS, getPatternById, getPatternsBySeverity, PATTERN_ENGINE_VERSION } from './registry';

describe('Pattern Registry', () => {
  describe('PATTERNS array', () => {
    it('should contain patterns', () => {
      expect(PATTERNS).toBeDefined();
      expect(PATTERNS.length).toBeGreaterThan(0);
    });

    it('should have at least 46 patterns', () => {
      expect(PATTERNS.length).toBeGreaterThanOrEqual(47);
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
        expect(pattern.weight).toBeLessThanOrEqual(15);
      });
    });

    it('should have proper weight assignments by severity', () => {
      const criticalPatterns = PATTERNS.filter(p => p.severity === 'CRITICAL');
      const highPatterns = PATTERNS.filter(p => p.severity === 'HIGH');
      const mediumPatterns = PATTERNS.filter(p => p.severity === 'MEDIUM');
      const lowPatterns = PATTERNS.filter(p => p.severity === 'LOW');
      const veryLowPatterns = PATTERNS.filter(p => p.severity === 'VERY_LOW');
      const informationalPatterns = PATTERNS.filter(p => p.severity === 'INFORMATIONAL');

      criticalPatterns.forEach(p => expect(p.weight).toBe(15));
      highPatterns.forEach(p => expect(p.weight).toBe(8));
      mediumPatterns.forEach(p => expect(p.weight).toBe(4));
      lowPatterns.forEach(p => expect(p.weight).toBe(2));
      veryLowPatterns.forEach(p => expect(p.weight).toBe(1));
      informationalPatterns.forEach(p => expect(p.weight).toBeCloseTo(0.2, 5));
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

    describe('Contrastive Reframe Pattern', () => {
      const pattern = getPatternById('contrastive-reframe');
      const makeRegex = () => new RegExp(pattern!.regex.source, pattern!.regex.flags);

      it('should be registered with correct metadata', () => {
        expect(pattern).toBeDefined();
        expect(pattern!.severity).toBe('HIGH');
        expect(pattern!.weight).toBe(8);
        expect(pattern!.name).toBe('Contrastive Reframe');
        expect(pattern!.description.length).toBeGreaterThan(0);
        expect(pattern!.examples.length).toBeGreaterThanOrEqual(4);
        expect(pattern!.regex.flags).toContain('g');
        expect(pattern!.regex.flags).toContain('i');
        expect(pattern!.regex.flags).toContain('s');
        expect(pattern!.regex.flags).toContain('u');
      });

      it('should match intensifier variations', () => {
        const samples = [
          "It's not just a tool, it's a paradigm shift",
          "It's not only about efficiency, it's about transformation",
          'It is not merely a framework; it is a comprehensive ecosystem',
          "It's not simply a design choice. It's a fundamental philosophy",
          "It's not a bug—it's a feature request",
        ];

        samples.forEach(sample => {
          const regex = makeRegex();
          const match = regex.exec(sample);
          expect(match).not.toBeNull();
        });
      });

      it('should match punctuation variations', () => {
        const samples = [
          "It's not just efficiency, it's transformation",
          "It's not just efficiency; it's transformation",
          "It's not just efficiency: it's transformation",
          "It's not just efficiency\u2014it's transformation",
          "It's not just efficiency\u2013it's transformation",
          "It's not just efficiency. It's transformation",
        ];

        samples.forEach(sample => {
          const regex = makeRegex();
          const match = regex.exec(sample);
          expect(match).not.toBeNull();
        });
      });

      it('should match apostrophe and case variations', () => {
        const samples = [
          "It\u2019s not just a tool, it\u2019s a paradigm shift",
          "It is not just a framework, it is an ecosystem",
          "it's not just a tool, it's a paradigm shift",
        ];

        samples.forEach(sample => {
          const regex = makeRegex();
          const match = regex.exec(sample);
          expect(match).not.toBeNull();
        });
      });

      it('should capture X and Y clauses via named groups', () => {
        const sample = "It's not just a tool, it's a paradigm shift";
        const match = makeRegex().exec(sample);
        expect(match?.groups?.X).toBe('a tool');
        expect(match?.groups?.Y).toBe('a paradigm shift');
      });

      it('should capture named groups for simple clauses', () => {
        const sample = "It's not just simple, it's complex";
        const match = makeRegex().exec(sample);
        expect(match?.groups?.X).toBe('simple');
        expect(match?.groups?.Y).toBe('complex');
      });

      it('should capture clauses without punctuation bleed', () => {
        const sample = 'It is not merely a framework; it is a comprehensive ecosystem';
        const match = makeRegex().exec(sample);
        expect(match?.groups?.X).toBe('a framework');
        expect(match?.groups?.Y).toBe('a comprehensive ecosystem');
      });

      it('should support multiple matches within the same text', () => {
        const sample =
          "It's not just a tool, it's a paradigm shift. It's not only a feature, it's an entire solution.";
        const regex = makeRegex();
        const matches = Array.from(sample.matchAll(regex));
        expect(matches.length).toBe(2);
        expect(matches[0]?.groups?.X).toBe('a tool');
        expect(matches[0]?.groups?.Y).toBe('a paradigm shift');
        expect(matches[1]?.groups?.X).toBe('a feature');
        expect(matches[1]?.groups?.Y).toBe('an entire solution');
      });

      it('should match when clauses span multiple lines', () => {
        const sample = "It's not just a tool,\nit's a paradigm shift";
        const match = makeRegex().exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.X).toBe('a tool');
        expect(match?.groups?.Y).toBe('a paradigm shift');
      });

      it('should handle long X and Y clauses', () => {
        const sample =
          "It's not just a collection of loosely connected features that happen to coexist in the same interface—it's a rigorously orchestrated platform experience designed to anticipate user intent across the entire workflow";
        const match = makeRegex().exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.X).toBe(
          'a collection of loosely connected features that happen to coexist in the same interface'
        );
        expect(match?.groups?.Y).toBe(
          'a rigorously orchestrated platform experience designed to anticipate user intent across the entire workflow'
        );
      });

      it('should not match invalid structures', () => {
        const negatives = [
          "It's not ready yet",
          "This is not just a tool, this is a paradigm shift",
          'Not only a tool but also a paradigm shift',
          "It isn't just a tool, it's a paradigm shift",
          "It's not just a tool, a paradigm shift",
        ];

        negatives.forEach(sample => {
          const regex = makeRegex();
          expect(regex.test(sample)).toBe(false);
        });
      });
    });

    describe('Undue Notability Pattern', () => {
      const pattern = getPatternById('undue-notability');
      const makeRegex = () => new RegExp(pattern!.regex.source, pattern!.regex.flags);
      const normalize = (value?: string) =>
        value?.replace(/^\s*(?:including\s+)?/i, '').replace(/\s*\.$/, '');

      it('should be registered with correct metadata', () => {
        expect(pattern).toBeDefined();
        expect(pattern!.severity).toBe('HIGH');
        expect(pattern!.weight).toBe(8);
        expect(pattern!.name).toBe('Undue Notability Claim');
        expect(pattern!.description.length).toBeGreaterThan(0);
        expect(pattern!.examples.length).toBeGreaterThanOrEqual(3);
        expect(pattern!.regex.flags).toContain('g');
        expect(pattern!.regex.flags).toContain('i');
        expect(pattern!.regex.flags).toContain('s');
        expect(pattern!.regex.flags).toContain('u');
      });

      it('should match coverage claims with including lists', () => {
        const sample =
          'Our launch has been featured in multiple media outlets including Forbes, TechCrunch, and Bloomberg.';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(normalize(match?.groups?.outlet_list)).toBe('Forbes, TechCrunch, and Bloomberg');
      });

      it('should match colon-separated outlet lists', () => {
        const sample =
          'The project was reported by national press: The New York Times, The Washington Post, and The Guardian.';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(normalize(match?.groups?.outlet_list)).toBe(
          'The New York Times, The Washington Post, and The Guardian'
        );
      });

      it('should match dash-separated outlet lists', () => {
        const sample =
          'Our story has been covered by various tech outlets—Wired, Fast Company, and VentureBeat.';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(normalize(match?.groups?.outlet_list)).toBe('Wired, Fast Company, and VentureBeat');
      });

      it('should match independent coverage phrasing', () => {
        const sample =
          'Independent coverage has examined the initiative with coverage by international tech media.';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.outlet_list).toBeUndefined();
      });

      it('should support multiple matches in one paragraph', () => {
        const sample =
          'We were highlighted by several media outlets including CNBC and Bloomberg. Independent coverage has analyzed our approach with coverage by international tech media.';
        const regex = makeRegex();
        const matches = Array.from(sample.matchAll(regex));
        expect(matches.length).toBe(2);
        expect(normalize(matches[0]?.groups?.outlet_list)).toBe('CNBC and Bloomberg');
        expect(matches[1]?.groups?.outlet_list).toBeUndefined();
      });

      it('should not match invalid or single-outlet statements', () => {
        const negatives = [
          'Our product was featured in Forbes last week.',
          'We were featured in media outlets across the globe.',
          'Recently featured by local press in berlin.',
          'Coverage noted by analysts and experts.',
        ];

        negatives.forEach(sample => {
          const regex = makeRegex();
          expect(regex.test(sample)).toBe(false);
        });
      });
    });

    describe('superficial-analyses pattern', () => {
      const makeRegex = () => {
        const pattern = PATTERNS.find(p => p.id === 'superficial-analyses');
        expect(pattern).toBeDefined();
        return new RegExp(pattern!.regex.source, pattern!.regex.flags);
      };

      it('should detect gerund form after comma', () => {
        const sample = "The policy was announced, highlighting the government's commitment to reform";
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.gerund).toBe('highlighting');
        expect(match?.groups?.claim).toMatch(/government.*commitment/);
      });

      it('should detect gerund form after semicolon', () => {
        const sample = 'The company expanded operations; underscoring its market dominance';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.gerund).toBe('underscoring');
      });

      it('should detect gerund form after em-dash', () => {
        const sample = "The monument was unveiled—showcasing the city's rich heritage";
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.gerund).toBe('showcasing');
      });

      it('should detect gerund form with "further" modifier', () => {
        const sample = 'The event occurred, further emphasizing stakeholder engagement';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.gerund).toBe('emphasizing');
      });

      it('should detect multi-word gerund verb phrases', () => {
        const sample = 'The report was published, attesting to widespread support';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        // Multi-word verbs like "attesting to" capture the full phrase in the gerund group
        expect(match?.groups?.gerund).toMatch(/attesting/);
      });

      it('should detect finite form with demonstrative "This"', () => {
        const sample = 'This underscores the importance of early intervention';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.finite).toBe('underscores');
        expect(match?.groups?.claim2).toMatch(/importance/);
      });

      it('should detect finite form with demonstrative "That"', () => {
        const sample = 'That highlights the challenges facing the industry';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.finite).toBe('highlights');
      });

      it('should detect finite form with demonstrative "It"', () => {
        const sample = 'It demonstrates significant progress in the field';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.finite).toBe('demonstrates');
      });

      it('should detect finite form with noun subject "the move"', () => {
        const sample = "The move underscores the organization's commitment to transparency";
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.finite).toBe('underscores');
      });

      it('should detect finite form with noun subject "the decision"', () => {
        const sample = "The decision highlights the committee's priorities";
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.finite).toBe('highlights');
      });

      it('should detect finite form with noun subject "the event"', () => {
        const sample = "The event showcases the city's cultural diversity";
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.finite).toBe('showcases');
      });

      it('should detect standalone finite form "aligns with"', () => {
        const sample = 'The strategy aligns with our core values';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.finite2).toMatch(/aligns with/);
        expect(match?.groups?.claim3).toMatch(/core values/);
      });

      it('should detect standalone finite form "contributes to"', () => {
        const sample = 'This approach contributes to long-term sustainability';
        const regex = makeRegex();
        const match = regex.exec(sample);
        expect(match).not.toBeNull();
        expect(match?.groups?.finite2).toMatch(/contributes to/);
      });

      it('should support multiple matches in one paragraph', () => {
        const sample =
          'The policy was announced, highlighting its importance. This underscores the committee\'s dedication. The move aligns with international standards.';
        const regex = makeRegex();
        const matches = Array.from(sample.matchAll(regex));
        expect(matches.length).toBe(3);
        expect(matches[0]?.groups?.gerund).toBe('highlighting');
        expect(matches[1]?.groups?.finite).toBe('underscores');
        // "The move aligns with" matches the finite form (noun subject pattern), not finite2
        expect(matches[2]?.groups?.finite).toMatch(/aligns with/);
      });

      it('should not match simple past tense', () => {
        const sample = 'They highlighted key issues in the meeting';
        const regex = makeRegex();
        expect(regex.test(sample)).toBe(false);
      });

      it('should not match gerund as sentence subject', () => {
        const sample = 'Highlighting important points requires careful reading';
        const regex = makeRegex();
        expect(regex.test(sample)).toBe(false);
      });

      it('should not match noun usage', () => {
        const sample = 'The highlighting tool is useful for students';
        const regex = makeRegex();
        expect(regex.test(sample)).toBe(false);
      });

      it('should not match participial adjective', () => {
        const sample = 'Underscored text appears darker on the page';
        const regex = makeRegex();
        expect(regex.test(sample)).toBe(false);
      });

      it('should not match standard subject-verb construction', () => {
        const sample = 'She emphasizes quality over quantity in her work';
        const regex = makeRegex();
        expect(regex.test(sample)).toBe(false);
      });
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

    it('should match the current pattern engine version', () => {
      expect(PATTERN_ENGINE_VERSION).toBe('1.8.0');
    });
  });
});
