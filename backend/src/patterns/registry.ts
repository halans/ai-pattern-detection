// Pattern Registry - All AI detection patterns with weights
import { Pattern, Severity } from '../types';

const SEVERITY_WEIGHTS: Record<Severity, number> = {
  CRITICAL: 20,
  HIGH: 10,
  MEDIUM: 5,
  LOW: 2,
};

export const PATTERNS: Pattern[] = [
  // CRITICAL patterns - definitive AI signals
  {
    id: 'ai-self-reference',
    name: 'AI Self-Reference',
    description: 'Explicit AI self-identification phrases',
    regex: /as an AI (language model|assistant|model)/gi,
    severity: 'CRITICAL',
    weight: SEVERITY_WEIGHTS.CRITICAL,
    examples: ['as an AI language model', 'as an AI assistant'],
  },
  {
    id: 'knowledge-cutoff',
    name: 'Knowledge Cutoff Disclaimer',
    description: 'References to AI training data cutoffs',
    regex: /as (of|at) my (last|latest) (update|training|knowledge)/gi,
    severity: 'CRITICAL',
    weight: SEVERITY_WEIGHTS.CRITICAL,
    examples: ['as of my last update', 'as at my latest training'],
  },

  // HIGH severity patterns
  {
    id: 'significance-statement',
    name: 'Significance Statement',
    description: 'Significance statements commonly used in AI text',
    regex: /(stands|serves) as a (testament|symbol)/gi,
    severity: 'HIGH',
    weight: SEVERITY_WEIGHTS.HIGH,
    examples: ['stands as a testament to', 'serves as a symbol of'],
  },
  {
    id: 'editorializing',
    name: 'Editorializing Phrase',
    description: 'Unnecessary editorializing phrases',
    regex: /it('s| is) important to (note|remember|understand)/gi,
    severity: 'HIGH',
    weight: SEVERITY_WEIGHTS.HIGH,
    examples: ["it's important to note", 'it is important to remember'],
  },
  {
    id: 'placeholder-template',
    name: 'Placeholder Template',
    description: 'Placeholder text patterns',
    regex: /\[.*placeholder.*\]/gi,
    severity: 'HIGH',
    weight: SEVERITY_WEIGHTS.HIGH,
    examples: ['[insert example here]', '[placeholder text]'],
  },
  {
    id: 'collaborative-certainly',
    name: 'Collaborative: Certainly',
    description: 'Overly helpful collaborative phrases',
    regex: /(certainly|of course)!/gi,
    severity: 'HIGH',
    weight: SEVERITY_WEIGHTS.HIGH,
    examples: ['Certainly!', 'Of course!'],
  },
  {
    id: 'collaborative-would-you',
    name: 'Collaborative: Would You Like',
    description: 'Offering further assistance',
    regex: /would you like/gi,
    severity: 'HIGH',
    weight: SEVERITY_WEIGHTS.HIGH,
    examples: ['would you like me to explain'],
  },
  {
    id: 'collaborative-let-me-know',
    name: 'Collaborative: Let Me Know',
    description: 'Requesting feedback or clarification',
    regex: /let me know if/gi,
    severity: 'HIGH',
    weight: SEVERITY_WEIGHTS.HIGH,
    examples: ['let me know if you need', 'let me know if this helps'],
  },
  {
    id: 'collaborative-here-is',
    name: 'Collaborative: Here Is',
    description: 'Presenting information formally',
    regex: /here('s| is) a/gi,
    severity: 'HIGH',
    weight: SEVERITY_WEIGHTS.HIGH,
    examples: ["here's a summary", 'here is a breakdown'],
  },
  {
    id: 'collaborative-hope-helps',
    name: 'Collaborative: I Hope This Helps',
    description: 'Closing with helpful intent',
    regex: /I hope this helps/gi,
    severity: 'HIGH',
    weight: SEVERITY_WEIGHTS.HIGH,
    examples: ['I hope this helps!'],
  },

  // MEDIUM severity patterns
  {
    id: 'cultural-cliche',
    name: 'Cultural Heritage Cliché',
    description: 'Overused cultural heritage phrases',
    regex: /rich (cultural|historical) (heritage|tapestry)/gi,
    severity: 'MEDIUM',
    weight: SEVERITY_WEIGHTS.MEDIUM,
    examples: ['rich cultural heritage', 'rich historical tapestry'],
  },
  {
    id: 'negative-parallelism',
    name: 'Negative Parallelism',
    description: 'Not only...but also constructions',
    regex: /not (just|only).{1,50}but (also|rather)/gi,
    severity: 'MEDIUM',
    weight: SEVERITY_WEIGHTS.MEDIUM,
    examples: ['not just affordable but also sustainable'],
  },
  {
    id: 'challenges-prospects',
    name: 'Challenges and Prospects',
    description: 'Formulaic challenges sections',
    regex: /despite (its|these) challenges/gi,
    severity: 'MEDIUM',
    weight: SEVERITY_WEIGHTS.MEDIUM,
    examples: ['despite these challenges', 'despite its challenges'],
  },
  {
    id: 'vague-attribution',
    name: 'Vague Attribution',
    description: 'Vague citations without specifics',
    regex: /(studies|research|experts) (show|suggest|indicate)/gi,
    severity: 'MEDIUM',
    weight: SEVERITY_WEIGHTS.MEDIUM,
    examples: ['studies show that', 'research suggests'],
  },
  {
    id: 'worth-mentioning',
    name: 'Worth Mentioning',
    description: 'Editorializing phrase for emphasis',
    regex: /worth mentioning/gi,
    severity: 'MEDIUM',
    weight: SEVERITY_WEIGHTS.MEDIUM,
    examples: ['worth mentioning that', 'it is worth mentioning'],
  },

  // LOW severity patterns
  {
    id: 'ritual-conclusion',
    name: 'Ritual Conclusion',
    description: 'Formulaic conclusion phrases',
    regex: /^(in summary|overall|in conclusion)/gim,
    severity: 'LOW',
    weight: SEVERITY_WEIGHTS.LOW,
    examples: ['In summary', 'Overall', 'In conclusion'],
  },
  {
    id: 'artificial-range',
    name: 'Artificial Range',
    description: 'From X to Y range patterns',
    regex: /from .{3,20} to .{3,20}/gi,
    severity: 'LOW',
    weight: SEVERITY_WEIGHTS.LOW,
    examples: ['from beginners to experts', 'from design to deployment'],
  },
  {
    id: 'profound-legacy',
    name: 'Profound Legacy',
    description: 'Cultural heritage cliché about lasting impact',
    regex: /profound legacy/gi,
    severity: 'MEDIUM',
    weight: SEVERITY_WEIGHTS.MEDIUM,
    examples: ['profound legacy of', 'left a profound legacy'],
  },
  {
    id: 'broken-citation',
    name: 'Broken Citation',
    description: 'Placeholder citations',
    regex: /\[(citation needed|source)\]/gi,
    severity: 'MEDIUM',
    weight: SEVERITY_WEIGHTS.MEDIUM,
    examples: ['[citation needed]', '[source]'],
  },
  {
    id: 'emoji-heading',
    name: 'Emoji in Heading',
    description: 'Emoji characters in markdown-style headings',
    regex: /^#+\s+.*[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gmu,
    severity: 'MEDIUM',
    weight: SEVERITY_WEIGHTS.MEDIUM,
    examples: ['# 🎯 Getting Started', '## 🚀 Features'],
  },
  {
    id: 'title-case-heading',
    name: 'Title Case Heading',
    description: 'Excessive title case in headings',
    regex: /^#+\s+([A-Z][a-z]+\s+){3,}/gm,
    severity: 'LOW',
    weight: SEVERITY_WEIGHTS.LOW,
    examples: ['# The Complete Guide To Modern Development', '## Best Practices For Writing Code'],
  },
  {
    id: 'em-dash-spam',
    name: 'Em-Dash Spam',
    description: 'Excessive use of em-dashes',
    regex: /(—.*){3,}/g,
    severity: 'LOW',
    weight: SEVERITY_WEIGHTS.LOW,
    examples: ['text—more text—even more—and more'],
  },
];

export function getPatternById(id: string): Pattern | undefined {
  return PATTERNS.find((p) => p.id === id);
}

export function getPatternsBySeverity(severity: Severity): Pattern[] {
  return PATTERNS.filter((p) => p.severity === severity);
}

export const PATTERN_ENGINE_VERSION = '1.1.0';
