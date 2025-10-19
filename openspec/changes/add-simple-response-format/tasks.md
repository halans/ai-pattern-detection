# Implementation Tasks: Simple Response Format

## Backend Implementation

- [ ] Add `SimpleAnalysisResult` type definition to `backend/src/types/index.ts`
  - Define interface with `classification` and `confidence_score` fields
  - Export type for use in API handlers and tests

- [ ] Update `/api/analyze` endpoint in `backend/src/index.ts` to support `?simple` parameter
  - Parse `simple` query parameter using `c.req.query('simple')`
  - Generate full report as currently done
  - Conditionally return simple format `{ classification, confidence_score }` when parameter present
  - Return full format by default (backward compatible)

- [ ] Update `/api/analyze/file` endpoint in `backend/src/index.ts` to support `?simple` parameter
  - Apply same query parameter parsing logic as text endpoint
  - Ensure identical behavior between text and file endpoints
  - Maintain all existing error handling

- [ ] Add unit tests for query parameter parsing in `backend/src/index.test.ts`
  - Test `?simple` (no value) returns simple format
  - Test `?simple=true` returns simple format
  - Test `?simple=false` returns full format
  - Test no parameter returns full format (default)
  - Test `?simple=1` and other truthy values return simple format

- [ ] Add unit tests for simple format response structure in `backend/src/index.test.ts`
  - Verify simple response has exactly 2 fields
  - Verify `classification` field is present and valid
  - Verify `confidence_score` field is present and valid (0-100)
  - Verify no additional fields are present

- [ ] Add integration tests for both endpoints with simple format in `backend/src/index.test.ts`
  - Test `POST /api/analyze?simple` with valid text returns simple format
  - Test `POST /api/analyze/file?simple` with valid file returns simple format
  - Test classification and score match between simple and full formats for same input
  - Test error responses maintain standard format with simple parameter

## Frontend Implementation

- [ ] Add `SimpleAnalysisResult` type definition to `frontend/src/types/index.ts`
  - Mirror backend type definition
  - Ensure type consistency across frontend and backend

- [ ] Update `analyzeText` function in `frontend/src/utils/api.ts` to accept optional `simple` parameter
  - Add optional `simple?: boolean` parameter to function signature
  - Append `?simple` to URL when parameter is true
  - Update return type to `Promise<AnalysisResult | SimpleAnalysisResult>`

- [ ] Update `analyzeFile` function in `frontend/src/utils/api.ts` to accept optional `simple` parameter
  - Add optional `simple?: boolean` parameter to function signature
  - Append `?simple` to URL when parameter is true
  - Update return type to `Promise<AnalysisResult | SimpleAnalysisResult>`

- [ ] Add type guard utility to `frontend/src/types/index.ts`
  - Implement `isSimpleResult()` function to distinguish response types at runtime
  - Use type predicate for TypeScript type narrowing

## Testing and Validation

- [ ] Run backend unit tests to verify simple format functionality
  - Execute `npm test` in backend directory
  - Verify all new tests pass
  - Ensure no regressions in existing tests

- [ ] Run manual API tests with curl or Postman
  - Test `POST /api/analyze?simple` with sample text
  - Test `POST /api/analyze` without parameter (verify backward compatibility)
  - Test `POST /api/analyze/file?simple` with sample file
  - Verify response structure matches specification

- [ ] Verify type safety with TypeScript compiler
  - Run `npm run type-check` in both backend and frontend
  - Ensure no type errors introduced
  - Verify union types work correctly

## Documentation

- [ ] Update API documentation or README with simple format usage examples
  - Document `?simple` query parameter
  - Show example request and response
  - Clarify backward compatibility

- [ ] Add code comments explaining simple format logic in `backend/src/index.ts`
  - Document query parameter parsing
  - Explain response format selection

## Validation and Cleanup

- [ ] Run `openspec validate add-simple-response-format --strict`
  - Ensure all spec requirements are properly formatted
  - Verify no validation errors

- [ ] Review all code changes for consistency
  - Check TypeScript strict mode compliance
  - Verify 2-space indentation
  - Ensure ESLint passes

- [ ] Verify backward compatibility
  - Confirm default behavior unchanged when parameter not used
  - Test with existing frontend code (should work without modification)
  - Verify error responses maintain current structure
