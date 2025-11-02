# Design Document: Simple Response Format

## Architecture Overview

This change introduces conditional response formatting in the API layer without modifying the core analysis engine. The architecture follows the principle of "analyze once, format conditionally."

## Component Changes

### 1. API Layer (`backend/src/index.ts`)

**Current Flow:**
```
Request → Validation → Analysis → ReportGenerator.generate() → Full JSON Response
```

**New Flow:**
```
Request → Parse ?simple param → Validation → Analysis → ReportGenerator.generate()
  ├─ if simple: return { classification, confidence_score }
  └─ else: return full report
```

### 2. Type Definitions (`backend/src/types/index.ts`)

Add new type for simple response:

```typescript
export interface SimpleAnalysisResult {
  classification: Classification;
  confidence_score: number;
}
```

The API will return `SimpleAnalysisResult | AnalysisResult` based on the query parameter.

### 3. Report Generator (`backend/src/reporting/generator.ts`)

Add a new static method:

```typescript
static generateSimple(
  classification: Classification,
  score: number
): SimpleAnalysisResult {
  return {
    classification,
    confidence_score: score,
  };
}
```

Alternative: Extract simple format from full report (no new method needed).

## Implementation Details

### Query Parameter Parsing

Using Hono's built-in query parsing:

```typescript
const simple = c.req.query('simple');
const useSimpleFormat = simple !== undefined; // ?simple or ?simple=true both work
```

**Edge cases:**
- `?simple` → simple format
- `?simple=true` → simple format
- `?simple=false` → full format
- `?simple=anything` → simple format (presence-based)
- No parameter → full format (default)

### Response Construction

**Option A: Generate full report, then extract** (Recommended)
```typescript
const fullReport = ReportGenerator.generate(...);

if (useSimpleFormat) {
  return c.json({
    classification: fullReport.classification,
    confidence_score: fullReport.confidence_score,
  });
}

return c.json(fullReport);
```

**Advantages:**
- Simpler code path
- No duplication of logic
- Easier to test
- Future-proof (any calculation changes automatically apply)

**Option B: Conditional generation**
```typescript
if (useSimpleFormat) {
  return c.json(ReportGenerator.generateSimple(classification, score));
}

return c.json(ReportGenerator.generate(...));
```

**Advantages:**
- Slightly more efficient (skips metadata construction)
- More explicit intent

**Decision:** Use Option A for simplicity and maintainability.

## Data Flow Diagram

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/analyze?simple
       ▼
┌─────────────────────────┐
│  API Handler            │
│  - Parse query param    │
│  - Validate input       │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Analysis Engine        │
│  - Normalize text       │
│  - Detect patterns      │
│  - Calculate score      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  ReportGenerator        │
│  - Build full report    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Response Formatting    │
│  if (simple):           │
│    return { class, score }│
│  else:                  │
│    return full report   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────┐
│   Client    │
└─────────────┘
```

## Type Safety

Frontend type definitions must be updated:

```typescript
// frontend/src/types/index.ts
export interface SimpleAnalysisResult {
  classification: Classification;
  confidence_score: number;
}

// Update API client
export async function analyzeText(
  text: string,
  simple?: boolean
): Promise<AnalysisResult | SimpleAnalysisResult> {
  const url = simple
    ? `${API_URL}/api/analyze?simple`
    : `${API_URL}/api/analyze`;
  // ...
}
```

Type guard for runtime checking:

```typescript
function isSimpleResult(
  result: AnalysisResult | SimpleAnalysisResult
): result is SimpleAnalysisResult {
  return !('patterns_detected' in result);
}
```

## Performance Considerations

### Response Size Comparison

**Full Response:** ~5-15 KB (varies with pattern matches)
- Classification: ~20 bytes
- Confidence score: ~10 bytes
- Pattern matches: ~3-10 KB
- Explanation: ~500-2000 bytes
- Metadata: ~300 bytes

**Simple Response:** ~60 bytes
```json
{"classification":"Likely AI Slop","confidence_score":87.5}
```

**Reduction:** 99%+ in typical cases

### Computational Cost

No difference - analysis runs identically regardless of output format. The only savings are in JSON serialization and network transfer.

## Testing Strategy

### Unit Tests

1. Query parameter parsing
   - `?simple` returns simple format
   - `?simple=true` returns simple format
   - `?simple=false` returns full format
   - No parameter returns full format

2. Response structure validation
   - Simple format has only 2 fields
   - Full format has all 5 fields
   - Values match between formats

### Integration Tests

1. Both endpoints support simple format:
   - `POST /api/analyze?simple`
   - `POST /api/analyze/file?simple`

2. Error responses work with simple parameter:
   - Validation errors
   - Processing errors

### E2E Tests

Browser extension or API client test that:
1. Requests simple format
2. Parses response
3. Displays classification badge

## Security Considerations

No security implications - this is a read-only formatting change that doesn't affect:
- Authentication
- Authorization
- Input validation
- Rate limiting
- Data storage or privacy

## Backward Compatibility

✅ **Fully backward compatible**

- Default behavior unchanged (full response)
- New parameter is optional
- Existing clients work without modification
- No breaking changes to types or endpoints

## Alternatives Considered

### 1. Separate endpoint (`/api/analyze/simple`)

**Rejected:** Adds endpoint proliferation and maintenance burden.

### 2. Request body parameter (`{"text": "...", "format": "simple"}`)

**Rejected:** Output format selection is better suited for query parameters (HTTP conventions).

### 3. Content negotiation via `Accept` header

**Rejected:** Over-engineered for this use case. Could be added later if needed.

### 4. GraphQL-style field selection (`?fields=classification,score`)

**Rejected:** Too complex for current needs. Simple binary choice is sufficient.

## Migration Path

No migration needed - this is an opt-in feature.

Future work could deprecate the full format if simple format becomes dominant, but this is unlikely given the value of detailed reports.

## Open Questions

None - design is straightforward and well-scoped.
