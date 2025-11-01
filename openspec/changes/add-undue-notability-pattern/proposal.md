# Add Undue Notability Coverage Pattern

**Change ID:** add-undue-notability-pattern  
**Status:** Draft  
**Author:** AI Assistant  
**Date:** 2025-11-01

## Summary

Introduce a new HIGH severity pattern that detects exaggerated coverage claims such as “featured in multiple media outlets including Forbes, TechCrunch, and Bloomberg.” The detector will capture the enumerated outlet list via a named capture group for downstream reporting.

## Problem Statement

- AI-generated bios and marketing blurbs frequently fabricate third-party validation by claiming coverage across famous outlets.
- Existing patterns do not target this structure; they focus on collaborative tone, jargon, or rhetorical reframing.
- Failing to flag these claims misses a high-signal indicator of synthetic promotional copy.

## Goals

1. Add a `undue-notability` pattern to `backend/src/patterns/registry.ts` with severity `HIGH` and weight `8`.
2. Use the provided regex (with dotall + case-insensitive support) and surface the captured `outlet_list` group for analysis.
3. Expand unit tests in `registry.test.ts` to cover positive matches, negative cases, and capture-group integrity.
4. Update documentation (Pattern Update notes, README footprint if necessary) and increment `PATTERN_ENGINE_VERSION`.

## Non-Goals

- Building heuristics that validate whether the listed outlets are real or relevant.
- Detecting generic mentions of a single publication (“featured in Forbes”) without the broader, multi-outlet framing.
- Handling non-Latin scripts or localized publication names beyond the given regex scope.

## User Stories

- **As a content reviewer**, I want to flag fabricated earned media claims so that spammy submissions can be triaged quickly.
- **As a trust & safety analyst**, I want high-severity alerts when text asserts multi-outlet coverage, enabling escalation workflows.
- **As a journalist**, I want to detect boilerplate press releases that falsely imply widespread coverage.

## Proposed Changes

- Add the `undue-notability` pattern object to the HIGH severity section of the registry, just after similar credibility-focused detectors.
- Capture the outlet enumeration in the `outlet_list` named group for display within reports.
- Extend tests to verify detection across colon, dash, and list variants, ensure the capture group collects all outlets, and confirm negative cases such as legitimate single-outlet statements are ignored.
- Bump `PATTERN_ENGINE_VERSION` and adjust affected docs/tests.

## Dependencies / Open Questions

- None identified; the pattern is self-contained and mirrors existing registry conventions.

