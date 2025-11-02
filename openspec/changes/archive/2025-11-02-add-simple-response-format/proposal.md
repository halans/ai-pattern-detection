# Add Simple Response Format

**Change ID:** add-simple-response-format
**Status:** Draft
**Author:** AI Assistant
**Date:** 2025-10-19

## Summary

Add a `?simple` query parameter to the `/api/analyze` and `/api/analyze/file` endpoints that returns a minimal JSON response containing only the classification and confidence score, enabling lightweight integration scenarios and reduced bandwidth usage.

## Problem Statement

Currently, the API returns a comprehensive analysis report including pattern matches, explanations, metadata, and warnings. While this detailed response is valuable for full analysis workflows, some use cases only require the core detection result:

- **Browser extensions** displaying quick badges or indicators
- **API integrations** that perform their own result processing
- **High-volume batch processing** where bandwidth and parsing overhead matter
- **Mobile applications** with limited data transfer budgets

These scenarios don't need the full pattern breakdown, explanation text, or metadata, but must still parse and transfer the complete response.

## Goals

- Provide a minimal response format containing only classification and confidence score
- Enable the format via a `?simple` query parameter on existing endpoints
- Maintain backward compatibility (default response remains unchanged)
- Reduce response payload size by ~80-90% for simple format requests
- Support both text and file analysis endpoints equally

## Non-Goals

- Modifying the default (full) response format
- Adding multiple response format options (only simple vs. full)
- Changing the analysis engine or calculation logic
- Creating new endpoints (use existing endpoints with query parameter)

## User Stories

1. **As a browser extension developer**, I want to receive only the classification and score so I can display a quick indicator badge without parsing large JSON responses.

2. **As an API integrator**, I want to minimize bandwidth usage when processing thousands of documents by requesting only the essential detection results.

3. **As a mobile app developer**, I want to reduce data transfer costs by requesting minimal responses when showing quick analysis results.

## Proposed Solution

Add support for a `?simple` query parameter on `/api/analyze` and `/api/analyze/file` endpoints:

### Simple Response Format

```json
{
  "classification": "Likely AI Slop",
  "confidence_score": 87.5
}
```

### Full Response Format (default, unchanged)

```json
{
  "classification": "Likely AI Slop",
  "confidence_score": 87.5,
  "patterns_detected": [...],
  "explanation": "...",
  "metadata": {...}
}
```

### API Usage

```bash
# Full response (default)
POST /api/analyze
{"text": "..."}

# Simple response
POST /api/analyze?simple
{"text": "..."}

# Also works with explicit value
POST /api/analyze?simple=true
{"text": "..."}
```

## Technical Approach

1. Parse the `simple` query parameter from the request
2. Generate the full analysis internally (same logic as current implementation)
3. Conditionally return either the simple or full format based on the parameter
4. Add TypeScript types for the simple response format
5. Update tests to cover both response formats

## Success Metrics

- Simple response payload size is <1% of full response size
- No regression in analysis accuracy or performance
- Both endpoints support the parameter consistently
- Backward compatibility maintained (all existing clients continue working)

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Query parameter parsing errors | Treat any truthy value or presence as `simple=true`, ignore invalid values |
| Type safety for multiple response formats | Define union types and type guards in TypeScript |
| Documentation drift | Update API documentation and OpenAPI spec together |
| Testing complexity | Add dedicated test cases for both formats on both endpoints |

## Dependencies

None - this is a purely additive change that doesn't depend on other work.

## Future Considerations

- Add response format negotiation via `Accept` header (e.g., `Accept: application/vnd.slop.simple+json`)
- Support additional formats (CSV, XML) if demand emerges
- Add `?fields=classification,score,patterns` for custom field selection
