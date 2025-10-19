# API Response Format Specification

## ADDED Requirements

### Requirement: Simple Response Format Query Parameter

The `/api/analyze` and `/api/analyze/file` endpoints MUST accept a `simple` query parameter that returns a minimal response containing only classification and confidence score.

#### Scenario: Simple format requested via query parameter

**Given** a user makes a POST request to `/api/analyze?simple` with valid text
**When** the analysis completes successfully
**Then** the response must contain only `classification` and `confidence_score` fields
**And** the response must not contain `patterns_detected`, `explanation`, or `metadata` fields
**And** the HTTP status code must be 200

#### Scenario: Simple format with explicit true value

**Given** a user makes a POST request to `/api/analyze?simple=true` with valid text
**When** the analysis completes successfully
**Then** the response must return the simple format (only classification and score)
**And** the response must be identical to using `?simple` without a value

#### Scenario: Default full format when parameter absent

**Given** a user makes a POST request to `/api/analyze` without the simple parameter
**When** the analysis completes successfully
**Then** the response must contain all fields: `classification`, `confidence_score`, `patterns_detected`, `explanation`, and `metadata`
**And** the response format must be unchanged from current behavior

#### Scenario: File analysis endpoint supports simple format

**Given** a user makes a POST request to `/api/analyze/file?simple` with a valid file
**When** the file analysis completes successfully
**Then** the response must return only `classification` and `confidence_score` fields
**And** the behavior must be identical to the text analysis endpoint

### Requirement: Simple Format Response Structure

The simple format response MUST be a valid JSON object with exactly two fields.

#### Scenario: Simple response contains classification

**Given** a simple format response is generated
**When** the response is returned to the client
**Then** it must contain a `classification` field
**And** the value must be one of: "Likely AI Slop", "Mixed/Uncertain", or "Likely Human"
**And** the classification must match the value that would appear in the full format

#### Scenario: Simple response contains confidence score

**Given** a simple format response is generated
**When** the response is returned to the client
**Then** it must contain a `confidence_score` field
**And** the value must be a number between 0 and 100 (inclusive)
**And** the score must match the value that would appear in the full format

#### Scenario: Simple response has no additional fields

**Given** a simple format response is generated
**When** the response is serialized to JSON
**Then** it must contain exactly 2 fields
**And** no other fields from the full format must be present

### Requirement: Analysis Consistency Across Formats

The analysis results (classification and confidence score) MUST be identical regardless of the response format requested.

#### Scenario: Same analysis for both formats

**Given** a user analyzes the same text twice
**When** one request uses `?simple` and the other uses the default format
**Then** the `classification` value must be identical in both responses
**And** the `confidence_score` value must be identical in both responses
**And** the analysis engine must execute the same logic for both requests

#### Scenario: Full analysis always performed

**Given** a user requests simple format with `?simple`
**When** the backend processes the request
**Then** the complete analysis must be performed (patterns detected, explanation generated)
**And** only the response formatting must differ, not the analysis depth
**And** the simple format must be derived from the full analysis results

### Requirement: Error Response Format Consistency

Error responses MUST maintain their current format regardless of the `simple` query parameter.

#### Scenario: Validation error with simple parameter

**Given** a user makes a POST request to `/api/analyze?simple` with invalid input (e.g., empty text)
**When** validation fails
**Then** the response must return the standard error format with `error` and `message` fields
**And** the simple parameter must not affect error response structure
**And** the HTTP status code must be 400

#### Scenario: Server error with simple parameter

**Given** a user makes a POST request to `/api/analyze?simple` that triggers an internal error
**When** the error occurs
**Then** the response must return the standard error format
**And** the HTTP status code must be 500

### Requirement: Query Parameter Parsing

The `simple` query parameter MUST be interpreted as a boolean flag based on presence.

#### Scenario: Parameter presence indicates simple format

**Given** a request includes `?simple` (no value)
**When** the query parameter is parsed
**Then** it must be interpreted as requesting simple format

#### Scenario: Explicit false value returns full format

**Given** a request includes `?simple=false`
**When** the query parameter is parsed
**Then** it must be interpreted as requesting full format (default behavior)

#### Scenario: Any truthy value returns simple format

**Given** a request includes `?simple=1` or `?simple=yes` or other truthy string
**When** the query parameter is parsed
**Then** it must be interpreted as requesting simple format

### Requirement: Type Safety for Response Formats

TypeScript type definitions MUST accurately represent both response formats.

#### Scenario: Simple response type definition

**Given** the backend type definitions are defined
**When** a developer imports the types
**Then** a `SimpleAnalysisResult` interface must be available
**And** it must include only `classification` and `confidence_score` properties
**And** both properties must be required (not optional)

#### Scenario: Frontend type consistency

**Given** the frontend makes an API request with the simple parameter
**When** the response is received
**Then** TypeScript must correctly type the response as `SimpleAnalysisResult | AnalysisResult`
**And** type guards must be available to distinguish between formats at runtime

### Requirement: Backward Compatibility

Existing API clients MUST continue to function without modification.

#### Scenario: Default behavior unchanged

**Given** an existing API client that does not use the `simple` parameter
**When** it makes requests to `/api/analyze` or `/api/analyze/file`
**Then** all responses must maintain the current full format
**And** no breaking changes must occur to response structure
**And** all existing fields must remain present and unchanged

#### Scenario: Optional parameter does not break clients

**Given** an API client using a strict JSON schema validator for responses
**When** the `simple` query parameter is added to the API
**Then** existing clients must receive the same response structure they expect
**And** no validation errors must occur for clients not using the parameter
