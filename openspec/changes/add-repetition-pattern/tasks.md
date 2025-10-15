# Implementation Tasks: Repetition Detection Pattern

## 1. Text Tokenization
- [x] 1.1 Reuse or extend existing normalization to produce lowercase tokens stripped of punctuation.
- [x] 1.2 Build helpers to generate contiguous unigrams, bigrams, and trigrams with original offsets for context reconstruction.

## 2. Pattern Logic
- [x] 2.1 Implement frequency counters for n-grams with configurable thresholds based on character length:
  - ≤5,000 chars → threshold 3
  - 5,001–10,000 chars → threshold 4
  - >10,000 chars → threshold 5
- [x] 2.2 Surface the most frequent repeated units (up to a small cap, e.g., top 5) along with counts and context snippets.
- [x] 2.3 Register a LOW severity pattern in the registry that consumes the computed repetition findings.

## 3. Analyzer Integration
- [x] 3.1 Integrate repetition detection into the analyzer pipeline after normalization.
- [x] 3.2 Ensure pattern results populate `PatternMatch` objects with meaningful text samples and offsets.

## 4. Quality
- [x] 4.1 Add targeted unit tests covering each threshold band (≤5k, 5–10k, >10k) to confirm activation criteria.
- [x] 4.2 Add regression tests to ensure common words below threshold do not trigger false positives.
- [ ] 4.3 Benchmark against existing analyzer performance budget (10k chars) to confirm timing remains acceptable.
